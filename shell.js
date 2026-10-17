/* Yangi qolip: sarlavha, pastki panel, pleyer, animatsiyalar (dars sahifasi uchun) */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var h1 = $('.w > h1'), home = $('a.home'), au = $('audio');
  if (!h1 || !$('.tabs')) return;

  /* --- sarlavha --- */
  var m = h1.textContent.match(/^\s*(\d+)-дарс:\s*(.*)$/) || [0, '', h1.textContent];
  try { if (m[1]) localStorage.setItem('oxirgi-dars', m[1]); } catch (e) {}
  var dh = document.createElement('div');
  dh.className = 'dh';
  dh.innerHTML =
    '<a href="' + (home ? home.getAttribute('href') : './') + '" aria-label="Дарслар"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></a>' +
    '<div class="tt">' + (m[1] ? '<small>' + m[1] + '-дарс</small>' : '') + '<b></b></div>' +
    '<button class="q" type="button" aria-label="Ёрдам"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/></svg></button>' +
    '<div class="hpop"></div>';
  $('.tt b', dh).textContent = m[2];
  h1.parentNode.insertBefore(dh, h1);
  var qb = $('.q', dh), hp = $('.hpop', dh), hint = $('#p1 .hint');
  if (hint) hp.appendChild(hint); else qb.style.display = 'none';
  qb.addEventListener('click', function (e) { e.stopPropagation(); hp.classList.toggle('on'); qb.classList.toggle('on'); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.hpop')) { hp.classList.remove('on'); qb.classList.remove('on'); } });

  /* --- pastki panel --- */
  var IC = [
    '<path d="M5 6h14M5 10h14M5 14h10M5 18h7"/>',
    '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
    '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12.2l2.4 2.4 4.6-5"/>'
  ];
  var tabs = $('.tabs'), ind = document.createElement('div');
  ind.className = 'ind';
  tabs.insertBefore(ind, tabs.firstChild);
  for (var i = 1; i <= 3; i++) {
    var b = document.getElementById('t' + i);
    if (b) b.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[i - 1] + '</svg>');
  }
  function cur() { for (var i = 1; i <= 3; i++) { var p = document.getElementById('p' + i); if (p && !p.classList.contains('hide')) return i; } return 1; }
  function stagger() {
    if (RM) return;
    var g = document.querySelectorAll('#p2 > *');
    for (var i = 0; i < g.length && i < 14; i++) {
      g[i].style.animation = 'none'; void g[i].offsetWidth;
      g[i].style.animation = 'rise .35s ' + (i * 45) + 'ms both';
    }
  }
  function sync() {
    var n = cur();
    ind.style.transform = 'translateX(' + (n - 1) * 100 + '%)';
    document.body.classList.toggle('nop', n != 1);
    hp.classList.remove('on'); qb.classList.remove('on');
    if (n == 2) stagger();
  }
  if (typeof window.tab === 'function') {
    var _tab = window.tab;
    window.tab = function (n) { _tab(n); sync(); };
  }
  sync();


  /* lug'at: bosib turganda belgilash menyusi chiqmasin */
  (function () {
    var p2 = document.getElementById('p2');
    if (!p2) return;
    ['contextmenu', 'selectstart', 'dragstart'].forEach(function (n) { p2.addEventListener(n, function (e) { e.preventDefault(); }); });
  })();
  /* --- pleyer --- */
  if (!au) return;
  var box = au.parentNode; box.style.display = 'none';
  var pb = document.createElement('div');
  pb.className = 'pbar';
  pb.innerHTML =
    '<button class="pb" type="button" aria-label="Ўқиш / тўхтатиш"><i class="i1"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l12 8-12 8z" fill="currentColor"/></svg></i><i class="i2"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg></i></button>' +
    '<div class="md"><div class="pq1"><div class="lb">Матнни тинглаш</div><span class="pqt">0:00</span></div>' +
    '<div class="pq2"><button class="pqs" type="button" data-d="-5" aria-label="5 сония орқага"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" fill="currentColor"/><text x="12" y="16.2" text-anchor="middle" font-size="7" font-weight="700" fill="currentColor">5</text></svg></button>' +
    '<div class="pqk"><div class="pqr"><i></i></div><b></b></div>' +
    '<button class="pqs" type="button" data-d="5" aria-label="5 сония олдинга"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2l5 4-5 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z" fill="currentColor"/><text x="12" y="16.2" text-anchor="middle" font-size="7" font-weight="700" fill="currentColor">5</text></svg></button></div></div>' +
    '<button class="sp" type="button" aria-label="Тезлик">1×</button>';
  document.body.appendChild(pb);
  var lb = $('.lb', pb), bar = $('.pqk i', pb), sp = $('.sp', pb), lastLn = null;
  $('.pb', pb).addEventListener('click', function () { if (typeof ppl === 'function') ppl(); });
  var tk = $('.pqk', pb), th = $('.pqk b', pb), tm = $('.pqt', pb), drag = false, dragP = 0;
  function fmt(t) { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + ('0' + t % 60).slice(-2); }
  function setP(p) { p = Math.max(0, Math.min(1, p)) * 100; bar.style.width = p + '%'; th.style.left = p + '%'; }
  function draw() {
    var d = au.duration;
    if (!d || !isFinite(d)) { tm.textContent = fmt(au.currentTime); return; }
    var t = drag ? dragP * d : au.currentTime;
    if (!drag) setP(t / d);
    tm.textContent = fmt(t) + ' / ' + fmt(d);
  }
  function pos(e) { var r = tk.getBoundingClientRect(); return (e.clientX - r.left) / r.width; }
  tk.addEventListener('pointerdown', function (e) {
    if (!au.duration) return;
    drag = true; dragP = Math.max(0, Math.min(1, pos(e)));
    tk.classList.add('dr'); setP(dragP); draw();
    try { tk.setPointerCapture(e.pointerId); } catch (x) {}
    e.preventDefault();
  });
  tk.addEventListener('pointermove', function (e) {
    if (!drag) return;
    dragP = Math.max(0, Math.min(1, pos(e))); setP(dragP); draw();
  });
  function endDrag() {
    if (!drag) return;
    drag = false; tk.classList.remove('dr');
    if (au.duration) au.currentTime = dragP * au.duration;
    draw();
  }
  tk.addEventListener('pointerup', endDrag);
  tk.addEventListener('pointercancel', endDrag);
  [].forEach.call(pb.querySelectorAll('.pqs'), function (b) {
    b.addEventListener('click', function () {
      if (!au.duration) return;
      au.currentTime = Math.max(0, Math.min(au.duration - 0.1, au.currentTime + parseFloat(b.getAttribute('data-d'))));
      draw();
      if (!RM) { b.classList.add('pop'); setTimeout(function () { b.classList.remove('pop'); }, 170); }
    });
  });
  (function loop() { if (!au.paused) draw(); requestAnimationFrame(loop); })();
  function state() { pb.classList.toggle('on', !au.paused && !au.ended); }
  function label() {
    var w = $('#tx .ws span.pl'), ln = w ? w.closest('.ln') : null;
    if (ln !== lastLn) {
      if (lastLn) lastLn.classList.remove('cur');
      if (ln) ln.classList.add('cur');
      lastLn = ln;
      var t = '';
      if (ln) {
        var all = document.querySelectorAll('#tx .ln'), k = [].indexOf.call(all, ln);
        try { t = TR[k].map(function (x) { return x[0]; }).join(' '); } catch (e) {}
      }
      lb.textContent = t || 'Матнни тинглаш';
    }
    draw();
  }
  ['play', 'pause', 'ended'].forEach(function (ev) { au.addEventListener(ev, function () { state(); label(); }); });
  au.addEventListener('timeupdate', label);
  au.addEventListener('loadedmetadata', label);
  au.addEventListener('seeked', draw);
  au.addEventListener('durationchange', draw);
  /* tezlik: 1× → 0.75× → 0.5× */
  var SB = [].slice.call(document.querySelectorAll('.spd button'));
  function rate() { var o = SB.filter(function (b) { return b.classList.contains('on'); })[0]; return o ? parseFloat(o.textContent) : 1; }
  function showRate() { sp.textContent = String(rate()) + '×'; }
  sp.addEventListener('click', function () {
    var r = rate(), nx = r === 1 ? 0.75 : (r === 0.75 ? 0.5 : 1);
    var b = SB.filter(function (b) { return parseFloat(b.textContent) === nx; })[0];
    if (b && typeof spd === 'function') spd(nx, b);
    showRate();
    if (!RM) { sp.classList.add('pop'); setTimeout(function () { sp.classList.remove('pop'); }, 170); }
  });
  showRate(); state(); label();
  setTimeout(showRate, 600);

  /* --- test natijasi: sanab chiqish va yulduzchalar --- */
  var p3 = document.getElementById('p3');
  if (p3 && window.MutationObserver) {
    new MutationObserver(function () {
      var el = $('.qsc', p3);
      if (!el || el.getAttribute('data-a')) return;
      var mm = el.textContent.match(/(\d+)\s*\/\s*(\d+)/);
      if (!mm) return;
      el.setAttribute('data-a', '1');
      var a = +mm[1], n = +mm[2];
      if (RM || !a) return;
      var t0 = 0, dur = Math.min(1400, 350 + a * 45);
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur), v = Math.round(a * (1 - Math.pow(1 - p, 3)));
        el.textContent = v + ' / ' + n;
        if (p < 1) requestAnimationFrame(step); else if (a / n >= 0.8) stars(el);
      }
      el.textContent = '0 / ' + n;
      requestAnimationFrame(step);
    }).observe(p3, { childList: true });
  }
  function stars(el) {
    if (!el.animate) return;
    for (var i = 0; i < 10; i++) {
      var s = document.createElement('span');
      s.className = 'qstar';
      s.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7.1L12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6z" fill="' + (i % 3 ? '#facc15' : '#f97316') + '"/></svg>';
      el.appendChild(s);
      var ang = (Math.PI * 2 * i) / 10 + Math.random() * 0.5, d = 70 + Math.random() * 50;
      s.animate([
        { transform: 'translate(0,0) scale(.3)', opacity: 0 },
        { opacity: 1, offset: 0.25 },
        { transform: 'translate(' + Math.cos(ang) * d + 'px,' + Math.sin(ang) * d + 'px) scale(1) rotate(' + (Math.random() * 300 - 150) + 'deg)', opacity: 0 }
      ], { duration: 1100 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      (function (s) { setTimeout(function () { s.remove(); }, 1600); })(s);
    }
  }
})();
