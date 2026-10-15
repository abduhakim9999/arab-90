/* Internet bo'lsa — yangi nusxa (3 soniyada kelmasa saqlangani), internetsiz — saqlangan nusxa */
var C = 'arab-tili-v14';
var FILES = ["./", "index.html", "tg.js", "shell.js", "shell.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "70.html", "91.html", "92.html", "feellar.html"];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(C).then(function (c) {
    return c.match(r, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(r, { cache: 'no-cache' }).then(function (res) {
        if (res && res.ok) c.put(r, res.clone());
        return res;
      });
      if (!hit) return net;
      return new Promise(function (ok) {
        var done = false;
        function fin(x) { if (!done) { done = true; clearTimeout(t); ok(x); } }
        var t = setTimeout(function () { fin(hit); }, 3000);
        net.then(function (res) { fin(res && res.ok ? res : hit); }, function () { fin(hit); });
      });
    });
  }));
});
