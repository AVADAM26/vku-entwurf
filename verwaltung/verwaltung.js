// Verwaltung der Verkehrsschule Oberbaselbiet. Bearbeitet daten/*.json über api.php.
// Ohne Server (zum Beispiel auf GitHub Pages) läuft die Seite im Vorschau-Modus: alles lässt sich anfassen, nichts wird gespeichert.
(function () {
  var site = document.getElementById('site');
  var API = 'api.php';
  var SAMMLUNGEN = ['termine', 'lokale', 'kurse'];   // fahrlehrer.json pflegt AVADAM direkt, nicht die Verwaltung
  var daten = {};        // aktueller Stand pro Sammlung
  var original = {};     // Stand beim Laden, für «Verwerfen» und «geändert?»
  var token = '';
  var vorschau = false;
  var aktiverReiter = 'termine';

  // ---------- Hilfen ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function klon(x) { return JSON.parse(JSON.stringify(x)); }
  function neueId(prefix, liste) {
    var n = 0;
    liste.forEach(function (e) { var m = /^(\D+)(\d+)$/.exec(e.id || ''); if (m && m[1] === prefix) n = Math.max(n, +m[2]); });
    return prefix + ('00' + (n + 1)).slice(-3);
  }
  function heuteIso() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  var WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  function tagText(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return '?';
    return WOCHENTAGE[d.getDay()] + ' ' + ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.';
  }
  // Gleiche Logik wie in app.js, damit die Vorschau zeigt, was auf der Seite steht.
  function terminText(t) {
    var tage = (t.tage || []).filter(Boolean).slice().sort();
    if (!tage.length) return '[Datum folgt]';
    var text;
    if (tage.length === 1) text = tagText(tage[0]);
    else if (tage.length === 2) text = tagText(tage[0]) + ' + ' + tagText(tage[1]);
    else {
      text = tagText(tage[0]) + ' – ' + tagText(tage[tage.length - 1]);
      var erster = new Date(tage[0] + 'T00:00:00'), letzter = new Date(tage[tage.length - 1] + 'T00:00:00');
      if (Math.round((letzter - erster) / 86400000) + 1 !== tage.length) {
        var wt = [];
        tage.forEach(function (iso) { var w = WOCHENTAGE[new Date(iso + 'T00:00:00').getDay()]; if (wt.indexOf(w) < 0) wt.push(w); });
        text += ', ' + wt.join(' + ');
      }
    }
    if (t.zeit) text += (tage.length > 2 && text.indexOf(', ') > 0 ? ' ' : ', ') + t.zeit;
    return text;
  }
  function plaetzeText(t) {
    var max = parseInt(t.plaetze, 10), belegt = parseInt(t.belegt, 10) || 0;
    if (!(max > 0)) return '';
    var frei = max - belegt;
    return frei <= 0 ? ', ausgebucht' : ', noch ' + frei + ' frei';
  }
  function name(sammlung, id) {
    var e = (daten[sammlung] || []).filter(function (x) { return x.id === id; })[0];
    return e ? e.name : id;
  }
  function geaendert() {
    return SAMMLUNGEN.some(function (s) { return JSON.stringify(daten[s]) !== JSON.stringify(original[s]); });
  }
  function meldung(text, art) {
    var m = $('meldung');
    m.textContent = text || '';
    m.className = 'meldung' + (art ? ' ' + art : '');
  }
  function fussZeigen() {
    $('fuss').hidden = !geaendert();
    if (!geaendert()) meldung('');
    else if (!$('meldung').textContent) meldung(vorschau ? 'Vorschau-Modus: Speichern lädt die Datei herunter.' : 'Ungespeicherte Änderungen.');
  }

  // ---------- Server ----------
  function api(aktion, body) {
    return fetch(API + '?aktion=' + aktion, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(Object.assign({ token: token }, body)) : undefined,
      credentials: 'same-origin'
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = JSON.parse(t); } catch (e) {}
        if (!j) throw new Error('kein-server');
        if (!r.ok && !j.fehler) j.fehler = 'Fehler ' + r.status;
        return j;
      });
    });
  }
  function ladenAlle() {
    return Promise.all(SAMMLUNGEN.map(function (s) {
      return fetch('../daten/' + s + '.json', { cache: 'no-cache' }).then(function (r) { return r.json(); });
    })).then(function (liste) {
      SAMMLUNGEN.forEach(function (s, i) { daten[s] = liste[i]; original[s] = klon(liste[i]); });
    });
  }

  // ---------- Reiter ----------
  function zeigeReiter(r) {
    aktiverReiter = r;
    document.querySelectorAll('[data-reiter]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-reiter') === r ? 'true' : 'false'); });
    SAMMLUNGEN.forEach(function (s) { $('reiter-' + s).hidden = s !== r; });
  }

  // ---------- Termine ----------
  function renderTermine() {
    var ziel = $('termine-liste');
    var heute = heuteIso();
    var lokale = daten.lokale, kurse = daten.kurse;
    function sortKey(t) { return (t.tage || []).filter(Boolean).slice().sort()[0] || '9999'; }
    ziel.innerHTML = lokale.map(function (l) {
      var liste = daten.termine.filter(function (t) { return t.lokal === l.id; }).sort(function (a, b) { return sortKey(a) < sortKey(b) ? -1 : 1; });
      var eintraege = liste.length ? liste.map(function (t) {
        var letzter = (t.tage || []).filter(Boolean).slice().sort().pop() || '';
        var vorbei = letzter && letzter < heute;
        return '<div class="eintrag' + (vorbei ? ' vorbei' : '') + '" data-id="' + esc(t.id) + '">' +
          '<div class="titel"><strong>' + esc(name('kurse', t.kurs)) + ' · ' + esc(l.name) + (vorbei ? ' <span class="klein">(vorbei)</span>' : '') + '</strong>' +
          '<span class="vorschau">Auf der Seite: ' + esc(terminText(t)) + '</span></div>' +
          '<div class="raster">' +
          '<label>Lokal<select data-feld="lokal">' + lokale.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === t.lokal ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select></label>' +
          '<label>Kurs<select data-feld="kurs">' + kurse.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === t.kurs ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select></label>' +
          '<label>Zeit <span class="klein">zum Beispiel 18:30–20:30, bei Nothelfer leer</span><input type="text" data-feld="zeit" value="' + esc(t.zeit) + '"></label>' +
          '<label>Plätze <span class="klein">Maximalzahl, leer = unbegrenzt</span><input type="number" min="0" step="1" inputmode="numeric" data-feld="plaetze" value="' + esc(t.plaetze == null ? '' : t.plaetze) + '"></label>' +
          '<label>Belegt <span class="klein">zählt der Server bei jeder Anmeldung hoch' + plaetzeText(t) + '</span><input type="number" min="0" step="1" inputmode="numeric" data-feld="belegt" value="' + esc(t.belegt || 0) + '"></label>' +
          '</div>' +
          '<label>Kurstage</label><div class="tage">' + (t.tage || []).map(function (iso, i) {
            return '<span style="display:inline-flex;gap:4px;align-items:center"><input type="date" data-tag="' + i + '" value="' + esc(iso) + '"><button type="button" data-tag-weg="' + i + '" aria-label="Tag entfernen">×</button></span>';
          }).join('') + '<button type="button" data-tag-neu>+ Tag</button></div>' +
          '<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">' +
          '<label class="zeile"><input type="checkbox" data-feld="ausgebucht"' + (t.ausgebucht ? ' checked' : '') + '>Ausgebucht</label>' +
          '<button type="button" class="btn ghost klein" data-termin-weg>Termin löschen</button></div>' +
          '</div>';
      }).join('') : '<p class="klein">Noch keine Termine in diesem Lokal.</p>';
      return '<div class="lokalgruppe"><h2 class="serif">' + esc(l.name) + '</h2><div class="liste">' + eintraege + '</div></div>';
    }).join('');
  }
  function terminVon(el) {
    var wrap = el.closest('.eintrag');
    var id = wrap && wrap.getAttribute('data-id');
    return daten.termine.filter(function (t) { return t.id === id; })[0];
  }
  $('termine-liste').addEventListener('change', function (e) {
    var t = terminVon(e.target); if (!t) return;
    var feld = e.target.getAttribute('data-feld');
    if (feld === 'ausgebucht') t.ausgebucht = e.target.checked;
    else if (feld === 'plaetze') t.plaetze = e.target.value.trim() === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
    else if (feld === 'belegt') t.belegt = Math.max(0, parseInt(e.target.value, 10) || 0);
    else if (feld) t[feld] = e.target.value.trim();
    else if (e.target.hasAttribute('data-tag')) t.tage[+e.target.getAttribute('data-tag')] = e.target.value;
    renderTermine(); fussZeigen();
  });
  $('termine-liste').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var t = terminVon(b); if (!t) return;
    if (b.hasAttribute('data-tag-neu')) {
      var letzter = t.tage.filter(Boolean).slice().sort().pop();
      var n = letzter ? new Date(letzter + 'T00:00:00') : new Date();
      if (letzter) n.setDate(n.getDate() + 1);
      t.tage.push(n.getFullYear() + '-' + ('0' + (n.getMonth() + 1)).slice(-2) + '-' + ('0' + n.getDate()).slice(-2));
    } else if (b.hasAttribute('data-tag-weg')) {
      t.tage.splice(+b.getAttribute('data-tag-weg'), 1);
    } else if (b.hasAttribute('data-termin-weg')) {
      if (!confirm('Diesen Termin löschen?')) return;
      daten.termine = daten.termine.filter(function (x) { return x !== t; });
    } else return;
    renderTermine(); fussZeigen();
  });

  // ---------- Lokale ----------
  function renderLokale() {
    $('lokale-liste').innerHTML = daten.lokale.map(function (l) {
      return '<div class="eintrag" data-id="' + esc(l.id) + '"><div class="titel"><strong>' + esc(l.name) + '</strong></div>' +
        '<div class="raster">' +
        '<label>Name<input type="text" data-feld="name" value="' + esc(l.name) + '"></label>' +
        '<label>Adresse<input type="text" data-feld="adresse" value="' + esc(l.adresse) + '" placeholder="Strasse Nr., PLZ Ort"></label>' +
        '<label>Hinweis <span class="klein">zum Beispiel «Nähe Dorfplatz»</span><input type="text" data-feld="hinweis" value="' + esc(l.hinweis) + '"></label>' +
        '<label>Foto <span class="klein">Pfad, leer = «Foto Lokal folgt»</span><input type="text" data-feld="foto" value="' + esc(l.foto) + '"></label>' +
        '</div></div>';
    }).join('');
  }
  $('lokale-liste').addEventListener('change', function (e) {
    var id = e.target.closest('.eintrag').getAttribute('data-id');
    var l = daten.lokale.filter(function (x) { return x.id === id; })[0];
    l[e.target.getAttribute('data-feld')] = e.target.value.trim();
    renderLokale(); fussZeigen();
  });

  // ---------- Kurse / Preise ----------
  function renderKurse() {
    $('kurse-liste').innerHTML = daten.kurse.map(function (k) {
      return '<div class="eintrag" data-id="' + esc(k.id) + '"><div class="titel"><strong>' + esc(k.titel) + '</strong></div>' +
        '<div class="raster"><label>Preis in CHF<input type="text" inputmode="decimal" data-feld="preis" value="' + esc(k.preis) + '" placeholder="220.00"></label></div></div>';
    }).join('');
  }
  $('kurse-liste').addEventListener('change', function (e) {
    var id = e.target.closest('.eintrag').getAttribute('data-id');
    var k = daten.kurse.filter(function (x) { return x.id === id; })[0];
    k[e.target.getAttribute('data-feld')] = e.target.value.trim();
    renderKurse(); fussZeigen();
  });

  function renderAlles() { renderTermine(); renderLokale(); renderKurse(); fussZeigen(); }

  // ---------- Speichern ----------
  function speichern() {
    var knopf = document.querySelector('[data-action="speichern"]');
    var zuSpeichern = SAMMLUNGEN.filter(function (s) { return JSON.stringify(daten[s]) !== JSON.stringify(original[s]); });
    if (!zuSpeichern.length) return;
    if (vorschau) {
      zuSpeichern.forEach(function (s) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(daten[s], null, 2) + '\n'], { type: 'application/json' }));
        a.download = s + '.json';
        document.body.appendChild(a); a.click(); a.remove();
      });
      meldung('Vorschau-Modus: ' + zuSpeichern.join(', ') + '.json heruntergeladen. Auf dem Server würde das jetzt gespeichert.', 'ok');
      return;
    }
    knopf.disabled = true;
    meldung('Speichern …');
    Promise.all(zuSpeichern.map(function (s) { return api('speichern', { sammlung: s, daten: daten[s] }); })).then(function (antworten) {
      var fehler = antworten.filter(function (a) { return !a.ok; })[0];
      if (fehler) throw new Error(fehler.fehler || 'Speichern fehlgeschlagen');
      zuSpeichern.forEach(function (s) { original[s] = klon(daten[s]); });
      meldung('Gespeichert. Die Seite zeigt den neuen Stand.', 'ok');
      setTimeout(fussZeigen, 2500);
    }).catch(function (e) {
      if (e.message === 'kein-server') meldung('Der Server antwortet nicht. Bitte nochmals versuchen.', 'fehler');
      else if (/angemeldet/i.test(e.message)) { meldung('Du bist nicht mehr angemeldet. Bitte neu anmelden.', 'fehler'); zeigeLogin(e.message); }
      else meldung(e.message, 'fehler');
    }).then(function () { knopf.disabled = false; });
  }

  // ---------- Login ----------
  function zeigeLogin(fehler) {
    $('login').hidden = false; $('app').hidden = true; $('fuss').hidden = true;
    $('wer').hidden = true; document.querySelector('[data-action="logout"]').hidden = true;
    var f = $('login-fehler'); f.textContent = fehler || ''; f.hidden = !fehler;
  }
  function zeigeApp(benutzer) {
    $('login').hidden = true; $('app').hidden = false;
    if (benutzer) { $('wer').textContent = 'Angemeldet als ' + benutzer; $('wer').hidden = false; }
    document.querySelector('[data-action="logout"]').hidden = vorschau;
    ladenAlle().then(renderAlles).catch(function () { meldung('Die Daten konnten nicht geladen werden.', 'fehler'); $('fuss').hidden = false; });
  }
  $('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(e.target);
    api('login', { benutzer: fd.get('benutzer'), passwort: fd.get('passwort') }).then(function (j) {
      if (!j.ok) throw new Error(j.fehler || 'Anmeldung fehlgeschlagen');
      token = j.token;
      zeigeApp(j.benutzer);
    }).catch(function (err) { zeigeLogin(err.message === 'kein-server' ? 'Der Server antwortet nicht.' : err.message); });
  });

  // ---------- Allgemein ----------
  function setTheme(dark) {
    site.classList.toggle('dark', dark);
    document.querySelectorAll('[data-action="theme"]').forEach(function (b) { b.textContent = dark ? 'Hell' : 'Dunkel'; });
    try { localStorage.setItem('vku-theme', dark ? 'dark' : 'light'); } catch (e) {}
  }
  try { if (localStorage.getItem('vku-theme') === 'dark') setTheme(true); } catch (e) {}

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action],[data-reiter]'); if (!t) return;
    if (t.hasAttribute('data-reiter')) { zeigeReiter(t.getAttribute('data-reiter')); return; }
    var a = t.getAttribute('data-action');
    if (a === 'theme') setTheme(!site.classList.contains('dark'));
    else if (a === 'speichern') speichern();
    else if (a === 'verwerfen') { if (confirm('Alle ungespeicherten Änderungen verwerfen?')) { SAMMLUNGEN.forEach(function (s) { daten[s] = klon(original[s]); }); renderAlles(); } }
    else if (a === 'logout') api('logout', {}).then(function () { token = ''; zeigeLogin(); }).catch(function () { zeigeLogin(); });
    else if (a === 'termin-neu') {
      var t0 = { id: neueId('t', daten.termine), lokal: daten.lokale[0].id, kurs: daten.kurse[0].id, tage: [heuteIso()], zeit: '', ausgebucht: false, plaetze: null, belegt: 0 };
      daten.termine.push(t0); renderTermine(); fussZeigen();
      var el = document.querySelector('.eintrag[data-id="' + t0.id + '"]'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (a === 'vergangene-loeschen') {
      var heute = heuteIso();
      var alt = daten.termine.filter(function (t) { var l = (t.tage || []).filter(Boolean).slice().sort().pop(); return l && l < heute; });
      if (!alt.length) { alert('Es gibt keine vergangenen Termine.'); return; }
      if (!confirm(alt.length + ' vergangene Termine löschen?')) return;
      daten.termine = daten.termine.filter(function (t) { return alt.indexOf(t) < 0; });
      renderTermine(); fussZeigen();
    }
  });
  window.addEventListener('beforeunload', function (e) { if (geaendert() && !vorschau) { e.preventDefault(); e.returnValue = ''; } });

  // Start: Gibt es einen Server und bin ich angemeldet?
  api('status').then(function (j) {
    if (j.angemeldet) { token = j.token; zeigeApp(j.benutzer); }
    else zeigeLogin();
  }).catch(function () {
    vorschau = true;
    $('vorschau-hinweis').hidden = false;
    zeigeApp('');
  });
})();
