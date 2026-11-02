# Verkehrsschule Oberbaselbiet · Projektbeschreibung für Claude

Diese Datei zuerst lesen, bevor am Projekt gearbeitet wird. Sie erklärt, was die Seite ist, wie sie entstanden ist, was entschieden wurde und warum.

## Wichtigste Regel

**Nichts verändern, ohne es vorher mit Dani (Daniel Muccio) oder Adi (Adrian von Arb) abzusprechen.** Das gilt für Texte, Design, Funktionen, Dateien und Einstellungen, auch für kleine Korrekturen. Zuerst vorschlagen und erklären, was du ändern willst und warum, dann auf ein Ja warten. Die Seite ist mit den Fahrlehrern abgestimmt, viele Details sind bewusst so, wie sie sind.

## Worum es geht

Gemeinsame Webseite von neun Fahrlehrerinnen und Fahrlehrern (auf der Seite «Fahrlehrer/innen») aus dem Oberbaselbiet. Sie bieten zusammen den Verkehrskundeunterricht (VKU), den Nothelferkurs und Theorie an, führen ihre Fahrschulen aber selbstständig. Auf der Seite wählt man ein Lokal, sucht sich einen Termin aus und meldet sich online an.

Die neun: Rahel Schaffner, Ken Klauser, Dominic Imhof, Georg Schweingruber, Christian Wüthrich, Thomas Egenter, Roger Schreiber, Thomas Stuck, Cornelia Zumbrunn (Fahrschule Zumbrunn, https://www.fahrschule-zumbrunn.ch/, info@fahrschule-zumbrunn.ch).

- Name: **Verkehrsschule Oberbaselbiet.** Früher hiess der Entwurf „VKU Oberbaselbiet“. Geändert, weil die Fahrlehrer auch Theorie anbieten, nicht nur VKU. Überall so schreiben.
- Vorschau: https://avadam26.github.io/vku-entwurf/ (der Name des Repositorys bleibt vorerst „vku-entwurf“).
- Status: **Entwurf**, zu rund 95 % fertig. Für Suchmaschinen gesperrt (`robots.txt` und `noindex`), oben ein blauer Entwurfs-Hinweis. Beides erst beim echten Start entfernen.

## Wie die Seite entstanden ist

- Gebaut von Dani zusammen mit Claude, ab Oktober 2026. Konzept und Umsetzung AVADAM.
- Zuerst als klickbarer Entwurf direkt bei Claude, danach als eigenständige Version in reinem HTML auf GitHub (anfangs in Danis privatem Konto, dann in die Organisation AVADAM26 verschoben).
- Alle Inhalte kommen von Dani oder den Fahrlehrern. Kurzportraits wurden aus ihren eigenen Texten auf höchstens fünf Sätze gekürzt.

## Aufbau

```
index.html        Startseite: Kurse, Lokale, Fahrlehrer, Anmeldung, FAQ
impressum.html    Impressum
datenschutz.html  Datenschutzerklärung
app.js            Hell/Dunkel, Klappmenü, lädt daten/*.json und baut Lokale, Termine, Fahrlehrer, Preise; Formular, Auto nach oben
daten/            Inhalte, die oft ändern, als JSON (siehe «Datendateien und Verwaltung»)
  lokale.json       Lokale mit Adresse, Hinweis, Foto
  kurse.json        Kurse (VKU, Nothelfer) mit Preis
  termine.json      Kurstermine: Lokal, Kurs, Tage, Zeit, ausgebucht
  fahrlehrer.json   Fahrlehrer mit Fahrschule, Kurzportrait, Link, Foto, Bildausschnitt
verwaltung/       Mini-CMS für die Fahrlehrer (Login, bearbeitet termine, lokale, kurse) und Versand der Anmeldungen
  index.html        Oberfläche, gleiches Design wie die Seite
  verwaltung.js     Logik der Oberfläche
  api.php           Login und Speichern (PHP, läuft auf Hostpoint, nicht auf GitHub Pages)
  anmeldung.php     nimmt das Anmeldeformular entgegen und verschickt es per E-Mail
  passwort.php      Hilfsseite zum Erzeugen eines Passwort-Hashs, nach dem Einrichten löschen
  benutzer.beispiel.php, konfig.beispiel.php   Vorlagen; die echten Dateien liegen nur auf dem Server
schriften/        Hanken Grotesk (Text) und die Titelschriften Montserrat, Archivo, Space Grotesk als WOFF2 plus schriften.css, lokal statt von Google
bilder/           Fotos der Fahrlehrer, Platzhalter, AVADAM Logo
LOGBUCH.md        Sitzungs-Log: was wann geändert wurde, mit Commits
robots.txt        sperrt im Entwurf alles
.gitignore        hält benutzer.php, konfig.php und daten/sicherung/ aus dem Repository
```

Reines HTML, CSS und JavaScript, kein Build-Schritt. Änderungen an Texten und Design direkt in den Dateien, Änderungen an Terminen, Lokalen und Preisen über die Verwaltung oder direkt in `daten/*.json`, Fahrlehrer-Portraits nur direkt in `daten/fahrlehrer.json`.

## Datendateien und Verwaltung

Entschieden am 2. November 2026 (Adi), gebaut mit Claude, vor dem Call mit den Fahrlehrern.

- **Warum:** Termine, Preise, Adressen und Portraits ändern oft. Vorher standen die Termine dreimal im HTML, jede Änderung war Handarbeit in drei Karten. Jetzt gibt es eine Stelle pro Inhalt, und die Fahrlehrer können sie selbst pflegen.
- **Wie die Seite rendert:** `app.js` lädt die vier JSON-Dateien und baut daraus die Lokal-Karten mit Terminen, die Fahrlehrer-Karten, die Zahlen oben («9 Fahrlehrer · 3 Lokale», «Neun Fahrlehrer») und die Preise. Die statischen Stücke im HTML (Hero, Kurskarten, FAQ, Formular) bleiben HTML.
- **Termine:** Ein Termin hat Lokal, Kurs, eine Liste von Kurstagen (ISO-Datum) und eine Zeit. Die Seite macht daraus die bekannte Zeile: vier Tage am Stück «Mo 26.10. – Do 29.10., 18:30–20:30», zwei Tage «Fr 06.11. + Sa 07.11.», Tage mit Lücken «Di 06.10. – Do 15.10., Di + Do 19:00–21:00». Vergangene Termine (letzter Tag vor heute) blendet die Seite von selbst aus, pro Lokal und Kurs erscheinen die nächsten drei. `ausgebucht: true` zeigt «Ausgebucht» statt «Anmelden». Die Beispieltermine haben Jahreszahlen bekommen (Oktober bis Dezember 2026, Januar 2027); die vom Oktober sind darum heute schon unsichtbar.
- **Verwaltung (`verwaltung/`):** Reiter Termine, Lokale, Preise. Die Fahrlehrer-Portraits (`daten/fahrlehrer.json`) sind bewusst nicht in der Verwaltung (Adi, 2. November 2026): Texte, Fotos und Reihenfolge pflegt AVADAM, damit die Karten einheitlich bleiben; der Server nimmt für diese Datei kein Speichern über `api.php` an. Jeder Fahrlehrer hat ein eigenes Login, alle dürfen alles bearbeiten (Entscheid der Fahrlehrer, siehe «Logins»). Speichern schreibt die JSON-Datei, legt vorher eine Sicherungskopie in `daten/sicherung/` an (die letzten 30 pro Datei) und schreibt ins Protokoll, wer wann gespeichert hat. Was gespeichert ist, steht sofort auf der Seite, ohne Deploy.
- **Ohne PHP, zum Beispiel auf GitHub Pages:** Die Seite selbst läuft vollständig (JSON wird statisch geladen). Die Verwaltung öffnet sich im **Vorschau-Modus** mit gelbem Hinweis: alles lässt sich anfassen, «Speichern» lädt die geänderte JSON-Datei herunter, statt sie zu schreiben. Damit lässt sich die Verwaltung auf der Vorschau zeigen. Das Formular zeigt dann wie bisher nur die Dankes-Meldung.
- **Auf Hostpoint einrichten:** `verwaltung/benutzer.beispiel.php` nach `benutzer.php` kopieren und pro Fahrlehrer Benutzername und Passwort-Hash eintragen (Hash über `verwaltung/passwort.php` erzeugen, diese Seite danach löschen). `konfig.beispiel.php` nach `konfig.php` kopieren: Empfängeradresse für Anmeldungen, Absender, Text der Bestätigung. Der Webserver muss in `daten/` schreiben dürfen. Beide echten Dateien bleiben auf dem Server und kommen nie ins Repository.
- **Anmeldeformular:** prüft Pflichtfelder und die Datenschutz-Checkbox im Browser und meldet, was fehlt. Mit PHP schickt es die Anmeldung als E-Mail an die Fahrlehrer (Reply-To ist die Adresse der angemeldeten Person) und eine Bestätigung an die Person. Neu gibt es dafür ein Feld **E-Mail** (Entscheid Adi, 2. November 2026); die Datenschutzerklärung führt die E-Mail-Adresse auf.
- **Plätze und Belegung** (Adi, 2. November 2026): Pro Termin kann in der Verwaltung eine Maximalzahl «Plätze» stehen (leer = unbegrenzt) und ein Zähler «Belegt». Bei jeder Anmeldung über das Formular erhöht `anmeldung.php` den Zähler um eins, mit Dateisperre, damit zwei gleichzeitige Anmeldungen nicht beide durchkommen; ist der Termin voll, lehnt der Server ab (Antwort 409) und die Seite lädt die Termine neu. Schlägt der Mailversand fehl, wird der Platz wieder freigegeben. Die Seite zeigt «Noch X Plätze» immer, sobald ein Maximum gesetzt ist, damit auch zwei Leute, die zusammen kommen wollen, früh sehen, ob es für beide reicht (Adi, 2. November 2026). Davor ein kleiner Ampelpunkt: grün ab vier freien Plätzen, gelb (Seitengelb) bei zwei und drei, rot bei einem Platz mit roter Schrift. «Ausgebucht» bei null, grau statt Knopf. Variante B aus zwei gezeigten, A wäre grau ohne Punkt gewesen. Die Checkbox «Ausgebucht» bleibt als Handbremse. Nach einer Abmeldung senken die Fahrlehrer «Belegt» von Hand. Bewusst kein «Beliebt»-Icon und keine Warteliste: Knappheit nur zeigen, wenn sie echt ist, und keine Teilnehmerdaten auf dem Server.
- **Nicht erfinden gilt auch hier:** In `daten/` stehen nur Inhalte aus dem bisherigen HTML oder von den Fahrlehrer/innen. Preise seit dem Call vom 2. November 2026 gesetzt, die Adresse Liestal ist leer (zeigt «[Adresse folgt]»). Ausnahme zu Demo-Zwecken (Adi, 2. November 2026): Einige Beispieltermine haben erfundene Werte für Plätze und Belegt, damit man im Call sieht, wie «Noch X Plätze» und «Ausgebucht» aussehen. Beim Einpflegen echter Termine zurücksetzen.

## Design und warum

- **Vorbilder:** Apple, Tesla, Gucci, National Geographic, Mailchimp. Daraus: viel Weissraum und grosse Schrift (Apple, Tesla), später grosse, starke Fotos (National Geographic). Nur als Stil angelehnt, nichts davon kopiert. Ursprünglich mit Serifenschrift für Titel und Gelb als Akzent, beides auf Wunsch der Fahrlehrer/innen am 2. November 2026 geändert (siehe unten).
- **Akzentfarbe Blau** `#0055A4` mit weisser Schrift (im Dunkelmodus `#2F6BC8`), angelehnt an das Blau der Plakette am Fahrschulauto. Wunsch der Fahrlehrer/innen im Call vom 2. November 2026, vorher Gelb `#F2B807`. Der genaue Farbton ist geschätzt, sobald ein Foto der Plakette da ist, abgleichen. Blau sind: Entwurfs-Hinweis, Logo-Platzhalter, beim Kasten «Neu ab 1. Januar 2027» das Etikett oben (blau mit weisser Schrift; der Kasten selbst weiss mit blauem Rand, Dani, 2. November 2026), «Anmelden» bei den Terminen beim Darüberfahren, die Knöpfe «Zu den Terminen» und «Verbindlich anmelden», Knöpfe in der Verwaltung. Ausnahme: Der gelbe Ampelpunkt bei «Noch 2/3 Plätze» bleibt gelb (`--gelb`), weil die Ampel Grün, Gelb, Rot braucht.
- **Schriften:** Keine Serifen mehr (Wunsch der Fahrlehrer/innen, 2. November 2026; vorgeschlagen wurde Arial oder etwas Modernes mit mehr Pep). Dani hat drei Schriften zur Auswahl versprochen, je eine auf einem Titel: «Verkehrsschule Oberbaselbiet» in **Montserrat** 800 (`.t-haupt`), «Verkehrskundeunterricht» und «Nothelferkurs» in **Archivo** 700 (`.t-kurs`), «Drei Lokale. Alle Termine.» in **Space Grotesk** 700 (`.t-lokale`). Alle anderen Titel (`.serif`, Name aus alter Zeit) in Hanken Grotesk 700. Sobald die Fahrlehrer/innen eine Schrift gewählt haben, alle Titel darauf umstellen und die zwei anderen Schriftdateien löschen. Text bleibt Hanken Grotesk.
- **Neutral, keine Kantonsfarben.** Das BL-Rot wirkt amtlich (man könnte die Seite für eine Seite vom Kanton oder Strassenverkehrsamt halten), und Rot steht im Verkehr für Stopp. Das Wappen und das Logo des Kantons sind als Marke geschützt und dürfen nicht verwendet werden. Den regionalen Bezug holen wir über Fotos und Sprache.
- **Hell/Dunkel-Modus** gehört bei allen AVADAM-Seiten dazu. Die Wahl wird gespeichert.
- **Back-to-Top-Auto** (unten rechts, erscheint beim Scrollen). Das ist Danis Markenzeichen, nicht ändern. Weiss mit rotem Streifen: erinnert an die Baselbieter Farben, ohne das geschützte Wappen. Beim Antippen drehen zuerst die Reifen mit Rauch durch, dann fährt es hoch. Das soll verspielt wirken und einen kleinen Bruch zur ruhigen Seite geben. Wer auf dem Gerät „Bewegung reduzieren“ eingeschaltet hat, bekommt bewusst keinen Rauch und kein Rütteln, das Auto fährt dann direkt.
- **Bild oben:** Die gezeichnete Illustration ist nur ein Platzhalter für ein Gruppenfoto aller neun vor einem Lokal. Das Bild schliesst oben bündig mit der kleinen Zeile über dem Titel ab und unten mit dem Einleitungstext.
- **Handy:** Menü als Klappmenü (Knopf „Menü“). Auf dem Desktop bleibt das Menü ausgeschrieben. Auf Wunsch der Fahrlehrer.
- **Lokal-Karten auf einer Ebene** (Adi, 2. November 2026): Die drei Karten teilen sich ein Zeilenraster (CSS Subgrid): Foto, Kopf mit Ort und Adresse, dann pro Kurs ein Block. Jede Zeile ist in allen Karten gleich hoch, darum stehen «VKU» und «Nothelfer» überall auf derselben Höhe, auch wenn eine Karte mehr Adresszeilen oder Termine hat. «Route planen» sitzt am unteren Rand des Kopf-Bereichs, darum liegen auch die drei Links auf einer Linie. Ohne Subgrid-Unterstützung fällt die Karte auf die alte Spaltenform zurück.

## Inhalte und Entscheide

- **Lose Gemeinschaft:** Jeder führt seine Fahrschule selbstständig, so steht es auch im Impressum. Keine gemeinsame Firma.
- **Reihenfolge der Fahrlehrer/innen:** zufällig, bei jedem Seitenaufruf neu gemischt (`mischen()` in `app.js`), damit nicht immer dieselben oben stehen. Wunsch der Fahrlehrer/innen, 2. November 2026. Ersetzt die frühere Regel «Rahel immer zuerst». In `daten/fahrlehrer.json` steht Rahel weiterhin zuerst, das hat keine Wirkung mehr auf die Seite.
- **Schreibweise:** «Fahrlehrer/innen» auf der Seite (Wunsch der Fahrlehrer/innen). Im Fliesstext von Impressum und Datenschutz bleibt «Fahrlehrerinnen und Fahrlehrer».
- **Kurzportraits:** höchstens fünf Sätze, per Du, im Ton der jeweiligen Person. Private Details wie Geburtsdatum oder Namen von Familienmitgliedern bewusst weggelassen. Alle sollen die gleichen vier Fragen beantworten, damit die Karten einheitlich wirken: Was ist dir beim Unterrichten wichtig? Mit welchem Auto, Schaltung oder Automat, welche Kategorien? In welcher Region? Etwas Persönliches.
- **Links:** Jede Karte verlinkt auf die eigene Webseite des Fahrlehrers. Rahel hat noch keine, darum vorläufig ihre Facebook-Seite. Ihre eigene Seite baut AVADAM.
- **Kontakt:** Keine eigene Kontaktadresse auf der Startseite. Wer Fragen hat, meldet sich direkt bei einem Fahrlehrer über dessen Webseite. Unter der FAQ führt „Noch Fragen?“ deshalb zu den Fahrlehrern.
- **Lokale:** Gelterkinden, Schulgasse 3, Nähe Dorfplatz, direkt neben Schaub-Wohndesign. Oberdorf, Hauptstrasse 72, 4436 Oberdorf. Liestal: Adresse fehlt noch. Pro Lokal „Route planen“ mit Google Maps; bei Liestal zeigt der Link vorläufig auf die Kartensuche nach dem Ort, damit alle Karten gleich aussehen (Adi, 2. November 2026). Sobald die Adresse in `daten/lokale.json` steht, führt er zur Adresse.
- **Termine:** pro Lokal und Kurs die nächsten drei Termine, aus `daten/termine.json`, vergangene fallen automatisch weg. Klick auf „Anmelden“ übernimmt den Termin ins Formular. Im Formular „Zu den Terminen“, solange nichts gewählt ist, danach „Ändern“.
- **Anmeldeformular:** Vorname, Name, Adresse, FABER-PIN mit Hinweis „Die PIN, die du vom Strassenverkehrsamt bekommen hast“ und daneben **Geburtsdatum** (halbe Breite nebeneinander, Wunsch der Fahrlehrer/innen, 2. November 2026; Datumsfeld, in der E-Mail als TT.MM.JJJJ, auch in `anmeldung.php` und in der Datenschutzerklärung), E-Mail (seit 2. November 2026, für die Bestätigung), Telefon, Einverständnis zum Datenschutz. Unsichtbares Spamschutz-Feld. Pflichtfelder werden geprüft.
- **Logins:** Neu (Call vom 2. November 2026): **Zwei Fahrlehrer/innen bekommen Zugriff und übernehmen die Verwaltung.** Wie genau, klärt Dani mit Adi; bis dahin technisch unverändert. Früher geplant: Jeder Fahrlehrer bekommt ein eigenes Login, alle dürfen alle Kurstermine bearbeiten. Umgesetzt in `verwaltung/` (siehe «Datendateien und Verwaltung»). Der Link «Login für Fahrlehrer» im Footer führt dorthin, seit dem 2. November 2026 auch der Menüpunkt «Login» im Kopf (Desktop) beziehungsweise «Login für Fahrlehrer» im Klappmenü (Handy). Vorläufig, damit man im Call direkt hinklicken kann; ob die Fahrlehrer den Eingang im Menü oder nur als Link wollen, entscheiden sie.
- **Footer:** unten links dezent „Webseite erstellt von“ mit AVADAM Logo, verlinkt auf https://avadam26.github.io/avadam/. Im Impressum „Konzept und Umsetzung: AVADAM, Human + Technology. Together.“ Die Firma heisst AVADAM, in Texten ohne Bindestrich.

## Datenschutz

- Nach Schweizer Datenschutzgesetz (DSG), in einfacher Sprache und per Du.
- Anmeldedaten werden bis zum Kurs und danach 30 Tage aufbewahrt, dann automatisch gelöscht.
- Keine Besucherstatistik, keine Werbe- oder Analyse-Cookies.
- Server-Logdaten nur so lange wie nötig. Konkrete Dauer beim Hosting klären und möglichst kurz einstellen.
- Die Schriften liegen seit dem 2. November 2026 lokal in `schriften/` (alle SIL Open Font License, Hanken als variable Schrift für 400 bis 700). Kein Aufruf mehr an Google, auf keiner der vier Seiten. Die Pfade in `schriften.css` sind relativ zur CSS-Datei (`url(datei.woff2)`), nicht `url(schriften/…)`, sonst lädt der Browser die Schriften nicht.
- Kontaktperson im Impressum und Datenschutz ist noch ein Platzhalter (Max Muster).

## Noch offen

- Echtes Logo der Verkehrsschule Oberbaselbiet (im Kopf steht noch ein Platzhalter „Logo“).
- Gruppenfoto aller neun statt der Platzhalter-Illustration. Vorschlag: gemeinsamer Fototermin mit Adi.
- Kurzportraits der Fahrlehrer (teils „[Kurzportrait folgt]“).
- Fotos von Rahel Schaffner und Cornelia Zumbrunn: Bis jetzt gibt es von beiden nur ein Bild ihres Fahrschulautos, das steht vorläufig auf ihrer Karte.
- Kontaktangaben im Impressum (Platzhalter in eckigen Klammern).
- Echte Kursdaten statt Beispielterminen.
- **Preise** (Call vom 2. November 2026): VKU CHF 200.00 inklusive Lernmaterial, Nothelfer CHF 150.00 inklusive Ausweis. Preis in `daten/kurse.json`, der Zusatz «inklusive …» steht fest im HTML unter dem Preis.
- Die Fahrlehrer/innen liefern noch: Logo, Texte für die Kurzportraits, Links für den Nothelferkurs (direkt auf die Seite, wo man sich anmeldet), neuer Text für «Neu ab 1. Januar 2027».
- Auswahl der Titelschrift (siehe «Schriften»).
- Farbton der Plakette abgleichen (siehe «Akzentfarbe Blau»).
- Ob Theorie als eigener Kurs mit Terminen auf die Seite kommt.
- Hinweis „Neu ab 1. Januar 2027“ (VKU vor der Theorieprüfung) steht über den Kurskarten, verlinkt aufs ASTRA. Sobald die MFK Basel-Landschaft ihre VKU-Seite nachgeführt hat, Link dorthin umstellen. Die FAQ sind auf die neue Regel angepasst (bis Ende 2026 alt, ab 2027 neu), offene Punkte als Platzhalter. VKU ab 2027 frühestens sechs Monate vor dem Mindestalter für den Lernfahrausweis (Quellen: L-drive, Berner Fahrschule). VKU-Bescheinigung seit 1. Januar 2021 unbeschränkt gültig (ASTRA-Weisungen vom 24.09.2020, Ziffer 3.3). Die MFK BL schreibt auf ihrer Seite noch von 2 Jahren, das ist veraltet. Nothelfer-Bescheinigung 6 Jahre gültig. Die MFP beider Basel bestätigt in ihren Unterlagen ebenfalls: VKU ab 01.01.2021 unbeschränkt gültig. FABER-PIN gibt es mit dem Lernfahrgesuch; ab 2027 werden Nothelfer und Sehtest damit digital erfasst (Quelle: Verkehrsamt Schwyz).
- Anmeldeformular verschickt erst auf einem Server mit PHP (`verwaltung/anmeldung.php` plus `konfig.php`). Auf GitHub Pages bleibt es bei der Dankes-Meldung.
- Verwaltung auf dem Hosting einrichten: `benutzer.php` mit den Logins der neun Fahrlehrer, `konfig.php` mit Empfängeradresse, Schreibrecht auf `daten/`. Danach `passwort.php` löschen.
- Wenn Suchmaschinen die Termine lesen sollen: Lokale und Fahrlehrer werden erst im Browser aus JSON gebaut. Google rendert JavaScript, für Bing und KI-Suchen beim Start prüfen, ob eine serverseitige Ausgabe nötig ist.
- Domain noch nicht entschieden, das entscheiden die Fahrlehrer. „vku-…“ fällt weg, weil sie mehr als VKU anbieten. Hosting: Favorit Hostpoint.
- Beim Start: Entwurfs-Hinweis, `noindex` und Sperre in `robots.txt` entfernen, Sitemap und Meta-Daten ergänzen, Seite mit Google PageSpeed Insights prüfen und auf Tempo optimieren.

## Regeln

- **Nichts ohne Absprache verändern** (siehe ganz oben).
- **Nichts erfinden.** Keine Termine, Preise, Namen oder Angaben, die nicht von Dani, Adi oder den Fahrlehrern kommen. Fehlendes als Platzhalter in eckigen Klammern markieren.
- **Schreibstil:** Schweizer Schreibweise, immer „ss“, nie „ß“. Per Du, freundlich, direkt, einfache Sätze, kein Werbe-Deutsch.
- Jede Änderung auf dem Handy und am Computer, hell und dunkel prüfen. Nichts darf seitlich überstehen.
- Vor dem Arbeiten `git pull`, kleine Commits mit deutscher Beschreibung.
- Nach Änderungen an `app.js` oder `verwaltung/verwaltung.js` die Seite lokal prüfen: `php -S 127.0.0.1:8081` im Projektordner, dann `/` und `/verwaltung/` im Browser (mit `benutzer.php` zum Testen), oder `python3 -m http.server` für den Vorschau-Modus ohne PHP.
- **Commits immer im Namen der Person, die gerade arbeitet**, nie nur als „claude“. Nur so erscheint sie auf GitHub bei den Contributors. Vor dem ersten Commit `git config user.name` und `git config user.email` im Repo entsprechend setzen. Ist unklar, wer arbeitet, kurz fragen.
  - Dani: `scotlandbydan` mit der Noreply-Adresse `317312833+dmuccios24-oss@users.noreply.github.com`, nie mit seiner Gmail-Adresse. Sonst blockt GitHub den Push.
  - Adi: `f5yct67kcv-source` mit der Noreply-Adresse `284693819+f5yct67kcv-source@users.noreply.github.com`, nicht mit seiner Apple-Relay-Adresse.
  - Gilt in allen Projekten.
- **Arbeit am Ende jeder Sitzung in `main` zurückführen.** Cloud-Sitzungen (claude.ai/code, Handy, Desktop „Cloud“) arbeiten auf einem eigenen Zweig `claude/…`. Bevor die Sitzung endet: `git pull origin main`, Konflikte lösen, dann in `main` übernehmen und hochladen. Sonst bleibt die Arbeit liegen und kommt nie auf die Seite. Nur wenn Adi oder Dani ausdrücklich zuerst prüfen wollen, stattdessen einen Pull Request machen und Bescheid geben. Gilt in allen Projekten.
