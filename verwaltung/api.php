<?php
// Verwaltung der Verkehrsschule Oberbaselbiet: Login und Speichern der Datendateien in ../daten/.
// Braucht verwaltung/benutzer.php (siehe benutzer.beispiel.php). Läuft auf jedem Hosting mit PHP 8, zum Beispiel Hostpoint.
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$datenOrdner = dirname(__DIR__) . '/daten';
$sicherungOrdner = $datenOrdner . '/sicherung';
$sammlungen = ['termine', 'lokale', 'kurse'];   // fahrlehrer.json wird nicht über die Verwaltung geschrieben

function antwort(array $a, int $status = 200): void {
    http_response_code($status);
    echo json_encode($a, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$benutzerDatei = __DIR__ . '/benutzer.php';
if (!is_file($benutzerDatei)) {
    antwort(['ok' => false, 'fehler' => 'verwaltung/benutzer.php fehlt. Vorlage: benutzer.beispiel.php'], 500);
}
$benutzer = require $benutzerDatei;   // ['name' => 'passwort-hash', ...]

session_name('vku_verwaltung');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

$aktion = $_GET['aktion'] ?? '';
$eingabe = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $eingabe = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($eingabe)) $eingabe = [];
}

function angemeldet(): bool {
    return !empty($_SESSION['benutzer']) && !empty($_SESSION['token']);
}
function tokenPruefen(array $eingabe): void {
    if (!angemeldet()) antwort(['ok' => false, 'fehler' => 'Nicht angemeldet'], 401);
    if (empty($eingabe['token']) || !hash_equals($_SESSION['token'], (string) $eingabe['token'])) {
        antwort(['ok' => false, 'fehler' => 'Ungültige Sitzung, bitte neu anmelden'], 403);
    }
}

switch ($aktion) {
    case 'status':
        antwort(angemeldet()
            ? ['ok' => true, 'angemeldet' => true, 'benutzer' => $_SESSION['benutzer'], 'token' => $_SESSION['token']]
            : ['ok' => true, 'angemeldet' => false]);

    case 'login':
        // Kleine Bremse gegen Durchprobieren: nach jedem Fehlversuch eine Sekunde warten.
        $name = trim((string) ($eingabe['benutzer'] ?? ''));
        $pw = (string) ($eingabe['passwort'] ?? '');
        $hash = $benutzer[$name] ?? null;
        if ($hash === null || !password_verify($pw, $hash)) {
            sleep(1);
            antwort(['ok' => false, 'fehler' => 'Benutzername oder Passwort stimmt nicht'], 401);
        }
        session_regenerate_id(true);
        $_SESSION['benutzer'] = $name;
        $_SESSION['token'] = bin2hex(random_bytes(16));
        antwort(['ok' => true, 'benutzer' => $name, 'token' => $_SESSION['token']]);

    case 'logout':
        $_SESSION = [];
        session_destroy();
        antwort(['ok' => true]);

    case 'speichern':
        tokenPruefen($eingabe);
        $sammlung = (string) ($eingabe['sammlung'] ?? '');
        if (!in_array($sammlung, $sammlungen, true)) antwort(['ok' => false, 'fehler' => 'Unbekannte Sammlung'], 400);
        $daten = $eingabe['daten'] ?? null;
        if (!is_array($daten)) antwort(['ok' => false, 'fehler' => 'Keine Daten'], 400);

        // Grobe Prüfung, damit die Seite nachher noch läuft.
        $pflicht = [
            'termine' => ['id', 'lokal', 'kurs', 'tage'],
            'lokale' => ['id', 'name'],
            'kurse' => ['id', 'name', 'titel'],
        ][$sammlung];
        $ids = [];
        foreach ($daten as $i => $eintrag) {
            if (!is_array($eintrag)) antwort(['ok' => false, 'fehler' => "Eintrag $i ist kein Objekt"], 400);
            foreach ($pflicht as $feld) {
                if (!array_key_exists($feld, $eintrag)) antwort(['ok' => false, 'fehler' => "Eintrag $i: Feld «$feld» fehlt"], 400);
            }
            if (!preg_match('/^[a-z0-9-]{1,60}$/', (string) $eintrag['id'])) antwort(['ok' => false, 'fehler' => "Eintrag $i: ungültige ID"], 400);
            if (isset($ids[$eintrag['id']])) antwort(['ok' => false, 'fehler' => 'ID doppelt: ' . $eintrag['id']], 400);
            $ids[$eintrag['id']] = true;
            if ($sammlung === 'termine') {
                if (!is_array($eintrag['tage'])) antwort(['ok' => false, 'fehler' => "Eintrag $i: Tage fehlen"], 400);
                foreach ($eintrag['tage'] as $tag) {
                    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $tag)) antwort(['ok' => false, 'fehler' => "Eintrag $i: ungültiges Datum «$tag»"], 400);
                }
                if (isset($eintrag['plaetze']) && $eintrag['plaetze'] !== '' && (!is_int($eintrag['plaetze']) || $eintrag['plaetze'] < 0)) antwort(['ok' => false, 'fehler' => "Eintrag $i: Plätze muss eine ganze Zahl sein"], 400);
                if (isset($eintrag['belegt']) && (!is_int($eintrag['belegt']) || $eintrag['belegt'] < 0)) antwort(['ok' => false, 'fehler' => "Eintrag $i: Belegt muss eine ganze Zahl sein"], 400);
            }
            foreach ($eintrag as $k => $v) {
                if (!is_scalar($v) && !is_null($v) && !is_array($v)) antwort(['ok' => false, 'fehler' => "Eintrag $i: Feld «$k» hat einen ungültigen Wert"], 400);
                if (is_string($v) && strlen($v) > 5000) antwort(['ok' => false, 'fehler' => "Eintrag $i: Feld «$k» ist zu lang"], 400);
            }
        }

        $datei = "$datenOrdner/$sammlung.json";
        $neu = json_encode(array_values($daten), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
        if ($neu === false) antwort(['ok' => false, 'fehler' => 'Daten liessen sich nicht schreiben'], 500);

        // Sicherungskopie des alten Stands, die letzten 30 pro Sammlung bleiben.
        if (!is_dir($sicherungOrdner)) @mkdir($sicherungOrdner, 0755, true);
        if (is_file($datei)) {
            @copy($datei, "$sicherungOrdner/$sammlung-" . date('Ymd-His') . '.json');
            $alte = glob("$sicherungOrdner/$sammlung-*.json") ?: [];
            sort($alte);
            foreach (array_slice($alte, 0, max(0, count($alte) - 30)) as $alt) @unlink($alt);
        }
        if (file_put_contents($datei, $neu, LOCK_EX) === false) {
            antwort(['ok' => false, 'fehler' => 'Schreiben fehlgeschlagen. Darf der Webserver in daten/ schreiben?'], 500);
        }
        @file_put_contents("$sicherungOrdner/protokoll.txt", date('Y-m-d H:i:s') . ' ' . $_SESSION['benutzer'] . " speichert $sammlung\n", FILE_APPEND | LOCK_EX);
        antwort(['ok' => true]);

    default:
        antwort(['ok' => false, 'fehler' => 'Unbekannte Aktion'], 404);
}
