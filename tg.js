/* Telegram Mini App ulanishi + natijalarni Telegram bulutida saqlash */
(function () {
  var me = document.currentScript;
  var KEY = me.getAttribute('data-key') || '';
  var HOME = me.getAttribute('data-home') || '';
  var TK = KEY + '-t', W = null, tm = null, last = 0, BLOCK = false;
  var LT0 = 0; try { LT0 = +(localStorage.getItem(TK) || 0); } catch (e) {}

  /* bosilganda darhol belgi: sahifa yuklanayotganini ko'rsatadi */
  try {
    var css = document.createElement('style');
    css.textContent = 'html.go body{pointer-events:none}' +
      'html.go::before{content:"";position:fixed;z-index:99;left:0;top:0;height:3px;width:100%;background:#0f7a4f;transform-origin:left;animation:gobar 1.4s cubic-bezier(.2,.8,.2,1) forwards}' +
      'html.go::after{content:"";position:fixed;inset:0;z-index:98;background:rgba(0,0,0,.05)}' +
      '@keyframes gobar{from{transform:scaleX(.08)}to{transform:scaleX(.9)}}';
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
  function inTg() {
    if (W) return true;
    if (window.TelegramWebviewProxy || /tgWebApp/.test(location.hash)) return true;
    try { return !!sessionStorage.getItem('__telegram__initParams'); } catch (e) { return false; }
  }
  /* sahifalar orasida o'tish: Telegramda tarix yig'ilmasin */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || ev.defaultPrevented || a.target || a.hasAttribute('download') || a.origin !== location.origin ||
        /^(#|javascript:)/.test(a.getAttribute('href')) || a.pathname === location.pathname) return;
    document.documentElement.classList.add('go');
    if (inTg()) { ev.preventDefault(); location.replace(a.href); }
  });
  window.addEventListener('pageshow', function () { document.documentElement.classList.remove('go'); });

  /* yangi versiya yuklanib bo'lishi bilan sahifa bir marta o'zi yangilanadi */
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      var rl = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (rl) return; rl = true;
        document.documentElement.classList.add('go');
        location.reload();
      });
    }
  } catch (e) {}

  /* mahalliy yozuvlarga vaqt belgisi */
  if (KEY) {
    try {
      var orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (BLOCK && this === window.localStorage && k === KEY) return;
        orig.call(this, k, v);
        if (this === window.localStorage && k === KEY) {
          orig.call(this, TK, String(Date.now()));
          if (W) { clearTimeout(tm); tm = setTimeout(up, 4000); }
        }
      };
    } catch (e) {}
  }

  function up() {
    if (!W || !KEY) return;
    var now = Date.now();
    if (now - last < 8000) { clearTimeout(tm); tm = setTimeout(up, 8000); return; }
    last = now;
    try {
      var p = JSON.stringify({ t: +(localStorage.getItem(TK) || now), v: localStorage.getItem(KEY) || '' });
      if (p.length < 4000) W.CloudStorage.setItem(KEY, p);
    } catch (e) {}
  }

  function pull() {
    W.CloudStorage.getItem(KEY, function (err, val) {
      if (err || !val) return;
      try {
        var c = JSON.parse(val), lt = LT0;
        if (c.v && c.t > lt + 1000) {
          localStorage.setItem(KEY, c.v);
          localStorage.setItem(TK, String(c.t));
          if (!sessionStorage.getItem(KEY + '-r')) { sessionStorage.setItem(KEY + '-r', '1'); BLOCK = true; location.reload(); }
        }
      } catch (e) {}
    });
  }

  function start() {
    var w = window.Telegram && Telegram.WebApp;
    if (!w || !w.initData) return;          /* oddiy brauzer */
    W = w;
    try { w.ready(); w.expand(); } catch (e) {}
    if (w.BackButton) {
      try {
        if (HOME) { w.BackButton.show(); w.BackButton.onClick(function () { document.documentElement.classList.add('go'); location.replace(HOME); }); }
        else w.BackButton.hide();            /* bosh sahifa: Telegram o'zi yopadi */
      } catch (e) {}
    }
    if (KEY && w.CloudStorage && w.isVersionAtLeast && w.isVersionAtLeast('6.9')) {
      pull();
      document.addEventListener('visibilitychange', function () { if (document.hidden) { last = 0; up(); } });
    }
    document.documentElement.classList.add('in-tg');
    document.dispatchEvent(new Event('tgready'));
  }

  var sc = document.createElement('script');
  sc.src = 'https://telegram.org/js/telegram-web-app.js';
  sc.onload = start;
  document.head.appendChild(sc);
})();
