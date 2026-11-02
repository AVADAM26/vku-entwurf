# Verkehrsschule Oberbaselbiet · Projektbeschreibung für Claude

Diese Datei zuerst lesen, bevor am Projekt gearbeitet wird. Sie erklärt, was die Seite ist, wie sie entstanden ist, was entschieden wurde und warum.

## Wichtigste Regel

**Nichts verändern, ohne es vorher mit Dani (Daniel Muccio) oder Adi (Adrian von Arb) abzusprechen.** Das gilt für Texte, Design, Funktionen, Dateien und Einstellungen, auch für kleine Korrekturen. Zuerst vorschlagen und erklären, was du ändern willst und warum, dann auf ein Ja warten. Die Seite ist mit den Fahrlehrern abgestimmt, viele Details sind bewusst so, wie sie sind.

## Worum es geht

Gemeinsame Webseite von neun Fahrlehrerinnen und Fahrlehrern aus dem Oberbaselbiet. Sie bieten zusammen den Verkehrskundeunterricht (VKU), den Nothelferkurs und Theorie an, führen ihre Fahrschulen aber selbstständig. Auf der Seite wählt man ein Lokal, sucht sich einen Termin aus und meldet sich online an.

Die neun: Rahel Schaffner, Ken Klauser, Dominic Imhof, Georg Schweingruber, Christian Wüthrich, Thomas Egenter, Roger Schreiber, Thomas Stuck, Cornelia Zumbrunn (Fahrschule Zumbrunn, https://www.fahrschule-zumbrunn.ch/, info@fahrschule-zumbrunn.ch).

- Name: **Verkehrsschule Oberbaselbiet.** Früher hiess der Entwurf „VKU Oberbaselbiet“. Geändert, weil die Fahrlehrer auch Theorie anbieten, nicht nur VKU. Überall so schreiben.
- Vorschau: https://avadam26.github.io/vku-entwurf/ (der Name des Repositorys bleibt vorerst „vku-entwurf“).
- Status: **Entwurf**, zu rund 95 % fertig. Für Suchmaschinen gesperrt (`robots.txt` und `noindex`), oben ein gelber Entwurfs-Hinweis. Beides erst beim echten Start entfernen.

## Wie die Seite entstanden ist

- Gebaut von Dani zusammen mit Claude, ab Oktober 2026. Konzept und Umsetzung AVADAM.
- Zuerst als klickbarer Entwurf direkt bei Claude, danach als eigenständige Version in reinem HTML auf GitHub (anfangs in Danis privatem Konto, dann in die Organisation AVADAM26 verschoben).
- Alle Inhalte kommen von Dani oder den Fahrlehrern. Kurzportraits wurden aus ihren eigenen Texten auf höchstens fünf Sätze gekürzt.

## Aufbau

```
index.html        Startseite: Kurse, Lokale, Fahrlehrer, Anmeldung, FAQ
impressum.html    Impressum
datenschutz.html  Datenschutzerklärung
app.js            Hell/Dunkel, Klappmenü, Terminauswahl, Formular, Auto nach oben
bilder/           Fotos der Fahrlehrer, Platzhalter, AVADAM Logo
robots.txt        sperrt im Entwurf alles
```

Reines HTML, CSS und JavaScript, kein Build-Schritt. Änderungen direkt in den Dateien.

## Design und warum

- **Vorbilder:** Apple, Tesla, Gucci, National Geographic, Mailchimp. Daraus: viel Weissraum und grosse Schrift (Apple, Tesla), elegante Serifenschrift für Titel (Gucci), warmes Gelb als Akzent (Mailchimp, National Geographic), später grosse, starke Fotos (National Geographic). Nur als Stil angelehnt, nichts davon kopiert.
- **Schriften:** Instrument Serif für Titel, Hanken Grotesk für Text. Akzentfarbe Gelb `#F2B807`.
- **Neutral, keine Kantonsfarben.** Das BL-Rot wirkt amtlich (man könnte die Seite für eine Seite vom Kanton oder Strassenverkehrsamt halten), und Rot steht im Verkehr für Stopp. Das Wappen und das Logo des Kantons sind als Marke geschützt und dürfen nicht verwendet werden. Den regionalen Bezug holen wir über Fotos und Sprache.
- **Hell/Dunkel-Modus** gehört bei allen AVADAM-Seiten dazu. Die Wahl wird gespeichert.
- **Back-to-Top-Auto** (unten rechts, erscheint beim Scrollen). Das ist Danis Markenzeichen, nicht ändern. Weiss mit rotem Streifen: erinnert an die Baselbieter Farben, ohne das geschützte Wappen. Beim Antippen drehen zuerst die Reifen mit Rauch durch, dann fährt es hoch. Das soll verspielt wirken und einen kleinen Bruch zur ruhigen Seite geben. Wer auf dem Gerät „Bewegung reduzieren“ eingeschaltet hat, bekommt bewusst keinen Rauch und kein Rütteln, das Auto fährt dann direkt.
- **Bild oben:** Die gezeichnete Illustration ist nur ein Platzhalter für ein Gruppenfoto aller neun vor einem Lokal. Das Bild schliesst oben bündig mit der kleinen Zeile über dem Titel ab und unten mit dem Einleitungstext.
- **Handy:** Menü als Klappmenü (Knopf „Menü“). Auf dem Desktop bleibt das Menü ausgeschrieben. Auf Wunsch der Fahrlehrer.

## Inhalte und Entscheide

- **Lose Gemeinschaft:** Jeder führt seine Fahrschule selbstständig, so steht es auch im Impressum. Keine gemeinsame Firma.
- **Reihenfolge der Fahrlehrer:** Rahel Schaffner immer zuerst, die anderen wie bisher.
- **Kurzportraits:** höchstens fünf Sätze, per Du, im Ton der jeweiligen Person. Private Details wie Geburtsdatum oder Namen von Familienmitgliedern bewusst weggelassen. Alle sollen die gleichen vier Fragen beantworten, damit die Karten einheitlich wirken: Was ist dir beim Unterrichten wichtig? Mit welchem Auto, Schaltung oder Automat, welche Kategorien? In welcher Region? Etwas Persönliches.
- **Links:** Jede Karte verlinkt auf die eigene Webseite des Fahrlehrers. Rahel hat noch keine, darum vorläufig ihre Facebook-Seite. Ihre eigene Seite baut AVADAM.
- **Kontakt:** Keine eigene Kontaktadresse auf der Startseite. Wer Fragen hat, meldet sich direkt bei einem Fahrlehrer über dessen Webseite. Unter der FAQ führt „Noch Fragen?“ deshalb zu den Fahrlehrern.
- **Lokale:** Gelterkinden, Schulgasse 3, Nähe Dorfplatz, direkt neben Schaub-Wohndesign. Oberdorf, Hauptstrasse 72, 4436 Oberdorf. Liestal: Adresse fehlt noch. Pro Lokal „Route planen“ mit Google Maps, sobald die Adresse bekannt ist.
- **Termine:** pro Lokal und Kurs die nächsten drei Termine. Klick auf „Anmelden“ übernimmt den Termin ins Formular. Im Formular „Zu den Terminen“, solange nichts gewählt ist, danach „Ändern“.
- **Anmeldeformular:** Vorname, Name, Adresse, FABER-PIN mit Hinweis „Die PIN, die du vom Strassenverkehrsamt bekommen hast“, Telefon, Einverständnis zum Datenschutz. Unsichtbares Spamschutz-Feld.
- **Logins:** Jeder Fahrlehrer bekommt ein eigenes Login, alle dürfen alle Kurstermine bearbeiten.
- **Footer:** unten links dezent „Webseite erstellt von“ mit AVADAM Logo, verlinkt auf https://avadam26.github.io/avadam/. Im Impressum „Konzept und Umsetzung: AVADAM, Human + Technology. Together.“ Die Firma heisst AVADAM, in Texten ohne Bindestrich.

## Datenschutz

- Nach Schweizer Datenschutzgesetz (DSG), in einfacher Sprache und per Du.
- Anmeldedaten werden bis zum Kurs und danach 30 Tage aufbewahrt, dann automatisch gelöscht.
- Keine Besucherstatistik, keine Werbe- oder Analyse-Cookies.
- Server-Logdaten nur so lange wie nötig. Konkrete Dauer beim Hosting klären und möglichst kurz einstellen.
- Im Entwurf kommen die Schriften noch von Google. Für den Start lokal auf den Server legen, sonst stimmt die Datenschutzerklärung nicht.
- Kontaktperson im Impressum und Datenschutz ist noch ein Platzhalter (Max Muster).

## Noch offen

- Echtes Logo der Verkehrsschule Oberbaselbiet (im Kopf steht noch ein Platzhalter „Logo“).
- Gruppenfoto aller neun statt der Platzhalter-Illustration. Vorschlag: gemeinsamer Fototermin mit Adi.
- Kurzportraits der Fahrlehrer (teils „[Kurzportrait folgt]“).
- Fotos von Rahel Schaffner und Cornelia Zumbrunn: Bis jetzt gibt es von beiden nur ein Bild ihres Fahrschulautos, das steht vorläufig auf ihrer Karte.
- Kontaktangaben im Impressum (Platzhalter in eckigen Klammern).
- Echte Kursdaten statt Beispielterminen. Preise sind noch „CHF XX.XX“.
- Ob Theorie als eigener Kurs mit Terminen auf die Seite kommt.
- Hinweis „Neu ab 1. Januar 2027“ (VKU vor der Theorieprüfung) steht über den Kurskarten, verlinkt aufs ASTRA. Sobald die MFK Basel-Landschaft ihre VKU-Seite nachgeführt hat, Link dorthin umstellen. Die FAQ sind auf die neue Regel angepasst (bis Ende 2026 alt, ab 2027 neu), offene Punkte als Platzhalter. VKU ab 2027 frühestens sechs Monate vor dem Mindestalter für den Lernfahrausweis (Quellen: L-drive, Berner Fahrschule). VKU-Bescheinigung seit 1. Januar 2021 unbeschränkt gültig (ASTRA-Weisungen vom 24.09.2020, Ziffer 3.3). Die MFK BL schreibt auf ihrer Seite noch von 2 Jahren, das ist veraltet. Nothelfer-Bescheinigung 6 Jahre gültig. Die MFP beider Basel bestätigt in ihren Unterlagen ebenfalls: VKU ab 01.01.2021 unbeschränkt gültig. FABER-PIN gibt es mit dem Lernfahrgesuch; ab 2027 werden Nothelfer und Sehtest damit digital erfasst (Quelle: Verkehrsamt Schwyz).
- Anmeldeformular verschickt noch nichts. Für den echten Betrieb braucht es einen Versanddienst oder ein Backend.
- Domain noch nicht entschieden, das entscheiden die Fahrlehrer. „vku-…“ fällt weg, weil sie mehr als VKU anbieten. Hosting: Favorit Hostpoint.
- Beim Start: Entwurfs-Hinweis, `noindex` und Sperre in `robots.txt` entfernen, Sitemap und Meta-Daten ergänzen, Seite mit Google PageSpeed Insights prüfen und auf Tempo optimieren.

## Regeln

- **Nichts ohne Absprache verändern** (siehe ganz oben).
- **Nichts erfinden.** Keine Termine, Preise, Namen oder Angaben, die nicht von Dani, Adi oder den Fahrlehrern kommen. Fehlendes als Platzhalter in eckigen Klammern markieren.
- **Schreibstil:** Schweizer Schreibweise, immer „ss“, nie „ß“. Per Du, freundlich, direkt, einfache Sätze, kein Werbe-Deutsch.
- Jede Änderung auf dem Handy und am Computer, hell und dunkel prüfen. Nichts darf seitlich überstehen.
- Vor dem Arbeiten `git pull`, kleine Commits mit deutscher Beschreibung.
- **Commits immer im Namen der Person, die gerade arbeitet**, nie nur als „claude“. Nur so erscheint sie auf GitHub bei den Contributors. Vor dem ersten Commit `git config user.name` und `git config user.email` im Repo entsprechend setzen. Ist unklar, wer arbeitet, kurz fragen.
  - Dani: `scotlandbydan` mit der Noreply-Adresse `317312833+dmuccios24-oss@users.noreply.github.com`, nie mit seiner Gmail-Adresse. Sonst blockt GitHub den Push.
  - Adi: `f5yct67kcv-source` mit der Noreply-Adresse `284693819+f5yct67kcv-source@users.noreply.github.com`, nicht mit seiner Apple-Relay-Adresse.
  - Gilt in allen Projekten.
- **Arbeit am Ende jeder Sitzung in `main` zurückführen.** Cloud-Sitzungen (claude.ai/code, Handy, Desktop „Cloud“) arbeiten auf einem eigenen Zweig `claude/…`. Bevor die Sitzung endet: `git pull origin main`, Konflikte lösen, dann in `main` übernehmen und hochladen. Sonst bleibt die Arbeit liegen und kommt nie auf die Seite. Nur wenn Adi oder Dani ausdrücklich zuerst prüfen wollen, stattdessen einen Pull Request machen und Bescheid geben. Gilt in allen Projekten.
