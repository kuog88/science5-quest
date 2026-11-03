/* 三上自然探險島：首頁地圖、關卡流程、結算（三版本：單元依 BOOK 目前版本排列） */
(function () {
  var app = G.$('#app');
  var KIND = { op: ['op', '動手做'], idea: ['idea', '觀念題'], boss: ['boss', '挑戰題'] };
  var PUB = { nani: '南一', kang: '康軒', han: '翰林' };

  function lvId(u, i) { return u.id + '-' + (i + 1); }
  function unitOf(id) { return G.units.filter(function (x) { return x.id === id; })[0]; }

  /* ---------- 三版本 ---------- */
  function ver() { return window.KGVer ? KGVer.cur(BOOK).version : BOOK.defaultVersion; }
  function vunits() { return window.KGVer ? KGVer.units(BOOK) : BOOK.versions[BOOK.defaultVersion]; }
  /* 版本單元的 levels：'u2' 是整個遊戲單元，'u2-1' 只用第 1 關 → [[遊戲單元, 關卡索引], …] */
  function slots(vu) {
    var out = [];
    vu.levels.forEach(function (ref) {
      var m = String(ref).match(/^(\w+?)(?:-(\d+))?$/), u = m && unitOf(m[1]);
      if (!u) return;
      if (m[2]) out.push([u, +m[2] - 1]); else u.levels.forEach(function (_, i) { out.push([u, i]); });
    });
    return out;
  }
  function seq() { var s = []; vunits().forEach(function (vu) { slots(vu).forEach(function (x) { s.push(x); }); }); return s; }
  /* 這一關在目前版本屬於哪個單元（找不到就用遊戲單元本身） */
  function ctxOf(u, i) {
    var all = BOOK.versions[ver()] || [];
    for (var k = 0; k < all.length; k++) {
      if (slots(all[k]).some(function (x) { return x[0] === u && x[1] === i; })) return { no: all[k].no, title: all[k].title };
    }
    return { no: u.no, title: u.name };
  }
  function examBank() {
    var v = ver(), eb = { grade: EXAM_BANK.grade, papers: EXAM_BANK.papers, bank: EXAM_BANK.bank.filter(function (q) { return !q || !q.only || q.only.indexOf(v) >= 0; }) };
    return window.KGVer ? KGVer.examBank(BOOK, eb) : eb;
  }
  G.mountExam = function () {
    var box = G.$('#exam-box');
    if (box && window.KGExam && window.EXAM_BANK) KGExam.mount(box, examBank());
  };

  function total() {
    var s = 0, m = 0;
    seq().forEach(function (x) { s += G.getStars(lvId(x[0], x[1])); m += 3; });
    return [s, m];
  }

  function home() {
    G.$('#top-title').textContent = '三上自然探險島';
    var t = total();
    app.innerHTML = '<section class="hero"><h1><span class="bob">🌱</span> 三上自然探險島 <span class="bob">🧲</span></h1>' +
      '<p>三年級上學期・' + PUB[ver()] + '版自然</p>' +
      '<div class="total">⭐ 星星 <b>' + t[0] + '</b> / ' + t[1] + '</div></section>' +
      '<div id="ver-bar"></div>' +
      '<div class="grid">' + vunits().map(function (vu) {
        var sl = slots(vu), u0 = sl.length ? sl[0][0] : { e: '📘', c: 'var(--green)' };
        var subs = [];
        sl.forEach(function (x) { if (subs.indexOf(x[0]) < 0) subs.push(x[0]); });
        return '<div class="ucard" style="--c:' + u0.c + '"><h2><span class="em">' + u0.e + '</span>第 ' + vu.no + ' 單元 ' + vu.title + '</h2><p class="sub">' + subs.map(function (u) { return u.sub; }).join('・') + '</p>' +
          sl.map(function (x) {
            var u = x[0], i = x[1], lv = u.levels[i], k = KIND[lv.kind];
            return '<button class="lvbtn" data-h="#/' + u.id + '/' + i + '"><span class="tag ' + k[0] + '">' + k[1] + '</span><span class="nm">' + lv.name + '</span><span class="stars">' + G.starText(G.getStars(lvId(u, i))) + '</span></button>';
          }).join('') + '</div>';
      }).join('') + '</div>' +
      '<section class="exam-sec"><div id="exam-box"></div></section>' +
      '<button class="reset">清除我的星星紀錄</button>' +
      '<p class="foot">可用滑鼠或手指操作・星星只存在這台裝置</p>';
    if (window.KGVer) KGVer.bar(G.$('#ver-bar', app), BOOK, home);
    G.mountExam();
    app.querySelectorAll('.lvbtn').forEach(function (b) { b.onclick = function () { location.hash = b.dataset.h; }; });
    G.$('.reset', app).onclick = function () {
      if (confirm('確定要清除所有星星嗎？')) { G.save.stars = {}; G.persist(); home(); }
    };
  }

  function level(u, i) {
    var lv = u.levels[i], miss = 0, done = false, cx = ctxOf(u, i);
    G.score = { ok: 0 };
    G.unpick();
    G.$('#top-title').textContent = u.e + ' ' + cx.title;
    var k = KIND[lv.kind];
    if (window.KGReport) KGReport.level(cx.no + '-' + (i + 1) + ' ' + k[1] + '：' + lv.name, '第 ' + cx.no + ' 單元 ' + cx.title);
    app.innerHTML = '<div class="lvhead" style="--c:' + u.c + '"><div class="crumb">第 ' + cx.no + ' 單元・' + cx.title + '　<span class="tag ' + k[0] + '">' + k[1] + '</span></div>' +
      '<h2>' + lv.name + '</h2><div class="inst"><button class="say" aria-label="朗讀說明">🔈</button><div>' + lv.inst + '</div></div></div>' +
      '<div class="bar"><span>最佳紀錄 <span class="stars">' + G.starText(G.getStars(lvId(u, i))) + '</span></span><span class="miss">失誤 <b>0</b></span></div>' +
      '<div class="area"></div>';
    G.$('.lvhead .say', app).onclick = function () { G.speak(lv.inst); };
    var area = G.$('.area', app);
    var api = {
      miss: function () { if (done) return; miss++; var b = G.$('.miss b', app); if (b) b.textContent = miss; },
      finish: function () {
        if (done) return; done = true;
        var ok = G.score.ok, s = G.starsByRate(ok, miss), rate = ok + miss ? Math.round(ok / (ok + miss) * 100) : 100;
        if (s) { G.setStars(lvId(u, i), s); G.sfx.win(); } else G.sfx.bad();
        if (window.KGReport) KGReport.done({ stars: s });
        /* 下一關：依目前版本的單元順序 */
        var sq = seq(), nxt = null;
        for (var n = 0; n < sq.length; n++) if (sq[n][0] === u && sq[n][1] === i) { if (sq[n + 1]) nxt = '#/' + sq[n + 1][0].id + '/' + sq[n + 1][1]; break; }
        var msg = s === 0 ? '答對的還不到四成，這次沒有過關。先看重點整理，再挑戰一次！' : s === 3 ? (miss ? '幾乎全對，太厲害了！' : '太厲害了！全對過關！') : s === 2 ? '很棒！再挑戰看看能不能拿三顆星？' : '過關了！多練習會更好喔！';
        area.innerHTML = '<div class="panel result"><div style="font-size:64px">' + (s === 0 ? '💪' : s === 3 ? '🏆' : s === 2 ? '🎉' : '👍') + '</div>' +
          '<div class="bigstars">' + G.starText(s) + '</div><h2>' + msg + '</h2><p>答對 ' + ok + ' 次、失誤 ' + miss + ' 次（答對率 ' + rate + '%）</p>' +
          (lv.recap ? '<div class="why" style="text-align:left">📒 重點整理：' + lv.recap + '</div>' : '') +
          '<div class="row"><button class="btn alt again">🔁 再玩一次</button>' + (nxt ? '<button class="btn nx">下一關 ➜</button>' : '') + '<button class="btn blue map">🗺️ 回地圖</button></div></div>';
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
      var u = unitOf(m[1]);
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
