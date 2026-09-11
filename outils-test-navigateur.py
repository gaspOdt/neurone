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
Le serveur doit tourner, dans un autre terminal, sur le port 8000 :

    python3 -m http.server 8000 --bind 127.0.0.1   # python sur Windows

Puis :

    python3 outils-test-navigateur.py            # macOS et Linux
    python outils-test-navigateur.py             # Windows
    ... --montrer                                # avec la fenêtre visible
    ... --url=http://127.0.0.1:8123              # si le port 8000 est pris

Le chemin de Chrome est trouvé tout seul sur les trois systèmes. Pour imposer
un autre navigateur, définir la variable d'environnement CHROME.
"""

import base64, json, os, shutil, socket, struct, subprocess, sys, tempfile, time
import urllib.request

# Windows : imposer l'UTF-8 sur la sortie.
#
# Dès que la sortie est redirigée vers un fichier, Python n'écrit plus dans la
# console mais dans la page de codes locale, cp1252 en France. Les accents
# partent alors en cp1252 dans un dépôt entièrement UTF-8, et surtout le
# moindre caractère absent de cp1252, une flèche ou une coche, lève
# UnicodeEncodeError et termine le processus avec le code 1.
#
# Or c'est précisément ce code de retour qui dit si la batterie a réussi : une
# simple flèche ajoutée un jour dans un message ferait passer une exécution
# parfaitement réussie pour un échec. errors="replace" garantit qu'un affichage
# ne peut plus faire tomber l'outil. Sans aucun effet sur macOS et Linux.
for _flux in (sys.stdout, sys.stderr):
    if hasattr(_flux, "reconfigure"):
        _flux.reconfigure(encoding="utf-8", errors="replace")

# Un ouvreur HTTP qui ignore le proxy du système.
#
# urllib fabrique son proxy tout seul à partir des réglages du poste. Sur
# Windows il les lit dans la base de registre, sans qu'aucune variable
# d'environnement soit posée, et `urllib.request.proxy_bypass("127.0.0.1")`
# répond False : la requête vers notre PROPRE Chrome partirait donc au proxy.
# Avec un proxy déclaré (établissement, entreprise, client VPN), l'échec est
# un `URLError getaddrinfo failed` sur le nom du proxy, et l'outil affiche
# « Chrome n'a pas répondu sur le port », ce qui envoie chercher le problème
# au mauvais endroit pendant une heure. Un dictionnaire vide coupe court.
OUVREUR = urllib.request.build_opener(urllib.request.ProxyHandler({}))


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
                brut = OUVREUR.open(
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

    def aller_a(self, y, pause=0.35):
        """Saute directement a une position de defilement.

        Dans un vrai Chrome, qui rend la page, window.scrollTo declenche bien
        l'evenement scroll : le saut est donc equivalent a la molette pour
        tout ce qui depend du defilement, et instantane. La molette reste
        utile quand on veut eprouver le geste lui-meme."""
        self.evaluer("window.scrollTo(0, %d); return 1" % y)
        time.sleep(pause)
        return self.evaluer("return Math.round(window.scrollY)")

    def defiler_jusqua(self, cible, pas=400, maxi=80):
        """Descend à la molette jusqu'à atteindre la position voulue."""
        for _ in range(maxi):
            y = self.evaluer("return Math.round(window.scrollY)")
            if abs(y - cible) < pas * 0.6 or (cible > y and y >= cible):
                break
            self.molette(pas if cible > y else -pas, pause=0.2)
        return self.evaluer("return Math.round(window.scrollY)")

    def capture(self, chemin, echelle=1.0):
        """Capture l'ecran. `echelle` reduit l'image AVANT de l'ecrire.

        Pour seulement CONSTATER que des pixels sont peints, une image au
        quart suffit et coute seize fois moins cher a decoder. Le decodage PNG
        se fait en Python pur, octet par octet : sur une image de 1440 par 722
        c'est plus de quatre millions d'operations, et c'etait le goulot de
        toute la batterie."""
        params = {"format": "png"}
        if echelle != 1.0:
            # ATTENTION : clip travaille en coordonnees de PAGE, pas de
            # fenetre. Sans decaler de la position de defilement, on capture
            # le haut du document quelle que soit la position reelle, et tout
            # ressort blanc. Piege paye une fois.
            y = self.evaluer("return Math.round(window.scrollY)") or 0
            x = self.evaluer("return Math.round(window.scrollX)") or 0
            params["clip"] = {"x": x, "y": y, "width": self.largeur,
                              "height": self.hauteur, "scale": echelle}
        r = self.commande("Page.captureScreenshot", params)
        with open(chemin, "wb") as f:
            f.write(base64.b64decode(r["data"]))
        return chemin

    def fermer(self):
        try: self.ws.fermer()
        except Exception: pass
        try: self.proc.terminate(); self.proc.wait(timeout=5)
        except Exception: pass
        # Le profil temporaire pèse plusieurs mégaoctets, et il n'était jamais
        # supprimé. Sur Windows, terminate() est TerminateProcess, une mise à
        # mort immédiate : Chrome ne relâche pas ses fichiers proprement, et la
        # suppression peut encore échouer une à deux secondes, le temps que les
        # processus enfants lâchent leurs descripteurs. Un ignore_errors seul
        # masquerait cet échec et le profil resterait là pour toujours, ce qui
        # est exactement la fuite qu'on croyait avoir bouchée. On réessaie donc,
        # au lieu d'abandonner en silence.
        for _ in range(20):
            shutil.rmtree(self.profil, ignore_errors=True)
            if not os.path.exists(self.profil):
                return
            time.sleep(0.25)


# ---------------------------------------------------------------------------
# La batterie de tests
# ---------------------------------------------------------------------------

def opacites(nav):
    return nav.evaluer(
        "return [...document.querySelectorAll('.temps')]"
        ".map(e=>Math.round(getComputedStyle(e).opacity*100))")


def lancer(url="http://127.0.0.1:8000", montrer=False):
    # 8000, et pas 8001 : c'est le port du README, de docs/04-ARCHITECTURE.md
    # et de .claude/launch.json. La batterie visait le 8001, si bien que suivre
    # la procédure documentée, lancer le serveur puis lancer les tests, ne
    # testait rien du tout : Chrome chargeait une page d'erreur et les six
    # vérifications échouaient avec des détails illisibles, sans que rien
    # n'indique qu'il s'agissait d'un numéro de port. Un seul chiffre à
    # retenir, le même sur les deux machines.
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
        # Déduit du DOM, et surtout pas écrit en dur : la batterie était codée
        # sur cinq temps, et l'arrivée d'un sixième la faisait échouer alors
        # que le site marchait. Un test qui dépend du nombre de paragraphes
        # n'a pas de valeur, il ne fait que réclamer une mise à jour.
        attendu = [100] + [0] * (len(depart) - 1)
        verifier("un seul temps est visible", depart == attendu, str(depart))

        print("\n2. On attend 4 secondes sans defiler")
        time.sleep(4)
        apres = opacites(nav)
        verifier("rien n'a bouge tout seul", apres == depart, str(apres))

        print("\n3. Le verrou d'entree : on defile SANS cliquer")
        for _ in range(6):
            nav.molette(500)
        verrouille = opacites(nav)
        verifier("rien ne se debloque sans le clic",
                 sum(1 for v in verrouille if v > 50) <= 1, str(verrouille))
        nav.evaluer("window.scrollTo(0,0); return 1")
        time.sleep(0.6)

        print("\n4. On clique sur le bouton d'ouverture")
        clique = nav.evaluer(
            "const b=document.querySelector('[data-entree]');"
            "if(!b) return 'ABSENT'; b.click(); return 'ok'")
        verifier("le bouton existe et repond", clique == "ok", str(clique))
        time.sleep(1.2)
        nav.evaluer("window.scrollTo(0,0); return 1")
        time.sleep(0.6)

        print("\n5. On defile a la molette, pour de vrai")

        vus = []
        for _ in range(14):
            nav.molette(500)
            vus.append((nav.evaluer("return Math.round(window.scrollY)"), opacites(nav)))
        n = lambda o: sum(1 for v in o if v > 50)
        verifier("le defilement fait apparaitre", max(n(o) for _, o in vus) > 1,
                 "max %d temps visibles" % max(n(o) for _, o in vus))
        verifier("tous les temps apparaissent",
                 max(n(o) for _, o in vus) == len(depart),
                 "%d sur %d" % (max(n(o) for _, o in vus), len(depart)))
        verifier("la descente ne fait qu'ajouter",
                 all(n(vus[i][1]) >= n(vus[i - 1][1]) for i in range(1, len(vus))))
        for y, o in vus[:8]:
            print("        y=%-6d %s" % (y, ",".join(map(str, o))))

        print("\n6. On remonte")
        haut = []
        for _ in range(20):
            nav.molette(-500)
            haut.append((nav.evaluer("return Math.round(window.scrollY)"), opacites(nav)))
        verifier("la remontee ne fait que retirer",
                 all(n(haut[i][1]) <= n(haut[i - 1][1]) for i in range(1, len(haut))))
        verifier("retour a l'etat de depart", haut[-1][1] == depart, str(haut[-1][1]))

        print("\n7. La camera du parcours")
        nav.evaluer("window.scrollTo(0,0); return 1")
        ordre = []
        for _ in range(40):
            nav.molette(500, pause=0.15)
            v = nav.evaluer("return window.__parcours ? window.__parcours.vueActuelle() : null")
            if v and (not ordre or ordre[-1] != v):
                ordre.append(v)
        verifier("elle visite les parties dans l'ordre",
                 ordre == ["chaine", "cellule", "plan",
                           "dendrites", "soma", "axone", "terminaisons"],
                 " > ".join(ordre))

        print("\n8. Un seul neurone, du debut a la fin")
        # La promesse tenue par tout le projet : il n'existe qu'UN neurone,
        # il arrive pendant l'ouverture et il ne quitte plus l'ecran. Le test
        # verifie les trois choses, parce que la continuite ne se voit pas sur
        # une capture : elle ne se prouve qu'en suivant le MEME element.
        verifier("il n'y en a qu'un dans la page",
                 nav.evaluer("return document.querySelectorAll('.neurone').length") == 1)

        # Dans la narration, le neurone est ce qu'on trouve AU BOUT du trajet :
        # pendant l'ouverture, c'est la silhouette qui est a l'ecran, et lui
        # n'est pas encore la. On verifie donc les deux etats, et pas
        # seulement une hauteur : une boite a une taille meme quand elle est
        # invisible, ce qui avait deja fait passer un test pour rien.
        nav.evaluer("window.scrollTo(0,0); return 1")
        for _ in range(9):
            nav.molette(500, pause=0.12)
        etat_intro = nav.evaluer(
            "var s=document.querySelector('.neurone');"
            "var p=s.closest('.porte-neurone');"
            "return [Math.round(s.getBoundingClientRect().height),"
            " Math.round(parseFloat(getComputedStyle(p).opacity)*100)]")
        sil_intro = nav.evaluer(
            "return Math.round(parseFloat(getComputedStyle("
            "document.querySelector('.porte-silhouette')).opacity)*100)")
        verifier("pendant l'ouverture, c'est la silhouette qui est la, pas lui",
                 sil_intro > 50 and etat_intro[1] < 50,
                 "silhouette %d%%, neurone %d%%" % (sil_intro, etat_intro[1]))

        for _ in range(22):
            nav.molette(500, pause=0.12)
        etat_parcours = nav.evaluer(
            "var s=document.querySelector('.neurone');"
            "var p=s.closest('.porte-neurone');"
            "return [Math.round(s.getBoundingClientRect().height),"
            " Math.round(parseFloat(getComputedStyle(p).opacity)*100)]")
        # Plus de comparaison de taille : le neurone n'est pas visible pendant
        # l'ouverture, et le parcours le montre plus PETIT, a la demande de
        # l'utilisateur, pour laisser la place au texte.
        verifier("au parcours, il est la, entier",
                 etat_parcours[1] > 50 and etat_parcours[0] > 150,
                 "%d px, opacite %d%%" % (etat_parcours[0], etat_parcours[1]))

        print("\n9. Le curseur du seuil")
        # Le premier moment interactif. On ne lit pas des opacites : on
        # declenche le curseur et on constate ce que le module rapporte,
        # puis ce qui est reellement dessine (la courbe a une longueur).
        existe = nav.evaluer(
            "var c=document.querySelector('#curseur-seuil');"
            "var b=document.querySelectorAll('[data-interaction=seuil] button');"
            "return c && b.length===2 ? [b[0].offsetHeight, b[1].offsetHeight] : null")
        verifier("le curseur et ses deux boutons existent, cibles de 44 px",
                 bool(existe) and min(existe) >= 44, str(existe))
        nav.evaluer("window.__seuil && window.__seuil.appliquer(3); return 1")
        time.sleep(1.4)
        monte = nav.evaluer("return window.__seuil ? window.__seuil.niveau() : -1")
        verifier("trois messages font monter le niveau sans le faire partir",
                 0 < monte < 1, "niveau %.2f" % monte)
        nav.evaluer("window.__seuil && window.__seuil.appliquer(8); return 1")
        time.sleep(3.2)
        parti = nav.evaluer("return window.__seuil ? window.__seuil.impulsionsDeclenchees() : 0")
        trace = nav.evaluer(
            "var t=document.querySelector('.figure-courbe .t');"
            "return t ? Math.round(parseFloat(t.style.strokeDasharray.split(',')[0])||0) : 0")
        verifier("huit messages font partir une impulsion, et la courbe se trace",
                 parti >= 1 and trace > 300, "%d impulsion(s), courbe %d px" % (parti, trace))
        dit = nav.evaluer("return (document.querySelector('[data-annonce-seuil]')||{}).textContent||''")
        verifier("le resultat est annonce au lecteur d'ecran", "impulsion" in dit, dit[:60])

        print("\n10. Le defi du chronometre")
        # Le second moment interactif. On pose des segments et on lit ce que
        # le chronometre AFFICHE, c'est-a-dire ce que le visiteur lit.
        existe = nav.evaluer(
            "var c=document.querySelector('#curseur-myeline');"
            "var b=document.querySelectorAll('[data-interaction=myeline] button');"
            "return c && b.length===2 ? [b[0].offsetHeight, b[1].offsetHeight] : null")
        verifier("le curseur de la gaine et ses deux boutons existent, 44 px",
                 bool(existe) and min(existe) >= 44, str(existe))
        nav.evaluer("window.__myeline && window.__myeline.appliquer(5, true); return 1")
        time.sleep(2.2)
        cinq = nav.evaluer("return document.querySelector('[data-chrono-valeur]').textContent")
        verifier("a cinq segments sur six, le message est encore cinq fois trop lent",
                 cinq.strip() == "0,10 s", cinq)
        nav.evaluer("window.__myeline && window.__myeline.appliquer(6, true); return 1")
        time.sleep(1.2)
        six = nav.evaluer("return document.querySelector('[data-chrono-valeur]').textContent")
        etat = nav.evaluer("return document.querySelector('[data-chrono-etat]').textContent")
        gaines = nav.evaluer("return [...document.querySelectorAll('.gaines > g')].filter(g=>parseFloat(g.getAttribute('opacity'))>0.5).length")
        verifier("a six segments, 0,02 s, objectif atteint, six gaines dessinees",
                 six.strip() == "0,02 s" and "atteint" in etat and gaines == 6,
                 "%s, %s, %d gaines" % (six, etat, gaines))

        print("\n11. Erreurs de console")
        erreurs = nav.evaluer("return (window.__erreurs || []).slice(0, 10)") or []
        verifier("aucune erreur", not erreurs, " | ".join(erreurs))

    finally:
        nav.fermer()

    reussis = sum(1 for ok, _, _ in resultats if ok)
    print("\n%d/%d tests reussis" % (reussis, len(resultats)))
    return all(ok for ok, _, _ in resultats)


if __name__ == "__main__":
    # --url= permet de viser un autre serveur sans toucher au code, par exemple
    # si le port 8000 est déjà pris par un autre outil. Le défaut reste celui
    # de launch.json et de la documentation : rien à retenir dans le cas normal.
    adresse = "http://127.0.0.1:8000"
    for argument in sys.argv[1:]:
        if argument.startswith("--url="):
            adresse = argument.split("=", 1)[1]

    ok = lancer(url=adresse, montrer="--montrer" in sys.argv)
    sys.exit(0 if ok else 1)


# ---------------------------------------------------------------------------
# Compter l'encre reellement peinte
# ---------------------------------------------------------------------------
# Le controle qui ne peut pas mentir.
#
# Tous les autres se sont laisses tromper au moins une fois. Verifier une
# opacite ne dit pas si l'element est dans l'ecran. Verifier sa position ne dit
# pas si ses traits sont dessines. Verifier elementFromPoint ne dit pas si une
# boite SVG contient autre chose que du vide.
#
# Compter les pixels non blancs de la capture, si. Si le compte est nul, le
# visiteur voit une page blanche, quelles qu'aient ete les valeurs posees.
#
# Decodage PNG en bibliotheque standard : zlib est dans Python, et le
# defiltrage des lignes tient en quelques lignes.

import zlib


def _lire_png(chemin):
    """Renvoie (largeur, hauteur, pixels RGB) d'un PNG 8 bits."""
    with open(chemin, "rb") as f:
        data = f.read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("ce n'est pas un PNG")
    pos, largeur, hauteur, canaux, brut = 8, 0, 0, 3, b""
    while pos < len(data):
        taille = int.from_bytes(data[pos:pos + 4], "big")
        typ = data[pos + 4:pos + 8]
        corps = data[pos + 8:pos + 8 + taille]
        if typ == b"IHDR":
            largeur = int.from_bytes(corps[0:4], "big")
            hauteur = int.from_bytes(corps[4:8], "big")
            couleur = corps[9]
            canaux = {0: 1, 2: 3, 4: 2, 6: 4}[couleur]
        elif typ == b"IDAT":
            brut += corps
        elif typ == b"IEND":
            break
        pos += 12 + taille

    flux = zlib.decompress(brut)
    parligne = largeur * canaux
    sortie = bytearray(hauteur * parligne)
    precedente = bytearray(parligne)
    i = 0
    for y in range(hauteur):
        filtre = flux[i]; i += 1
        ligne = bytearray(flux[i:i + parligne]); i += parligne
        for x in range(parligne):
            a = ligne[x - canaux] if x >= canaux else 0
            b = precedente[x]
            c = precedente[x - canaux] if x >= canaux else 0
            if filtre == 1:   ligne[x] = (ligne[x] + a) & 255
            elif filtre == 2: ligne[x] = (ligne[x] + b) & 255
            elif filtre == 3: ligne[x] = (ligne[x] + (a + b) // 2) & 255
            elif filtre == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                ligne[x] = (ligne[x] + pr) & 255
        sortie[y * parligne:(y + 1) * parligne] = ligne
        precedente = ligne
    return largeur, hauteur, bytes(sortie), canaux


def encre(chemin, seuil=235):
    """Part de pixels non blancs, entre 0 et 1. Zero = page blanche."""
    largeur, hauteur, px, canaux = _lire_png(chemin)
    total = largeur * hauteur
    sombres = 0
    for i in range(0, len(px), canaux):
        if px[i] < seuil or px[i + 1] < seuil or px[i + 2] < seuil:
            sombres += 1
    return sombres / float(total)


# ---------------------------------------------------------------------------
# Detecter les chevauchements
# ---------------------------------------------------------------------------
# Deux blocs de texte qui se superposent ne se voient dans aucune mesure de
# taille ou d'opacite : il faut comparer les rectangles deux a deux. Les
# couples parent-enfant sont exclus, puisqu'un enfant est toujours dans son
# parent.

CHEVAUCHEMENTS = """
/* CE QU'ON MESURE : DU TEXTE COUPE EN DEUX.

   La premiere version comparait les BOITES deux a deux. Elle s'est trompee
   dans les deux sens, et c'est instructif :

   - Faux positifs. Une boite n'est pas de l'encre. Le conteneur du dessin est
     bien plus haut que le dessin qu'il porte, et le texte de l'acte 1 defile
     DERRIERE la scene collee, qui est opaque : deux boites se croisent, rien
     ne se voit. Le detecteur a signale neuf fois de suite un defaut qui
     n'existait pas, ce qui use la confiance qu'on peut lui accorder.
   - Faux negatifs, plus graves. Sur grand ecran, les phrases de l'acte 1
     passaient sous le dessin opaque et se coupaient en plein mot. Aucune
     boite ne debordait de la sienne : la comparaison de boites ne pouvait pas
     le voir. Il a fallu regarder une capture pour s'en apercevoir.

   On teste donc ce qui compte reellement pour un lecteur : une phrase qu'il
   doit lire est-elle a moitie recouverte ? On releve les rectangles de LIGNE
   par un Range sur les noeuds de texte, ce qui donne l'encre et non la boite,
   puis on interroge le point : elementFromPoint dit qui est au-dessus.

   Trois issues, et une seule est un defaut :
     - tous les points repondent l'element  -> il est lisible, rien a signaler
     - aucun point ne repond l'element      -> il est entierement derriere
                                               autre chose. C'est le defilement
                                               normal : ce n'est pas son tour.
     - certains oui, d'autres non           -> DEFAUT. La phrase est coupee. */

function opEff(e) {
  let o = 1;
  for (let n = e; n && n.nodeType === 1; n = n.parentElement) {
    const c = getComputedStyle(n);
    o *= parseFloat(c.opacity);
    if (c.visibility === 'hidden') return 0;
  }
  return o;
}

/* Les rectangles de LIGNE, et non la boite du bloc. Un paragraphe de quatre
   lignes en donne quatre, chacun serre sur son texte. */
function lignes(e) {
  const out = [];
  const it = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = it.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const rg = document.createRange();
    rg.selectNodeContents(n);
    for (const b of rg.getClientRects())
      if (b.width > 4 && b.height > 4) out.push(b);
  }
  return out;
}

const sels = ['.temps', '.pile > *', '.figure-titre', '.etapes', '.defiler',
              '.barre', '.barre button', '.etape-contenu', '.visuels'];
const vus = new Set(); const mauvais = [];

sels.forEach(s => document.querySelectorAll(s).forEach(e => {
  if (vus.has(e)) return; vus.add(e);
  if (opEff(e) < 0.5) return;
  /* Le bloc du bouton d'ouverture couvre volontairement tout l'ecran avant
     le clic : ce n'est pas un chevauchement, c'est un cache. */
  if (e.closest('.porte-entree')) return;

  let lisibles = 0, couverts = 0, coupable = '';
  for (const b of lignes(e)) {
    if (b.bottom <= 0 || b.top >= innerHeight) continue;   /* hors ecran */
    const y = Math.min(Math.max(b.top + b.height / 2, 1), innerHeight - 1);
    /* Le bord DROIT en premier : c'est la que les phrases se coupent. */
    for (const x of [b.right - 2, b.left + b.width / 2, b.left + 2]) {
      if (x < 1 || x > innerWidth - 1) continue;
      const haut = document.elementFromPoint(x, y);
      if (!haut) continue;
      if (haut === e || e.contains(haut) || haut.contains(e)) { lisibles++; }
      else {
        couverts++;
        if (!coupable) coupable = haut.tagName + '.' + String(haut.className).slice(0, 20);
      }
    }
  }
  if (lisibles > 0 && couverts > 0)
    mauvais.push((e.tagName + '.' + String(e.className)).slice(0, 34)
      + '  COUPE PAR  ' + coupable
      + '  (' + couverts + '/' + (lisibles + couverts) + ' points)');
}));
return JSON.stringify(mauvais);
"""


def chevauchements(nav):
    import json
    return json.loads(nav.evaluer(CHEVAUCHEMENTS))


def stabiliser(nav, maxi=25, pas=0.12):
    """Attend que les opacites cessent de changer.

    Une pause fixe est un pari : trop courte, on mesure pendant un fondu et on
    croit voir un chevauchement qui n'existe pas une fois l'animation finie ;
    trop longue, la batterie traine. On releve donc l'etat jusqu'a ce qu'il se
    repete, ce qui est vrai quelle que soit la duree des transitions.
    """
    lecture = ("return [...document.querySelectorAll('.temps,.porte-silhouette,"
               ".porte-neurone,.figure-titre,.etapes')]"
               ".map(e=>Math.round(parseFloat(getComputedStyle(e).opacity)*20)).join(',')")
    precedent = None
    for _ in range(maxi):
        actuel = nav.evaluer(lecture)
        if actuel == precedent:
            return True
        precedent = actuel
        time.sleep(pas)
    return False
