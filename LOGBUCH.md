# Logbuch

Was wann geändert wurde, kompakt, mit Commit. Neueste Sitzung oben. Entscheide und Gründe stehen ausführlich in `CLAUDE.md`.

## 2. November 2026, abends · Dani mit Claude, nach dem Call mit den Fahrlehrer/innen

Wünsche aus dem Call umgesetzt.

| Änderung |
|---|
| Akzentfarbe Blau `#0055A4` mit weisser Schrift statt Gelb, auf allen Seiten. Kasten «Neu ab 1. Januar 2027» ganz blau mit weisser Schrift. Ampelpunkt «knapp» bleibt gelb. |
| Titel ohne Serifen. Drei Titelschriften zur Auswahl: Montserrat (Haupttitel), Archivo (Kurstitel), Space Grotesk («Drei Lokale. Alle Termine.»), übrige Titel Hanken Grotesk. Instrument Serif entfernt. |
| Pfade in `schriften/schriften.css` korrigiert (`url(datei.woff2)` statt `url(schriften/…)`), vorher lud der Browser keine der lokalen Schriften. |
| «Fahrlehrer/innen» auf der Startseite, im Menü, im Footer und in der Datenschutzerklärung. |
| Text unter dem Titel: «Wähle dein Lokal, suche dir einen Termin aus und melde dich …», Texte durchgesehen. |
| Fahrlehrer-Karten in zufälliger Reihenfolge bei jedem Aufruf. |
| Formular: FABER-PIN halb breit, daneben neu Geburtsdatum (auch in `anmeldung.php` und Datenschutzerklärung). |
| Preise: VKU CHF 200.00 inklusive Lernmaterial, Nothelfer CHF 150.00 inklusive Ausweis. |
| CLAUDE.md nachgeführt. |

Nachtrag: Kasten «Neu ab 1. Januar 2027» weiss mit blauem Rand, nur das Etikett blau (e8d6b5d). Hosting und Domain neu bei der Allware AG statt Hostpoint, in CLAUDE.md, README, `api.php` und Datenschutzerklärung nachgeführt.

Offen: Auswahl der Titelschrift, Farbton der Plakette abgleichen, Logins für zwei Fahrlehrer/innen (Dani mit Adi), Lieferungen der Fahrlehrer/innen (Logo, Portraits, Nothelfer-Links, Text «Neu ab Januar»).

## 2. November 2026 · Adi mit Claude, vor dem Call mit den Fahrlehrern

Ziel: Seite pflegbar machen (Mini-CMS), Anmeldung mit Platzlimite, Feinschliff an den Lokal-Karten.

| Änderung | Commit |
|---|---|
| Inhalte in Datendateien: `daten/` mit Lokalen, Kursen und Preisen, Terminen, Fahrlehrern. `app.js` baut daraus Lokal-Karten, Fahrlehrer-Karten, Zahlen und Preise. Vergangene Termine fallen weg, pro Lokal und Kurs die nächsten drei. Formular neu mit E-Mail-Feld und Pflichtfeld-Prüfung, Datenschutzerklärung ergänzt. | 761e002 |
| Verwaltung `verwaltung/`: Login, Reiter zum Pflegen, `api.php` speichert mit Sicherungskopie und Protokoll, `anmeldung.php` verschickt Anmeldungen. Ohne PHP Vorschau-Modus. Zugangsdaten per `.gitignore` nur auf dem Server. | 42000fa |
| CLAUDE.md und README: Aufbau, Entscheide, Einrichtung auf Hostpoint. | 48ff226 |
| Lokal-Karten teilen ein Zeilenraster (Subgrid): VKU und Nothelfer in allen Karten auf gleicher Höhe. | df1a474 |
| «Route planen» bei jedem Lokal, Liestal vorläufig auf die Ortssuche. | 6b695e0 |
| «Route planen» in allen Karten auf einer Linie. | 82e6bd3 |
| Plätze und Belegung pro Termin, Server lehnt bei vollem Termin ab, Platz wird bei Mailfehler freigegeben. | 0a2bcf0 |
| Menüpunkt «Login» im Kopf und im Klappmenü, führt zur Verwaltung. Vorläufig. | 5220939 |
| Demo-Werte für Plätze in den Beispielterminen, in CLAUDE.md als erfunden vermerkt. | f612ae8 |
| Freie Plätze immer anzeigen, mit Ampelpunkt grün, gelb, rot. Variante B von zwei gezeigten. | 6a236ad |
| Reiter «Fahrlehrer» aus der Verwaltung entfernt, Portraits pflegt AVADAM in `daten/fahrlehrer.json`. | 3ddf3b3 |
| Schriften lokal in `schriften/` statt von Google, auf allen vier Seiten. | 204ffca |

Bewusst nicht gebaut: «Beliebt»-Icon, Warteliste, Teilnehmerliste auf dem Server (Datenschutz), Rahmen um die Kursblöcke.

Offen nach dieser Sitzung: siehe CLAUDE.md «Noch offen», insbesondere Hosting, Logins und `konfig.php` auf Hostpoint, echte Termine und Preise, Adresse Liestal, Fototermin, Entscheid der Fahrlehrer zum Login im Menü.

## 7. November 2026 · Dani mit Claude

| Änderung | Commit |
|---|---|
| Adresse Lokal Liestal eingetragen: Sichternstrasse 7, 4410 Liestal. «Route planen» führt jetzt zur Adresse. | 3842061 |
