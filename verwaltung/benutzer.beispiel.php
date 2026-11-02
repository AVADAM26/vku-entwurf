<?php
// Vorlage für verwaltung/benutzer.php. Die echte Datei wird NICHT ins Repository eingecheckt (.gitignore).
//
// Pro Fahrlehrer ein Eintrag: Benutzername => Passwort-Hash. Alle dürfen alle Termine bearbeiten.
// Einen Hash erzeugen (Terminal, PHP vorhanden):
//   php -r 'echo password_hash("DeinPasswort", PASSWORD_DEFAULT), PHP_EOL;'
// oder einmalig über die Seite verwaltung/passwort.php (danach wieder löschen).
return [
    'rahel'     => '$2y$10$ersetzen-durch-echten-hash',
    'ken'       => '$2y$10$ersetzen-durch-echten-hash',
    'dominic'   => '$2y$10$ersetzen-durch-echten-hash',
    'georg'     => '$2y$10$ersetzen-durch-echten-hash',
    'christian' => '$2y$10$ersetzen-durch-echten-hash',
    'thomi'     => '$2y$10$ersetzen-durch-echten-hash',
    'roger'     => '$2y$10$ersetzen-durch-echten-hash',
    'thomas'    => '$2y$10$ersetzen-durch-echten-hash',
    'cornelia'  => '$2y$10$ersetzen-durch-echten-hash',
];
