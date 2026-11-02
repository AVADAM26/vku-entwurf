<?php
// Hilfsseite: erzeugt aus einem Passwort den Hash für benutzer.php.
// Nur zum Einrichten auf den Server legen und danach wieder löschen.
declare(strict_types=1);
$hash = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['passwort'])) {
    $hash = password_hash((string) $_POST['passwort'], PASSWORD_DEFAULT);
}
?>
<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Passwort-Hash erzeugen</title>
<style>
body{font-family:system-ui,sans-serif;max-width:560px;margin:40px auto;padding:0 20px;line-height:1.5}
input,button{font:inherit;padding:10px 14px;border:1px solid #ccc;border-radius:8px;width:100%;box-sizing:border-box}
button{background:#17171A;color:#fff;border:none;margin-top:10px;cursor:pointer}
code{display:block;background:#f3f0e9;padding:12px;border-radius:8px;word-break:break-all;margin-top:16px}
</style>
</head>
<body>
<h1>Passwort-Hash erzeugen</h1>
<p>Passwort eingeben, den Hash in <code style="display:inline;padding:2px 6px">verwaltung/benutzer.php</code> eintragen. Diese Seite danach vom Server löschen.</p>
<form method="post">
<input type="password" name="passwort" placeholder="Passwort" autocomplete="new-password" required>
<button type="submit">Hash erzeugen</button>
</form>
<?php if ($hash): ?>
<code><?= htmlspecialchars($hash, ENT_QUOTES, 'UTF-8') ?></code>
<?php endif; ?>
</body>
</html>
