<?php
// Vorlage für verwaltung/konfig.php. Die echte Datei wird NICHT ins Repository eingecheckt (.gitignore).
return [
    // Wohin die Anmeldungen gehen. Mehrere Adressen mit Komma trennen.
    'empfaenger' => 'anmeldung@beispiel.ch',
    // Absender der Mails. Muss zur Domain des Hostings gehören, sonst landen die Mails im Spam.
    'absender' => 'noreply@beispiel.ch',
    // Text in der Bestätigung an die angemeldete Person, zum Beispiel zu Bezahlung und Mitbringen.
    'bestaetigungstext' => "[Text folgt: Bezahlung, was mitbringen, wo man sich abmeldet.]",
];
