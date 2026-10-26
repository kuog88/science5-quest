/* 五年級下學期・藍海探索號：首頁航海圖、關卡流程、結算 */
(function () {
  var app = G.$('#app');
  var TITLE = '五年級下學期・藍海探索號';
  var KIND = { op: ['op', '動手做'], idea: ['idea', '觀念題'], boss: ['boss', '挑戰題'] };

  function lvId(u, i) { return u.id + '-' + (i + 1); }
  function total() {
    var s = 0, m = 0;
    G.units.forEach(function (u) { u.levels.forEach(function (_, i) { s += G.getStars(lvId(u, i)); m += 3; }); });
    return [s, m];
  }

  function home() {
    G.$('#top-title').textContent = TITLE;
    document.title = '五年級下學期・藍海探索號（自然 南一版）';
    var t = total();
    app.innerHTML = '<section class="hero"><div class="ribbon">⚓ 下學期 ⚓</div>' +
      '<h1 class="home-title">🚢 藍海探索號</h1>' +
      '<p>五福國小・五年級<b style="color:var(--coral)">下學期</b>・南一版自然</p>' +
      '<p>登上科學研究船，航向四座研究港，完成每一項調查任務！</p>' +
      '<div class="total">⭐ 收集星星 <b>' + t[0] + '</b> / ' + t[1] + '</div></section>' +
      '<div class="chart"><h2 class="route">🗺️ 本學期航線</h2><div class="ports">' + G.units.map(function (u) {
        return '<div class="port" style="--c:' + u.c + '"><div class="ph"><div class="buoy"><span class="em">' + u.e + '</span><span class="no">單元' + u.no + '</span></div>' +
          '<div><h2>' + u.name + '</h2><p class="sub">' + u.port + '・' + u.sub + '</p></div></div><div class="lvs">' +
          u.levels.map(function (lv, i) {
            var k = KIND[lv.kind];
            return '<button class="lvbtn" data-h="#/' + u.id + '/' + i + '"><span class="top"><span class="tag ' + k[0] + '">任務' + (i + 1) + '・' + k[1] + '</span><span class="stars">' + G.starText(G.getStars(lvId(u, i))) + '</span></span><span class="nm">' + lv.name + '</span></button>';
          }).join('') + '</div></div>';
      }).join('') + '</div></div>' +
      '<button class="reset">清除下學期的星星紀錄</button>' +
      '<p class="foot">可用滑鼠或手指操作・星星只存在這台裝置・這裡是<b>下學期</b>，上學期請按「← 選年級」</p>';
    app.querySelectorAll('.lvbtn').forEach(function (b) { b.onclick = function () { location.hash = b.dataset.h; }; });
    G.$('.reset', app).onclick = function () {
      if (confirm('確定要清除下學期的所有星星嗎？')) { G.save.stars = {}; G.persist(); home(); }
    };
  }

  function level(u, i) {
    var lv = u.levels[i], miss = 0, done = false;
    G.unpick();
    G.$('#top-title').textContent = '下學期・' + u.e + ' ' + u.name;
    document.title = lv.name + '｜五年級下學期・藍海探索號';
    var k = KIND[lv.kind];
    app.innerHTML = '<div class="lvhead" style="--c:' + u.c + '"><div class="crumb"><span class="sem">下學期</span>・單元' + u.no + '・' + u.name + '　<span class="tag ' + k[0] + '">任務' + (i + 1) + '・' + k[1] + '</span></div>' +
      '<h2 id="level-title" class="level-title">' + lv.name + '</h2><div class="inst"><button class="say" aria-label="朗讀說明">🔈</button><div>' + lv.inst + '</div></div></div>' +
      '<div class="bar"><span>最佳紀錄 <span class="stars">' + G.starText(G.getStars(lvId(u, i))) + '</span></span><span class="miss">失誤 <b>0</b></span></div>' +
      '<div class="area"></div>';
    G.$('.lvhead .say', app).onclick = function () { G.speak(lv.inst); };
    var area = G.$('.area', app);
    var api = {
      miss: function () { if (done) return; miss++; var b = G.$('.miss b', app); if (b) b.textContent = miss; },
      finish: function () {
        if (done) return; done = true;
        var th = lv.th || [0, 2];
        var s = G.starsByMiss(miss, th[0], th[1]);
        G.setStars(lvId(u, i), s); G.sfx.win();
        var nxt = i + 1 < u.levels.length ? '#/' + u.id + '/' + (i + 1) : null;
        if (!nxt) { var ui = G.units.indexOf(u); if (ui + 1 < G.units.length) nxt = '#/' + G.units[ui + 1].id + '/0'; }
        var msg = s === 3 ? '調查任務完美達成！' : s === 2 ? '很棒！再挑戰三顆星吧！' : '任務完成！多練習會更厲害喔！';
        area.innerHTML = '<div class="panel result"><div style="font-size:64px">' + (s === 3 ? '🏆' : s === 2 ? '🚢' : '⛵') + '</div>' +
          '<div class="bigstars">' + G.starText(s) + '</div><h2>' + msg + '</h2><p>失誤次數：' + miss + '</p>' +
          (lv.recap ? '<div class="why" style="text-align:left">📒 航海日誌重點：' + lv.recap + '</div>' : '') +
          '<div class="row"><button class="btn alt again">🔁 再玩一次</button>' + (nxt ? '<button class="btn nx">下一個任務 ➜</button>' : '') + '<button class="btn blue map">🗺️ 回航海圖</button></div></div>';
        G.$('.again', area).onclick = function () { level(u, i); };
        if (nxt) G.$('.nx', area).onclick = function () { location.hash = nxt; };
        G.$('.map', area).onclick = function () { location.hash = '#/'; };
        window.scrollTo(0, 0);
      }
    };
    var fn = G.types[lv.type];
    if (!fn) { area.innerHTML = '<div class="panel">找不到這個關卡類型：' + G.esc(lv.type) + '</div>'; return; }
    fn(lv, area, api);
    window.scrollTo(0, 0);
  }

  function route() {
    if (window.speechSynthesis) speechSynthesis.cancel();
    var m = location.hash.match(/^#\/(\w+)\/(\d+)/);
    if (m) {
      var u = G.units.filter(function (x) { return x.id === m[1]; })[0];
      if (u && u.levels[+m[2]]) return level(u, +m[2]);
    }
    home();
  }

  G.$('#btn-home').onclick = function () { location.hash = '#/'; };
  var sb = G.$('#btn-sound');
  function syncSound() { sb.textContent = G.soundOn ? '🔊' : '🔇'; }
  sb.onclick = function () { G.soundOn = !G.soundOn; G.save.sound = G.soundOn; G.persist(); syncSound(); };
  syncSound();
  window.addEventListener('hashchange', route);
  G.route = route;
  route();
})();
