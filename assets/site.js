(function () {
  'use strict';

  var DATA = 'apps.json';
  var state = { data: null, active: null };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function load() {
    return fetch(DATA, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function renderTabs() {
    var nav = document.getElementById('tabs');
    nav.textContent = '';
    state.data.categories.forEach(function (cat, i) {
      var b = el('button', 'tab', cat.title);
      b.type = 'button';
      b.setAttribute('data-id', cat.id);
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () { select(cat.id); });
      nav.appendChild(b);
    });
  }

  function select(id) {
    state.active = id;
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (t) {
      t.classList.toggle('active', t.getAttribute('data-id') === id);
    });
    renderApps();
  }

  function renderApps() {
    var box = document.getElementById('content');
    box.textContent = '';
    var cat = null;
    state.data.categories.forEach(function (c) {
      if (c.id === state.active) cat = c;
    });
    if (!cat) { box.appendChild(el('p', 'empty', 'Категория не найдена')); return; }
    if (!cat.apps.length) { box.appendChild(el('p', 'empty', 'В этой категории пока пусто')); return; }
    cat.apps.forEach(function (a) { box.appendChild(card(a)); });
  }

  // Значок платформы (SVG-инлайн): окна Microsoft или робот Android
  function platformIcon(kind) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    if (kind === 'windows') {
      ['M3 3h8.5v8.5H3z', 'M12.5 3H21v8.5h-8.5z', 'M3 12.5h8.5V21H3z', 'M12.5 12.5H21V21h-8.5z'].forEach(function (d) {
        var p = document.createElementNS(ns, 'path');
        p.setAttribute('d', d);
        svg.appendChild(p);
      });
    } else {
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', 'M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.46 11.46 0 0 0-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 0 0 1 18h22a10.81 10.81 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z');
      svg.appendChild(p);
    }
    return svg;
  }

  function card(a) {
    var c = el('article', 'card');

    if (a.screenshot) {
      var media = el('div', 'card-media');
      var img = el('img', 'shot');
      img.src = a.screenshot;
      img.alt = a.name;
      img.loading = 'lazy';
      media.appendChild(img);
      if (a.icon) {
        var badge = el('span', 'media-badge');
        badge.appendChild(platformIcon(a.icon));
        badge.appendChild(el('span', null, a.icon === 'windows' ? 'Windows' : 'Android'));
        media.appendChild(badge);
      }
      c.appendChild(media);
    }

    var body = el('div', 'card-body');
    var h2 = el('h2', 'app-name');
    if (a.icon) {
      var picon = el('span', 'p-icon');
      picon.appendChild(platformIcon(a.icon));
      h2.appendChild(picon);
    }
    h2.appendChild(document.createTextNode(a.name));
    body.appendChild(h2);
    if (a.tagline) body.appendChild(el('p', 'tag', a.tagline));
    if (a.description) body.appendChild(el('p', 'desc', a.description));

    var meta = el('div', 'meta');
    if (a.version) meta.appendChild(el('span', 'chip accent', 'v' + a.version));
    if (a.platform) meta.appendChild(el('span', 'chip', a.platform));
    if (a.size) meta.appendChild(el('span', 'chip', a.size));
    if (a.license) meta.appendChild(el('span', 'chip', a.license));
    (a.tags || []).forEach(function (t) { meta.appendChild(el('span', 'chip', t)); });
    body.appendChild(meta);

    var act = el('div', 'actions');
    if (a.download) {
      var dl = el('a', 'btn btn-primary', a.downloadLabel || 'Скачать');
      dl.href = a.download;
      dl.rel = 'noopener';
      act.appendChild(dl);
    }
    if (a.downloadZip) {
      var zip = el('a', 'btn btn-outline', a.downloadZipLabel || 'ZIP-версия');
      zip.href = a.downloadZip;
      zip.rel = 'noopener';
      act.appendChild(zip);
    }
    if (a.source) {
      var src = el('a', 'btn btn-outline', 'Исходный код');
      src.href = a.source;
      src.rel = 'noopener';
      act.appendChild(src);
    }
    body.appendChild(act);

    if (a.releasePage) {
      var more = el('p', 'morelink');
      var lnk = el('a', null, 'Что нового — все файлы релиза');
      lnk.href = a.releasePage;
      lnk.rel = 'noopener';
      more.appendChild(lnk);
      body.appendChild(more);
    }

    if (a.requiresAdmin) body.appendChild(el('p', 'note', a.requiresAdmin));
    c.appendChild(body);
    return c;
  }

  function renderFooter() {
    var s = state.data.site;
    if (s.tagline) document.getElementById('tagline').textContent = s.tagline;

    var box = document.getElementById('footer-links');
    box.textContent = '';
    var made = document.createTextNode('Сделано ');
    var who = el('a', null, '@YoncFALL');
    who.href = s.links.github;
    who.rel = 'noopener';
    box.appendChild(made);
    box.appendChild(who);
    if (s.links.telegram) {
      box.appendChild(document.createTextNode(' · '));
      var tg = el('a', null, 'Telegram');
      tg.href = s.links.telegram;
      tg.rel = 'noopener';
      box.appendChild(tg);
    }
    document.getElementById('footer-note').textContent =
      'Открытый софт. Подписки и серверы не распространяются.';
  }

  function fail(err) {
    var box = document.getElementById('content');
    box.textContent = '';
    box.appendChild(el('p', 'empty', 'Не удалось загрузить список софта: ' + err.message));
  }

  load()
    .then(function (data) {
      state.data = data;
      state.active = data.categories.length ? data.categories[0].id : null;
      renderTabs();
      renderApps();
      renderFooter();
    })
    .catch(fail);
})();
