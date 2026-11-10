# Logbuch

Was wann geändert wurde, kompakt, mit Commit. Neueste Sitzung oben. Entscheide und Gründe stehen ausführlich in `CLAUDE.md`.

## 10. November 2026 · Dani mit Claude, vor dem Treffen der Fahrlehrer/innen

| Änderung |
|---|
| Alle Texte aus Sicht 2027 geschrieben (Seite geht im Januar 2027 live): FAQ ohne «bis Ende 2026» und «ab 2027», Theorieprüfung «enthält 55 Fragen», Unterseite ohne «neu», «weiterhin», «bleibt». |
| Menüpunkt und Titel der Unterseite: «Der Weg zum Führerschein» statt «Neu ab 2027» bzw. «Alle Änderungen ab 2027 im Überblick». Etiketten «Gilt seit» bzw. «Neu seit 1. Januar 2027». |
| FAQ: Platzhalter «Was sonst noch mitzubringen ist» und «Gilt das auch für Fahrschüler anderer Fahrschulen?» entfernt; neu «Anmelden kann sich jede und jeder.» |
| Footer «© 2027». CLAUDE.md nachgeführt. |
| Kasten «Neu seit 1. Januar 2027»: Text über die volle Breite der Box (vorher max. 70 Zeichen), mehr Abstand zwischen Knopf und Quellen. |
| FAQ: Bezahlen «Mit TWINT oder bar.», Bestätigung «per E-Mail» (Dani). |
| FAQ Abmeldung: bis 72 Stunden vorher kostenlos, danach voller Betrag (noch in Abklärung). Antworten aus dem Aufgaben-Dokument in CLAUDE.md, ohne Namen. |
| Logo der Verkehrsschule rechts vom Titel statt Platzhalter-Illustration; Darüberfahren oder Antippen eines Fahrschul-Logos zeigt das Foto der Person. |

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

## 7. November 2026 · Adi mit Claude, nach dem Call mit den Fahrlehrer/innen

| Änderung | Commit |
|---|---|
| Neuer Reiter «Neu ab 2027» ganz links im Menü, gleiche Optik wie die anderen. Neue Seite `neu-ab-2027.html` mit «Alle Änderungen ab 2027 im Überblick» (sechs Punkte aus dem Dokument der Fahrlehrer/innen). | 07965d2 |
| Infobox «Neu ab 1. Januar 2027»: «Mehr Informationen» führt jetzt auf die Seite «Neu ab 2027» statt aufs ASTRA. Die ASTRA-Quelle bleibt unter «Quellen». | 638dd71 |
| Infobox «Neu ab 1. Januar 2027»: neuer Text aus dem Dokument der Fahrlehrer/innen (zwei Kleinigkeiten korrigiert: «Den Verkehrskundeunterricht», «des VKU»). Bei der Quelle St. Gallen «gilt auch für die Kantone BL, BS, AG und SO». | c869d1b |
| Linktext St. Gallen neu: «Kanton St. Gallen, Neuerungen in der Fahrausbildung 2027, gilt auch für die Kantone BL, BS, AG und SO», der Hinweis gehört jetzt zum Link. | ea3fd5f |
| Infobox: «Mehr Informationen» ist jetzt ein Knopf im gleichen Stil wie «Termine ansehen» oben (schwarz, im Dunkelmodus hell), statt Textlink mit Pfeil. | aa4f5da |
| Alle ausgefüllten Knöpfe einheitlich blau (vorher «Termine ansehen», «Mehr Informationen», «Zu den Fahrlehrer/innen», «+ Neuer Termin» schwarz). Umrandete Knöpfe bleiben. CLAUDE.md nachgeführt. | 8ff4678 |

Offen aus dem gleichen Dokument: neue Texte für die Kurskarten VKU und Nothilfe, Nothilfe-Seiten «Kerninhalte», «Wichtigste Fakten», «Anmeldung» (Samariter Basel). Die Zahl «55 Fragen» noch mit einer Quelle prüfen.

## 7. November 2026 · Dani mit Claude, Kurskarten

| Änderung | Commit |
|---|---|
| Kurskarten VKU und Nothelfer: neue Texte aus dem Dokument der Fahrlehrer/innen. Nothelfer mit «Die Kerninhalte» und «Wichtigste Fakten» zum Aufklappen und Knopf «Anmeldung bei den Samaritern Basel». «Nothelferkurs» statt «Nothilfekurs», Blended Learning per Du. | d5ae10a |
