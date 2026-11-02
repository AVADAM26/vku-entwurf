# Verkehrsschule Oberbaselbiet, Entwurf

Statischer Entwurf der gemeinsamen Webseite der Fahrlehrer im Oberbaselbiet.
Nur zur Ansicht: Das Anmeldeformular verschickt keine Daten, und die Seite ist für Suchmaschinen gesperrt.

Konzept und Umsetzung: AVADAM

## Aufbau

Reines HTML, CSS und JavaScript. Die Inhalte, die oft ändern, liegen als JSON in `daten/`
(Lokale, Kurse und Preise, Termine, Fahrlehrer); `app.js` baut daraus die Seite.
In `verwaltung/` pflegen die Fahrlehrer diese Daten mit Login (PHP, auf Hostpoint).
Ohne PHP, etwa auf GitHub Pages, läuft die Verwaltung im Vorschau-Modus und speichert nichts.
Alles Weitere in `CLAUDE.md`.
