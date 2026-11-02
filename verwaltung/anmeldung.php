<?php
// Nimmt die Kursanmeldung von der Startseite entgegen und verschickt sie per E-Mail.
// Braucht verwaltung/konfig.php (siehe konfig.beispiel.php). Ohne PHP (GitHub Pages) bleibt die Seite im Entwurfs-Modus.
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function antwort(array $a, int $status = 200): void {
    http_response_code($status);
    echo json_encode($a, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') antwort(['ok' => false, 'fehler' => 'Nur POST'], 405);

$konfigDatei = __DIR__ . '/konfig.php';
if (!is_file($konfigDatei)) antwort(['ok' => false, 'fehler' => 'verwaltung/konfig.php fehlt. Vorlage: konfig.beispiel.php'], 500);
$konfig = require $konfigDatei;

$e = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($e)) antwort(['ok' => false, 'fehler' => 'Ungültige Anfrage'], 400);

// Spamschutz: das unsichtbare Feld muss leer bleiben.
if (!empty($e['website'])) antwort(['ok' => true]);

$felder = ['kurs' => 'Kurs', 'vorname' => 'Vorname', 'name' => 'Name', 'strasse' => 'Strasse und Nr.', 'plz' => 'PLZ', 'ort' => 'Ort', 'faber' => 'FABER-PIN', 'geburtsdatum' => 'Geburtsdatum', 'email' => 'E-Mail', 'telefon' => 'Telefon'];
$werte = [];
foreach ($felder as $k => $bez) {
    $v = trim((string) ($e[$k] ?? ''));
    if ($v === '') antwort(['ok' => false, 'fehler' => "Bitte fülle alle Felder aus ($bez fehlt)."], 400);
    if (strlen($v) > 300) antwort(['ok' => false, 'fehler' => "$bez ist zu lang."], 400);
    $werte[$k] = preg_replace('/[\r\n]+/', ' ', $v);
}
if (empty($e['einverstanden'])) antwort(['ok' => false, 'fehler' => 'Bitte bestätige die Datenschutzerklärung.'], 400);
if (!filter_var($werte['email'], FILTER_VALIDATE_EMAIL)) antwort(['ok' => false, 'fehler' => 'Die E-Mail-Adresse sieht nicht richtig aus.'], 400);

// Platz reservieren: Termin in daten/termine.json suchen, Belegung prüfen, um eins erhöhen.
// Die Datei ist während der Prüfung gesperrt, damit zwei gleichzeitige Anmeldungen nicht beide durchkommen.
$terminId = trim((string) ($e['termin'] ?? ''));
$termineDatei = dirname(__DIR__) . '/daten/termine.json';
$reserviert = false;
function belegungAendern(string $datei, string $terminId, int $delta): array {
    $fh = fopen($datei, 'c+');
    if (!$fh || !flock($fh, LOCK_EX)) return ['ok' => false, 'fehler' => 'Termine nicht lesbar'];
    $inhalt = stream_get_contents($fh);
    $termine = json_decode($inhalt ?: '[]', true);
    if (!is_array($termine)) { flock($fh, LOCK_UN); fclose($fh); return ['ok' => false, 'fehler' => 'Termine nicht lesbar']; }
    $gefunden = false;
    foreach ($termine as &$t) {
        if (($t['id'] ?? '') !== $terminId) continue;
        $gefunden = true;
        $max = isset($t['plaetze']) && $t['plaetze'] !== '' && $t['plaetze'] !== null ? (int) $t['plaetze'] : 0;
        $belegt = (int) ($t['belegt'] ?? 0);
        if ($delta > 0 && (!empty($t['ausgebucht']) || ($max > 0 && $belegt >= $max))) {
            flock($fh, LOCK_UN); fclose($fh);
            return ['ok' => false, 'fehler' => 'Dieser Termin ist inzwischen ausgebucht. Bitte wähle einen anderen.'];
        }
        $t['belegt'] = max(0, $belegt + $delta);
    }
    unset($t);
    if (!$gefunden) { flock($fh, LOCK_UN); fclose($fh); return ['ok' => false, 'fehler' => 'Diesen Termin gibt es nicht mehr. Bitte wähle oben neu.']; }
    $neu = json_encode(array_values($termine), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
    ftruncate($fh, 0); rewind($fh); fwrite($fh, $neu); fflush($fh);
    flock($fh, LOCK_UN); fclose($fh);
    return ['ok' => true];
}
if ($terminId !== '' && is_file($termineDatei)) {
    $r = belegungAendern($termineDatei, $terminId, 1);
    if (!$r['ok']) antwort($r, 409);
    $reserviert = true;
}

$absender = $konfig['absender'];
$kopf = "From: Verkehrsschule Oberbaselbiet <$absender>\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n";

// 1. An die Fahrlehrer
$text = "Neue Anmeldung über die Webseite\n\n";
foreach ($felder as $k => $bez) $text .= str_pad($bez . ':', 18) . $werte[$k] . "\n";
$text .= "\nEingegangen: " . date('d.m.Y H:i') . "\n";
$betreff = '=?UTF-8?B?' . base64_encode('Anmeldung: ' . $werte['kurs'] . ' – ' . $werte['vorname'] . ' ' . $werte['name']) . '?=';
$ok = mail($konfig['empfaenger'], $betreff, $text, $kopf . "Reply-To: {$werte['email']}\r\n");
if (!$ok) {
    // Mail fehlgeschlagen: den reservierten Platz wieder freigeben.
    if ($reserviert) belegungAendern($termineDatei, $terminId, -1);
    antwort(['ok' => false, 'fehler' => 'Die Anmeldung konnte nicht verschickt werden. Bitte melde dich direkt bei einem Fahrlehrer.'], 500);
}

// 2. Bestätigung an die Person
$bestaetigung = "Hallo {$werte['vorname']}\n\nDanke für deine Anmeldung. Wir haben sie erhalten:\n\n"
    . "Kurs: {$werte['kurs']}\n\n"
    . ($konfig['bestaetigungstext'] ?? '')
    . "\n\nVerkehrsschule Oberbaselbiet\n";
@mail($werte['email'], '=?UTF-8?B?' . base64_encode('Deine Anmeldung: ' . $werte['kurs']) . '?=', $bestaetigung, $kopf . "Reply-To: {$konfig['empfaenger']}\r\n");

antwort(['ok' => true]);
