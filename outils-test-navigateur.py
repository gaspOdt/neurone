# -*- coding: utf-8 -*-
"""Pilote un vrai Chrome pour tester le site, sans rien installer.

POURQUOI CET OUTIL EXISTE
-------------------------
Le panneau navigateur intégré à l'environnement de développement ne peint pas
la page. Or les événements `scroll`, `requestAnimationFrame` et les rappels
d'`IntersectionObserver` sont tous produits pendant l'ÉTAPE DE RENDU de la
boucle d'événements. Quand cette étape est sautée, aucun des trois ne part.
Mesuré : `window.scrollTo(0, 1200)` y change bien `scrollY` mais ne produit
zéro événement `scroll`.

Autrement dit, tout le comportement au défilement du site y était
invérifiable. Cet outil lance un vrai Chrome, qui rend réellement les pages,
et lui envoie de VRAIS mouvements de molette. Les événements sont donc
produits par le navigateur lui-même, exactement comme sous le doigt d'un
visiteur.

Aucune bibliothèque à installer : le client WebSocket tient en une soixantaine
de lignes de bibliothèque standard, ce qui respecte la règle du projet.

USAGE
-----
    python3 outils-test-navigateur.py            # macOS et Linux
    python outils-test-navigateur.py             # Windows
    ... --montrer                                # avec la fenêtre visible

Le chemin de Chrome est trouvé tout seul sur les trois systèmes. Pour imposer
un autre navigateur, définir la variable d'environnement CHROME.
"""

import base64, json, os, shutil, socket, struct, subprocess, sys, tempfile, time
import urllib.request


# ---------------------------------------------------------------------------
# Trouver le navigateur, quel que soit le système
# ---------------------------------------------------------------------------
# Le projet se développe sur macOS ET sur Windows. Un chemin écrit en dur ne
# survit pas au changement de machine, donc on cherche aux emplacements
# habituels des deux systèmes, puis sur Linux, et la variable d'environnement
# CHROME a toujours le dernier mot.

def trouver_chrome():
    force = os.environ.get("CHROME")
    if force:
        if not os.path.exists(force):
            raise SystemExit(
                "La variable CHROME pointe sur un fichier qui n'existe pas :\n  %s"
                % force)
        return force

    candidats = []

    if sys.platform == "darwin":
        candidats += [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            os.path.expanduser(
                "~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        ]
    elif os.name == "nt":
        dossiers = [os.environ.get("PROGRAMFILES"),
                    os.environ.get("PROGRAMFILES(X86)"),
                    os.environ.get("LOCALAPPDATA")]
        relatifs = [("Google", "Chrome", "Application", "chrome.exe"),
                    ("Chromium", "Application", "chrome.exe"),
                    ("Microsoft", "Edge", "Application", "msedge.exe")]
        for relatif in relatifs:
            for base in dossiers:
                if base:
                    candidats.append(os.path.join(base, *relatif))
    else:
        candidats += ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable",
                      "/usr/bin/chromium", "/usr/bin/chromium-browser",
                      "/snap/bin/chromium"]

    for chemin in candidats:
        if os.path.exists(chemin):
            return chemin

    # Dernier recours : un navigateur accessible depuis le PATH.
    for nom in ("google-chrome", "chromium", "chrome", "msedge"):
        trouve = shutil.which(nom)
        if trouve:
            return trouve

    raise SystemExit(
        "Chrome est introuvable sur cette machine.\n"
        "Installer Google Chrome, ou indiquer son chemin :\n"
        "  macOS, Linux  CHROME=/chemin/vers/chrome python3 outils-test-navigateur.py\n"
        "  Windows       $env:CHROME='C:\\chemin\\vers\\chrome.exe'"
        " ; python outils-test-navigateur.py")


def port_libre():
    """Demande au système un port dont il garantit qu'il est libre.

    Le port de débogage était écrit en dur à 9222, ce qui exposait à deux
    ennuis silencieux. Si un Chrome de test traîne encore d'une exécution
    précédente, l'outil se connecte à CELUI LÀ et teste une page qui n'est pas
    la nôtre, sans rien signaler. Et deux exécutions lancées en parallèle se
    marchent dessus. Un port attribué par le système supprime les deux cas.
    """
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


# ---------------------------------------------------------------------------
# Un client WebSocket minimal, bibliothèque standard uniquement
# ---------------------------------------------------------------------------

class WebSocket:
    """Assez de WebSocket pour parler au protocole DevTools : des trames texte."""

    def __init__(self, url, timeout=20):
        sans_schema = url.split("://", 1)[1]
        hote_port, chemin = sans_schema.split("/", 1)
        hote, port = hote_port.split(":")
        self.sock = socket.create_connection((hote, int(port)), timeout=timeout)
        self.sock.settimeout(timeout)

        cle = base64.b64encode(os.urandom(16)).decode()
        requete = (
            "GET /%s HTTP/1.1\r\nHost: %s\r\nUpgrade: websocket\r\n"
            "Connection: Upgrade\r\nSec-WebSocket-Key: %s\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n" % (chemin, hote_port, cle)
        )
        self.sock.sendall(requete.encode())

        entete = b""
        while b"\r\n\r\n" not in entete:
            morceau = self.sock.recv(4096)
            if not morceau:
                raise RuntimeError("connexion fermée pendant la poignée de main")
            entete += morceau
        if b"101" not in entete.split(b"\r\n")[0]:
            raise RuntimeError("Chrome a refusé la connexion : %r" % entete[:120])
        self.tampon = entete.split(b"\r\n\r\n", 1)[1]

    def envoyer(self, texte):
        charge = texte.encode()
        n = len(charge)
        trame = bytearray([0x81])                    # FIN + opcode texte
        if n < 126:
            trame.append(0x80 | n)                   # bit de masque obligatoire
        elif n < 65536:
            trame.append(0x80 | 126); trame += struct.pack(">H", n)
        else:
            trame.append(0x80 | 127); trame += struct.pack(">Q", n)
        masque = os.urandom(4)
        trame += masque
        trame += bytes(o ^ masque[i % 4] for i, o in enumerate(charge))
        self.sock.sendall(bytes(trame))

    def _lire(self, n):
        while len(self.tampon) < n:
            morceau = self.sock.recv(65536)
            if not morceau:
                raise RuntimeError("connexion fermée")
            self.tampon += morceau
        sortie, self.tampon = self.tampon[:n], self.tampon[n:]
        return sortie

    def recevoir(self):
        """Renvoie la charge utile de la prochaine trame texte."""
        while True:
            entete = self._lire(2)
            opcode = entete[0] & 0x0F
            longueur = entete[1] & 0x7F
            if longueur == 126:
                longueur = struct.unpack(">H", self._lire(2))[0]
            elif longueur == 127:
                longueur = struct.unpack(">Q", self._lire(8))[0]
            charge = self._lire(longueur)
            if opcode == 0x1:
                return charge.decode("utf-8", "replace")
            if opcode == 0x8:
                raise RuntimeError("le navigateur a fermé la connexion")
            # ping, pong, continuation : on ignore

    def fermer(self):
        try: self.sock.close()
        except Exception: pass


# ---------------------------------------------------------------------------
# Le navigateur
# ---------------------------------------------------------------------------

class Navigateur:
    def __init__(self, largeur=390, hauteur=844, montrer=False,
                 reduire_mouvement=False):
        self.port = port_libre()
        self.profil = tempfile.mkdtemp(prefix="chrome-test-")
        args = [
            trouver_chrome(),
            "--remote-debugging-port=%d" % self.port,
            "--user-data-dir=" + self.profil,
            "--no-first-run", "--no-default-browser-check",
            "--disable-background-timer-throttling",
            "--disable-renderer-backgrounding",
            "--disable-backgrounding-occluded-windows",
            "--window-size=%d,%d" % (largeur, hauteur),
            "about:blank",
        ]
        if not montrer:
            # --disable-gpu n'est plus nécessaire au headless récent, sauf sur
            # Windows où il évite encore des démarrages qui n'aboutissent pas.
            args[1:1] = ["--headless=new", "--disable-gpu"]
        self.proc = subprocess.Popen(args, stdout=subprocess.DEVNULL,
                                     stderr=subprocess.DEVNULL)
        self.ws = self._attendre_connexion()
        self.id = 0
        self.largeur, self.hauteur = largeur, hauteur
        # Émuler un vrai téléphone : c'est la cible principale du site.
        self.commande("Emulation.setDeviceMetricsOverride", {
            "width": largeur, "height": hauteur,
            "deviceScaleFactor": 2, "mobile": True})

        # Imposer la préférence de mouvement, et ne jamais la laisser au hasard.
        #
        # PIÈGE COÛTEUX, à ne pas repayer : Chrome en mode headless annonce de
        # lui-même `prefers-reduced-motion: reduce`. Le site fait alors
        # exactement ce qu'on lui demande, il coupe le mouvement et affiche
        # tout, et la batterie de tests concluait « échec, les cinq temps sont
        # visibles au chargement » en croyant tester un visiteur ordinaire.
        # Le site était juste, c'est la mesure qui était fausse.
        #
        # On émule donc explicitement la valeur voulue. Cela permet aussi de
        # tester le mode réduit POUR DE VRAI, en le demandant.
        self.reduire_mouvement = reduire_mouvement
        self.commande("Emulation.setEmulatedMedia", {
            "features": [{
                "name": "prefers-reduced-motion",
                "value": "reduce" if reduire_mouvement else "no-preference"
            }]})

    def _attendre_connexion(self, delai=25):
        fin = time.time() + delai
        derniere = None
        while time.time() < fin:
            try:
                brut = urllib.request.urlopen(
                    "http://127.0.0.1:%d/json/list" % self.port, timeout=2).read()
                cibles = json.loads(brut)
                pages = [c for c in cibles if c.get("type") == "page"]
                if pages:
                    return WebSocket(pages[0]["webSocketDebuggerUrl"])
            except Exception as e:
                derniere = e
            time.sleep(0.3)
        raise RuntimeError("Chrome n'a pas répondu sur le port %d (%s)"
                           % (self.port, derniere))

    def commande(self, methode, params=None):
        self.id += 1
        mon_id = self.id
        self.ws.envoyer(json.dumps({"id": mon_id, "method": methode,
                                    "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recevoir())
            if msg.get("id") == mon_id:
                if "error" in msg:
                    raise RuntimeError("%s : %s" % (methode, msg["error"]))
                return msg.get("result", {})

    # --- les gestes ---------------------------------------------------------

    # Le collecteur d'erreurs, posé AVANT que la page ne s'exécute.
    #
    # La batterie interrogeait `window.__erreurs`, que rien ne remplissait
    # jamais : le test « aucune erreur de console » était donc toujours vert,
    # y compris sur une page entièrement cassée. On installe le collecteur
    # nous-mêmes, et il doit être en place avant le premier script de la page,
    # sans quoi une erreur au chargement lui échapperait.
    COLLECTEUR = (
        "window.__erreurs = [];"
        "addEventListener('error', function (e) {"
        "  window.__erreurs.push(String(e.message || e.type));"
        "});"
        "addEventListener('unhandledrejection', function (e) {"
        "  window.__erreurs.push('promesse rejetee : ' + e.reason);"
        "});"
        "(function () {"
        "  var origine = console.error;"
        "  console.error = function () {"
        "    window.__erreurs.push(Array.prototype.join.call(arguments, ' '));"
        "    return origine.apply(console, arguments);"
        "  };"
        "})();"
    )

    def ouvrir(self, url, attente=2.5):
        self.commande("Page.enable")
        self.commande("Page.addScriptToEvaluateOnNewDocument",
                      {"source": self.COLLECTEUR})
        self.commande("Page.navigate", {"url": url})
        time.sleep(attente)

    def evaluer(self, js):
        """Évalue une expression et renvoie sa valeur JSON."""
        r = self.commande("Runtime.evaluate", {
            "expression": "(function(){%s})()" % js if "return" in js else js,
            "returnByValue": True, "awaitPromise": True})
        if r.get("exceptionDetails"):
            raise RuntimeError("erreur JS : %s" %
                               r["exceptionDetails"].get("text"))
        return r.get("result", {}).get("value")

    def molette(self, delta_y, x=None, y=None, pause=0.35):
        """Un VRAI mouvement de molette. C'est le navigateur qui produit
        l'événement `scroll`, exactement comme sous le doigt d'un visiteur."""
        self.commande("Input.dispatchMouseEvent", {
            "type": "mouseWheel",
            "x": x if x is not None else self.largeur // 2,
            "y": y if y is not None else self.hauteur // 2,
            "deltaX": 0, "deltaY": delta_y,
            "pointerType": "mouse"})
        time.sleep(pause)

    def defiler_jusqua(self, cible, pas=400, maxi=80):
        """Descend à la molette jusqu'à atteindre la position voulue."""
        for _ in range(maxi):
            y = self.evaluer("return Math.round(window.scrollY)")
            if abs(y - cible) < pas * 0.6 or (cible > y and y >= cible):
                break
            self.molette(pas if cible > y else -pas, pause=0.2)
        return self.evaluer("return Math.round(window.scrollY)")

    def capture(self, chemin):
        r = self.commande("Page.captureScreenshot", {"format": "png"})
        with open(chemin, "wb") as f:
            f.write(base64.b64decode(r["data"]))
        return chemin

    def fermer(self):
        try: self.ws.fermer()
        except Exception: pass
        try: self.proc.terminate(); self.proc.wait(timeout=5)
        except Exception: pass
        # Le profil temporaire pèse plusieurs mégaoctets. Il n'était jamais
        # supprimé : chaque exécution en laissait un dans le dossier temporaire
        # du système, sur macOS comme sur Windows.
        shutil.rmtree(self.profil, ignore_errors=True)


# ---------------------------------------------------------------------------
# La batterie de tests
# ---------------------------------------------------------------------------

def opacites(nav):
    return nav.evaluer(
        "return [...document.querySelectorAll('.temps')]"
        ".map(e=>Math.round(getComputedStyle(e).opacity*100))")


def lancer(url="http://127.0.0.1:8001", montrer=False):
    nav = Navigateur(montrer=montrer)
    resultats = []

    def verifier(nom, condition, detail=""):
        resultats.append((bool(condition), nom, detail))
        print(("  OK   " if condition else "  ECHEC") + "  " + nom
              + (("   " + detail) if detail else ""))

    try:
        nav.ouvrir(url)
        nav.evaluer("document.documentElement.style.scrollBehavior='auto'; return 1")

        print("\n1. Au chargement, sans rien toucher")
        depart = opacites(nav)
        verifier("un seul temps est visible", depart == [100, 0, 0, 0, 0], str(depart))

        print("\n2. On attend 4 secondes sans defiler")
        time.sleep(4)
        apres = opacites(nav)
        verifier("rien n'a bouge tout seul", apres == depart, str(apres))

        print("\n3. On defile a la molette, pour de vrai")
        vus = []
        for _ in range(14):
            nav.molette(500)
            vus.append((nav.evaluer("return Math.round(window.scrollY)"), opacites(nav)))
        n = lambda o: sum(1 for v in o if v > 50)
        verifier("le defilement fait apparaitre", max(n(o) for _, o in vus) > 1,
                 "max %d temps visibles" % max(n(o) for _, o in vus))
        verifier("les cinq temps apparaissent", max(n(o) for _, o in vus) == 5)
        verifier("la descente ne fait qu'ajouter",
                 all(n(vus[i][1]) >= n(vus[i - 1][1]) for i in range(1, len(vus))))
        for y, o in vus[:8]:
            print("        y=%-6d %s" % (y, ",".join(map(str, o))))

        print("\n4. On remonte")
        haut = []
        for _ in range(20):
            nav.molette(-500)
            haut.append((nav.evaluer("return Math.round(window.scrollY)"), opacites(nav)))
        verifier("la remontee ne fait que retirer",
                 all(n(haut[i][1]) <= n(haut[i - 1][1]) for i in range(1, len(haut))))
        verifier("retour a l'etat de depart", haut[-1][1] == depart, str(haut[-1][1]))

        print("\n5. La camera du parcours")
        nav.evaluer("window.scrollTo(0,0); return 1")
        ordre = []
        for _ in range(40):
            nav.molette(500, pause=0.15)
            v = nav.evaluer("return window.__parcours ? window.__parcours.vueActuelle() : null")
            if v and (not ordre or ordre[-1] != v):
                ordre.append(v)
        verifier("elle visite les parties dans l'ordre",
                 ordre == ["ensemble", "dendrites", "soma", "axone", "terminaisons"],
                 " > ".join(ordre))

        print("\n6. Erreurs de console")
        erreurs = nav.evaluer("return (window.__erreurs || []).slice(0, 10)") or []
        verifier("aucune erreur", not erreurs, " | ".join(erreurs))

    finally:
        nav.fermer()

    reussis = sum(1 for ok, _, _ in resultats if ok)
    print("\n%d/%d tests reussis" % (reussis, len(resultats)))
    return all(ok for ok, _, _ in resultats)


if __name__ == "__main__":
    ok = lancer(montrer="--montrer" in sys.argv)
    sys.exit(0 if ok else 1)
