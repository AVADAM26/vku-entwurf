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

$felder = ['kurs' => 'Kurs', 'vorname' => 'Vorname', 'name' => 'Name', 'strasse' => 'Strasse und Nr.', 'plz' => 'PLZ', 'ort' => 'Ort', 'faber' => 'FABER-PIN', 'email' => 'E-Mail', 'telefon' => 'Telefon'];
$werte = [];
foreach ($felder as $k => $bez) {
    $v = trim((string) ($e[$k] ?? ''));
    if ($v === '') antwort(['ok' => false, 'fehler' => "Bitte fülle alle Felder aus ($bez fehlt)."], 400);
    if (strlen($v) > 300) antwort(['ok' => false, 'fehler' => "$bez ist zu lang."], 400);
    $werte[$k] = preg_replace('/[\r\n]+/', ' ', $v);
}
if (empty($e['einverstanden'])) antwort(['ok' => false, 'fehler' => 'Bitte bestätige die Datenschutzerklärung.'], 400);
if (!filter_var($werte['email'], FILTER_VALIDATE_EMAIL)) antwort(['ok' => false, 'fehler' => 'Die E-Mail-Adresse sieht nicht richtig aus.'], 400);

$absender = $konfig['absender'];
$kopf = "From: Verkehrsschule Oberbaselbiet <$absender>\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n";

// 1. An die Fahrlehrer
$text = "Neue Anmeldung über die Webseite\n\n";
foreach ($felder as $k => $bez) $text .= str_pad($bez . ':', 18) . $werte[$k] . "\n";
$text .= "\nEingegangen: " . date('d.m.Y H:i') . "\n";
$betreff = '=?UTF-8?B?' . base64_encode('Anmeldung: ' . $werte['kurs'] . ' – ' . $werte['vorname'] . ' ' . $werte['name']) . '?=';
$ok = mail($konfig['empfaenger'], $betreff, $text, $kopf . "Reply-To: {$werte['email']}\r\n");
if (!$ok) antwort(['ok' => false, 'fehler' => 'Die Anmeldung konnte nicht verschickt werden. Bitte melde dich direkt bei einem Fahrlehrer.'], 500);

// 2. Bestätigung an die Person
$bestaetigung = "Hallo {$werte['vorname']}\n\nDanke für deine Anmeldung. Wir haben sie erhalten:\n\n"
    . "Kurs: {$werte['kurs']}\n\n"
    . ($konfig['bestaetigungstext'] ?? '')
    . "\n\nVerkehrsschule Oberbaselbiet\n";
@mail($werte['email'], '=?UTF-8?B?' . base64_encode('Deine Anmeldung: ' . $werte['kurs']) . '?=', $bestaetigung, $kopf . "Reply-To: {$konfig['empfaenger']}\r\n");

antwort(['ok' => true]);
