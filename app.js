// Verkehrsschule Oberbaselbiet. Steuert Dunkelmodus, Terminauswahl, Formular und das Auto nach oben.
// Lokale, Termine, Fahrlehrer und Preise kommen aus daten/*.json (gepflegt über verwaltung/).
(function () {
  var site = document.querySelector('.site');
  var themeBtns = document.querySelectorAll('[data-action="theme"]');

  function setTheme(dark) {
    site.classList.toggle('dark', dark);
    themeBtns.forEach(function (b) { b.textContent = dark ? 'Hell' : 'Dunkel'; });
    try { localStorage.setItem('vku-theme', dark ? 'dark' : 'light'); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('vku-theme'); } catch (e) {}
  if (saved === 'dark') setTheme(true);

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // ---------- Daten ----------
  var WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  function tagText(iso) {
    var d = new Date(iso + 'T00:00:00');
    var dd = ('0' + d.getDate()).slice(-2);
    var mm = ('0' + (d.getMonth() + 1)).slice(-2);
    return WOCHENTAGE[d.getDay()] + ' ' + dd + '.' + mm + '.';
  }

  // Macht aus den Tagen eines Termins die Zeile, die auf der Seite steht:
  //   4 Tage am Stück:   Mo 26.10. – Do 29.10., 18:30–20:30
  //   2 Tage:            Fr 06.11. + Sa 07.11.
  //   Tage mit Lücken:   Di 06.10. – Do 15.10., Di + Do 19:00–21:00
  function terminText(t) {
    var tage = (t.tage || []).slice().sort();
    if (!tage.length) return '[Datum folgt]';
    var text;
    if (tage.length === 1) text = tagText(tage[0]);
    else if (tage.length === 2) text = tagText(tage[0]) + ' + ' + tagText(tage[1]);
    else {
      text = tagText(tage[0]) + ' – ' + tagText(tage[tage.length - 1]);
      var erster = new Date(tage[0] + 'T00:00:00');
      var letzter = new Date(tage[tage.length - 1] + 'T00:00:00');
      var amStueck = Math.round((letzter - erster) / 86400000) + 1 === tage.length;
      if (!amStueck) {
        var wt = [];
        tage.forEach(function (iso) {
          var w = WOCHENTAGE[new Date(iso + 'T00:00:00').getDay()];
          if (wt.indexOf(w) < 0) wt.push(w);
        });
        text += ', ' + wt.join(' + ');
      }
    }
    if (t.zeit) text += (tage.length > 2 && text.indexOf(', ') > 0 && !/\d:\d\d$/.test(text) ? ' ' : ', ') + t.zeit;
    return text;
  }

  function heuteIso() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function laden(name) {
    return fetch('daten/' + name + '.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(name + ': ' + r.status);
      return r.json();
    });
  }

  var PIN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>';

  function renderLokale(lokale, kurse, termine) {
    var ziel = document.getElementById('lokale-liste');
    if (!ziel) return;
    var heute = heuteIso();
    var html = lokale.map(function (l) {
      var kopf = l.foto
        ? '<img src="' + esc(l.foto) + '" alt="' + esc('Lokal ' + l.name) + '" loading="lazy" style="display: block; width: 100%; height: 160px; object-fit: cover; border-bottom: 1px solid var(--line)">'
        : '<div style="height: 160px; background: var(--soft); display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 14px; border-bottom: 1px solid var(--line)">Foto Lokal folgt</div>';
      var adresse = l.adresse
        ? '<p style="margin: 6px 0 0; font-size: 15px; color: var(--muted)">' + esc(l.adresse) + '</p>'
        : '<p style="margin: 6px 0 0; font-size: 15px; color: var(--muted)">[Adresse folgt]</p>';
      var hinweis = l.hinweis ? '<p style="margin: 4px 0 0; font-size: 14px; color: var(--muted)">' + esc(l.hinweis) + '</p>' : '';
      var route = l.adresse
        ? '<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(l.adresse) + '" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; min-height: 44px; font-size: 15px; font-weight: 600">' + PIN + 'Route planen</a>'
        : '';
      var bloecke = kurse.map(function (k) {
        var liste = termine.filter(function (t) {
          return t.lokal === l.id && t.kurs === k.id && t.tage && t.tage.length && t.tage.slice().sort().pop() >= heute;
        }).sort(function (a, b) { return a.tage.slice().sort()[0] < b.tage.slice().sort()[0] ? -1 : 1; }).slice(0, 3);
        var zeilen = liste.length ? liste.map(function (t) {
          var text = terminText(t);
          var wahl = k.name + ' · ' + l.name + ' · ' + text;
          var knopf = t.ausgebucht
            ? '<span style="font-size: 14px; font-weight: 600; color: var(--muted); white-space: nowrap">Ausgebucht</span>'
            : '<button type="button" class="pick" data-action="pick" data-kurs="' + esc(wahl) + '">Anmelden</button>';
          return '<div class="slot"><span style="font-size: 15px">' + esc(text) + '</span>' + knopf + '</div>';
        }).join('') : '<div class="slot"><span style="font-size: 15px; color: var(--muted)">Neue Termine folgen</span></div>';
        return '<div class="lokal-kurs"><h4 class="serif" style="margin: 0 0 6px; font-size: 26px; line-height: 1.1">' + esc(k.name) + '</h4>' + zeilen + '</div>';
      }).join('');
      // Jede Karte belegt im Raster so viele Zeilen wie Foto + Kopf + Kurse. Mit Subgrid sind die Zeilen
      // in allen Karten gleich hoch, darum stehen VKU und Nothelfer überall auf derselben Höhe.
      return '<article class="lokal" style="grid-row: span ' + (2 + kurse.length) + '">' +
        '<div class="lokal-foto">' + kopf + '</div>' +
        '<div class="lokal-kopf"><h3 class="serif" style="margin: 0; font-size: 36px; line-height: 1">' + esc(l.name) + '</h3>' + adresse + hinweis + route + '</div>' +
        bloecke + '</article>';
    }).join('');
    ziel.innerHTML = html;
  }

  function renderFahrlehrer(liste) {
    var ziel = document.getElementById('team-grid');
    if (!ziel) return;
    ziel.innerHTML = liste.map(function (f) {
      var foto = f.foto
        ? '<img src="' + esc(f.foto) + '" alt="' + esc(f.fotoalt || f.name) + '" loading="lazy" style="display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; object-position: ' + esc(f.fokus || '50% 50%') + '; background: var(--line)">'
        : '<div style="aspect-ratio: 4 / 3; background: var(--soft); display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 14px">Foto folgt</div>';
      var link = f.link ? '<a href="' + esc(f.link) + '" target="_blank" rel="noopener" style="margin-top: 10px; font-size: 15px; font-weight: 600">' + esc(f.linktext || 'Zur Webseite') + ' ↗</a>' : '';
      return '<article style="background: var(--surface); border: 1px solid var(--line); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column">' + foto +
        '<div style="padding: 22px; display: flex; flex-direction: column; gap: 8px; flex-grow: 1"><h3 style="margin: 0; font-size: 19px; font-weight: 700">' + esc(f.name) + '</h3>' +
        '<p style="margin: 0; font-size: 14px; color: var(--muted)">' + esc(f.fahrschule) + '</p>' +
        '<p style="margin: 6px 0 0; font-size: 15px; line-height: 1.55; flex-grow: 1">' + esc(f.portrait || '[Kurzportrait folgt]') + '</p>' + link + '</div></article>';
    }).join('');
  }

  var ZAHLWORT = ['Null', 'Ein', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn', 'Elf', 'Zwölf'];
  function renderZahlen(lokale, fahrlehrer, kurse) {
    document.querySelectorAll('[data-anzahl="fahrlehrer"]').forEach(function (el) { el.textContent = fahrlehrer.length; });
    document.querySelectorAll('[data-anzahl="lokale"]').forEach(function (el) { el.textContent = lokale.length; });
    document.querySelectorAll('[data-anzahl="fahrlehrer-wort"]').forEach(function (el) { el.textContent = ZAHLWORT[fahrlehrer.length] || String(fahrlehrer.length); });
    kurse.forEach(function (k) {
      document.querySelectorAll('[data-preis="' + k.id + '"]').forEach(function (el) { el.textContent = k.preis ? 'CHF ' + k.preis : 'CHF XX.XX'; });
    });
  }

  if (document.getElementById('lokale-liste')) {
    Promise.all([laden('lokale'), laden('kurse'), laden('termine'), laden('fahrlehrer')]).then(function (d) {
      renderLokale(d[0], d[1], d[2]);
      renderFahrlehrer(d[3]);
      renderZahlen(d[0], d[3], d[1]);
      if (location.hash) {
        var ziel = document.getElementById(location.hash.slice(1));
        if (ziel) ziel.scrollIntoView();
      }
    }).catch(function (err) {
      var ziel = document.getElementById('lokale-liste');
      if (ziel) ziel.innerHTML = '<p style="margin: 0; color: var(--muted)">Die Termine konnten nicht geladen werden. Bitte später nochmals versuchen.</p>';
      if (window.console) console.error(err);
    });
  }

  // ---------- Anmeldung ----------
  var gewaehlt = document.getElementById('gewaehlt');
  var zuTerminen = document.getElementById('zu-terminen');
  var aendern = document.getElementById('aendern');
  var formular = document.getElementById('formular');
  var danke = document.getElementById('danke');
  var fehler = document.getElementById('formular-fehler');
  var hp = document.getElementById('hp');
  var gewaehlterKurs = '';

  function setChoice(text) {
    gewaehlterKurs = text || '';
    if (!gewaehlt) return;
    gewaehlt.textContent = text || 'Bitte oben bei einem Lokal einen Termin wählen';
    if (zuTerminen) zuTerminen.hidden = !!text;
    if (aendern) aendern.hidden = !text;
  }

  function zeigeFehler(text) {
    if (!fehler) return;
    fehler.textContent = text || '';
    fehler.hidden = !text;
  }

  function senden() {
    zeigeFehler('');
    if (!gewaehlterKurs) { zeigeFehler('Bitte zuerst oben einen Termin wählen.'); scrollToId('lokale'); return; }
    var felder = formular.querySelectorAll('[required]');
    var leer = null;
    felder.forEach(function (f) {
      if (leer) return;
      if (f.type === 'checkbox' ? !f.checked : !f.value.trim()) leer = f;
    });
    if (leer) {
      zeigeFehler(leer.type === 'checkbox' ? 'Bitte bestätige die Datenschutzerklärung.' : 'Bitte fülle alle Felder aus.');
      leer.focus();
      return;
    }
    // Spamschutz: Bots füllen das unsichtbare Feld aus. Dann still verwerfen.
    if (hp && hp.value) { formular.hidden = true; danke.hidden = false; return; }

    var daten = { kurs: gewaehlterKurs };
    formular.querySelectorAll('input[name]').forEach(function (f) {
      if (f.name !== 'website') daten[f.name] = f.type === 'checkbox' ? f.checked : f.value.trim();
    });
    var knopf = formular.querySelector('[data-action="send"]');
    if (knopf) knopf.disabled = true;

    // Auf dem Webserver nimmt verwaltung/anmeldung.php die Anmeldung entgegen und verschickt sie.
    // Auf GitHub Pages gibt es kein PHP; dann bleibt es bei der Dankes-Meldung (Entwurf).
    fetch('verwaltung/anmeldung.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(daten)
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = JSON.parse(t); } catch (e) {}
        if (j && j.ok) return true;
        if (j && j.fehler) throw new Error(j.fehler);
        if (r.status === 404 || !j) return 'entwurf';
        throw new Error('Senden fehlgeschlagen');
      });
    }).catch(function (e) {
      if (/fehlgeschlagen|Failed to fetch|NetworkError/.test(e.message)) return 'entwurf';
      throw e;
    }).then(function (ergebnis) {
      formular.hidden = true;
      danke.hidden = false;
      danke.setAttribute('data-modus', ergebnis === 'entwurf' ? 'entwurf' : 'gesendet');
      scrollToId('anmeldung');
    }).catch(function (e) {
      zeigeFehler(e.message || 'Das hat leider nicht geklappt. Bitte melde dich direkt bei einem Fahrlehrer.');
    }).then(function () {
      if (knopf) knopf.disabled = false;
    });
  }

  if (formular) formular.addEventListener('submit', function (e) { e.preventDefault(); senden(); });

  // Menü auf dem Handy
  var menu = document.getElementById('menu-mob');
  var menuBtn = document.querySelector('[data-action="menu"]');
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.querySelector('.ico-open').hidden = open;
    menuBtn.querySelector('.ico-close').hidden = !open;
    menuBtn.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
  }
  document.querySelectorAll('[data-close-menu]').forEach(function (l) { l.addEventListener('click', function () { setMenu(false); }); });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var a = t.getAttribute('data-action');
    if (a === 'menu') setMenu(menu && menu.hidden);
    else if (a === 'theme') setTheme(!site.classList.contains('dark'));
    else if (a === 'lokale') scrollToId('lokale');
    else if (a === 'pick') {
      setChoice(t.getAttribute('data-kurs'));
      zeigeFehler('');
      if (formular) formular.hidden = false;
      if (danke) danke.hidden = true;
      scrollToId('anmeldung');
    } else if (a === 'reset') {
      setChoice('');
      zeigeFehler('');
      if (formular) { formular.reset(); formular.hidden = false; }
      if (danke) danke.hidden = true;
    }
  });

  // Auto unten rechts: erscheint nach etwas Scrollen, raucht kurz und fährt dann nach oben.
  var car = document.getElementById('topcar');
  var smoke = document.getElementById('smoke');
  var phase = 'idle';
  function onScroll() {
    if (!car || phase !== 'idle') return;
    car.classList.toggle('show', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (car) car.addEventListener('click', function () {
    if (phase !== 'idle') return;
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go() {
      phase = 'drive';
      car.classList.remove('burn');
      car.classList.add('show', 'drive');
      if (smoke) smoke.classList.add('fade');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(function () {
        phase = 'idle';
        car.classList.remove('drive', 'show');
        if (smoke) smoke.classList.remove('on', 'fade');
      }, 1000);
    }
    if (calm) { go(); return; }
    phase = 'burn';
    car.classList.add('burn');
    if (smoke) smoke.classList.add('on');
    setTimeout(go, 900);
  });
})();
