# VKU Oberbaselbiet · Projektbeschreibung für Claude

Diese Datei lesen, bevor am Projekt gearbeitet wird.

## Worum es geht

Gemeinsame Webseite von acht Fahrlehrerinnen und Fahrlehrern aus dem Oberbaselbiet. Sie bieten zusammen den Verkehrskundeunterricht (VKU) und den Nothelferkurs an, führen ihre Fahrschulen aber selbstständig. Auf der Seite wählt man ein Lokal, sucht sich einen Termin aus und meldet sich online an.

Die acht: Rahel Schaffner, Ken Klauser, Dominic Imhof, Georg Schweingruber, Christian Wüthrich, Thomas Egenter, Roger Schreiber, Thomas Stuck.

Umsetzung: Daniel Muccio für AVA-DAM. Das Projekt ist zu rund 95 % fertig. Daniel hat es bewusst allein gebaut. Änderungen nur in Absprache mit ihm.

- Vorschau: https://dmuccios24-oss.github.io/vku-entwurf/
- Status: **Entwurf.** Für Suchmaschinen gesperrt (`robots.txt` und `noindex`), oben ein gelber Entwurfs-Hinweis. Beides erst beim echten Start entfernen.

## Aufbau

```
index.html        Startseite: Kurse, Lokale, Fahrlehrer, Anmeldung, FAQ
impressum.html    Impressum
datenschutz.html  Datenschutzerklärung
app.js            Hell/Dunkel, Klappmenü, Terminauswahl, Formular, Auto nach oben
bilder/           Fotos der Fahrlehrer, Platzhalter, AVA-DAM Logo (avadam.svg)
robots.txt        sperrt im Entwurf alles
```

Reines HTML, CSS und JavaScript, kein Build-Schritt. Änderungen direkt in den Dateien.

## Was die Seite schon kann

- Hell/Dunkel-Modus, Wahl wird gespeichert.
- Back-to-Top als rot-weisses Fahrschulauto: dreht kurz mit Rauch durch und fährt dann nach oben. Das ist Daniels Markenzeichen, nicht ändern.
- Klappmenü auf dem Handy.
- Terminauswahl pro Lokal mit Übernahme ins Anmeldeformular, Spamschutz-Feld.
- FAQ, Impressum, Datenschutz.
- Im Footer „Webseite erstellt von“ mit AVA-DAM Logo, verlinkt auf https://avadam26.github.io/avadam/

## Noch offen

- Echtes Logo der VKU Oberbaselbiet (im Kopf steht noch ein Platzhalter „Logo“).
- Gruppenfoto aller acht statt der Platzhalter-Illustration.
- Kurzportraits der Fahrlehrer (teils „[Kurzportrait folgt]“).
- Kontaktangaben im Impressum (Platzhalter in eckigen Klammern).
- Echte Kursdaten statt Beispielterminen.
- Anmeldeformular verschickt noch nichts. Für den echten Betrieb braucht es einen Versanddienst oder ein Backend.
- Laut Auftrag soll jeder Fahrlehrer ein eigenes Login bekommen, und alle sollen alle Kurstermine bearbeiten können. Im statischen Entwurf noch nicht umgesetzt.
- Hosting und Domain entscheiden die acht Fahrlehrer (Favorit: Hostpoint und vku-oberbaselbiet.ch).
- Beim Start: Entwurfs-Hinweis, `noindex` und Sperre in `robots.txt` entfernen, Sitemap und Meta-Daten ergänzen.

## Regeln

- **Nichts erfinden.** Keine Termine, Preise, Namen oder Angaben, die nicht von Daniel oder den Fahrlehrern kommen. Fehlendes als Platzhalter in eckigen Klammern markieren.
- **Schreibstil:** Schweizer Schreibweise, immer „ss“, nie „ß“. Per Du, freundlich, direkt, einfache Sätze, kein Werbe-Deutsch.
- Jede Änderung auf dem Handy und am Computer, hell und dunkel prüfen. Nichts darf seitlich überstehen.
- Vor dem Arbeiten `git pull`, kleine Commits mit deutscher Beschreibung.
