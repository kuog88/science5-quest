/* 單元四 磁鐵 */
G.magnetSVG = function (x, leftPole, hidden) {
  var right = leftPole === 'N' ? 'S' : 'N';
  function half(px, p) {
    var fill = hidden ? '#b0bec5' : (p === 'N' ? '#ff5a4e' : '#4aa8ff');
    return '<rect x="' + px + '" y="40" width="75" height="40" fill="' + fill + '"/>' +
      '<text x="' + (px + 37.5) + '" y="68" text-anchor="middle" font-size="24" font-weight="900" fill="#fff">' + (hidden ? '?' : p) + '</text>';
  }
  return '<g>' + half(x, leftPole) + half(x + 75, right) + '<rect x="' + x + '" y="40" width="150" height="40" rx="4" fill="none" stroke="#37474f" stroke-width="3"/></g>';
};

/* 把右邊的磁鐵推向左邊的磁鐵，播放吸住或被推開的動畫 */
G.magnetPush = function (svg, leftPole1, leftPole2, hidden2, done) {
  var facing = leftPole1 === 'N' ? 'S' : 'N';   /* 左磁鐵右端 */
  var attract = facing !== leftPole2;
  var x = 240, t0 = performance.now();
  function frame(now) {
    if (!document.body.contains(svg)) return;
    var t = (now - t0) / 1000;
    if (attract) x = Math.max(170, 240 - t * 140 - t * t * 120);
    else x = t < 0.35 ? 240 - t * 100 : Math.min(250, 205 + (t - 0.35) * 160) + Math.sin(t * 40) * Math.max(0, 1 - t) * 2;
    svg.innerHTML = '<rect x="0" y="100" width="400" height="20" fill="#e8f0e4"/>' + G.magnetSVG(20, leftPole1, false) + G.magnetSVG(x, leftPole2, hidden2) +
      (attract && x <= 170 ? '<text x="170" y="30" text-anchor="middle" font-size="22">💥</text>' : '') +
      (!attract && t > 0.35 ? '<text x="190" y="30" text-anchor="middle" font-size="22">↔️</text>' : '');
    if ((attract && x > 170) || (!attract && t < 0.75)) requestAnimationFrame(frame);
    else done(attract);
  }
  requestAnimationFrame(frame);
};

G.types.poleLab = function (lv, area, api) {
  var p2 = 'N', seen = { a: false, r: false }, busy = false;
  area.innerHTML = '<div class="panel sim"><svg viewBox="0 0 400 120"></svg><div class="msg">先按「推過去」看看會發生什麼事？</div>' +
    '<div class="row"><button class="btn alt flip">🔄 把右邊磁鐵翻面</button><button class="btn blue push">👉 推過去</button></div>' +
    '<p style="text-align:center;color:var(--muted);font-weight:700">試出「吸在一起」和「互相推開」兩種結果：<span class="got">還沒試過</span></p>' +
    '<div class="row"><button class="btn go" disabled>我發現規則了，下一步 ➜</button></div></div>';
  var svg = G.$('svg', area), msg = G.$('.msg', area);
  function still() { svg.innerHTML = '<rect x="0" y="100" width="400" height="20" fill="#e8f0e4"/>' + G.magnetSVG(20, 'S', false) + G.magnetSVG(240, p2, false); }
  still();
  G.$('.flip', area).onclick = function () { if (busy) return; p2 = p2 === 'N' ? 'S' : 'N'; G.sfx.tick(); still(); msg.textContent = '翻面了！現在靠近的是 ' + p2 + ' 極。'; };
  G.$('.push', area).onclick = function () {
    if (busy) return; busy = true;
    G.magnetPush(svg, 'S', p2, false, function (att) {
      busy = false;
      if (att) { seen.a = true; G.sfx.ok(); msg.innerHTML = 'N 極碰 S 極：<b>吸在一起</b>了！（異極相吸）'; }
      else { seen.r = true; G.sfx.bad(); msg.innerHTML = 'N 極碰 N 極：<b>互相推開</b>！（同極相斥）'; }
      G.$('.got', area).textContent = (seen.a ? '✅吸在一起 ' : '⬜吸在一起 ') + (seen.r ? '✅互相推開' : '⬜互相推開');
      if (seen.a && seen.r) { var g = G.$('.go', area); g.disabled = false; G.bump(g, 'pop'); }
      setTimeout(function () { if (!busy && document.body.contains(svg)) still(); }, 1400);
    });
  };
  G.$('.go', area).onclick = function () { G.types.quiz({ qs: lv.qs, pick: lv.pick }, area, api); };
};

G.types.poleGuess = function (lv, area, api) {
  var r = 0, N = lv.rounds || 5;
  function show() {
    var p1 = Math.random() < .5 ? 'N' : 'S', p2 = Math.random() < .5 ? 'N' : 'S', tested = false, busy = false;
    area.innerHTML = '<div class="panel sim"><div class="bar"><span>第 ' + (r + 1) + ' / ' + N + ' 塊神祕磁鐵</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀">🔈</button><div class="q">右邊的磁鐵看不出磁極。先推過去試試看，再判斷<b>靠近左邊的那一端</b>是什麼極？</div></div>' +
      '<svg viewBox="0 0 400 120"></svg><div class="msg"></div>' +
      '<div class="row"><button class="btn blue push">👉 推過去試試</button></div>' +
      '<div class="row"><button class="btn ans" data-p="N" disabled style="background:#ff5a4e;box-shadow:0 5px 0 #c63d33">N 極</button><button class="btn ans" data-p="S" disabled style="background:#4aa8ff;box-shadow:0 5px 0 #2b7fd0">S 極</button></div>' +
      '<div class="why" hidden></div><div class="row nxrow" hidden><button class="btn nx">' + (r === N - 1 ? '完成！' : '下一塊 ➜') + '</button></div></div>';
    var svg = G.$('svg', area), msg = G.$('.msg', area);
    function still(hidden) { svg.innerHTML = '<rect x="0" y="100" width="400" height="20" fill="#e8f0e4"/>' + G.magnetSVG(20, p1, false) + G.magnetSVG(240, p2, hidden); }
    still(true);
    var face = p1 === 'N' ? 'S' : 'N';
    G.$('.say', area).onclick = function () { G.speak('右邊的磁鐵看不出磁極。先推過去試試看，再判斷靠近左邊的那一端是什麼極。'); };
    G.$('.push', area).onclick = function () {
      if (busy) return; busy = true;
      G.magnetPush(svg, p1, p2, true, function (att) {
        busy = false; tested = true;
        msg.innerHTML = att ? '吸在一起了！左邊靠近的是 <b>' + face + ' 極</b>。' : '被推開了！左邊靠近的是 <b>' + face + ' 極</b>。';
        area.querySelectorAll('.ans').forEach(function (b) { b.disabled = false; });
        setTimeout(function () { if (!busy && document.body.contains(svg)) still(true); }, 1200);
      });
    };
    area.querySelectorAll('.ans').forEach(function (b) {
      b.onclick = function () {
        if (!tested) return;
        if (b.dataset.p === p2) {
          G.sfx.ok(); still(false);
          area.querySelectorAll('.ans').forEach(function (x) { x.disabled = true; }); G.$('.push', area).disabled = true;
          var w = G.$('.why', area);
          w.innerHTML = '✅ 答對了！左邊是 ' + face + ' 極，' + (face === p2 ? '兩個同極，所以<b>互相排斥</b>。' : '一個 N 一個 S，所以<b>互相吸引</b>。');
          w.hidden = false; G.$('.nxrow', area).hidden = false;
        } else { G.sfx.bad(); api.miss(); b.disabled = true; G.bump(b, 'shake'); G.toast('想一想：同極相斥、異極相吸！'); }
      };
    });
    G.$('.nx', area).onclick = function () { r++; if (r < N) show(); else api.finish(); };
  }
  show();
};

G.units.push({
  id: 'u4', no: '四', name: '磁鐵', e: '🧲', c: '#a98bff',
  sub: '磁力的探討・磁鐵的特性・磁鐵與生活',
  levels: [
    {
      name: '磁鐵吸吸樂', kind: 'op', type: 'sort', th: [0, 2],
      inst: '拿磁鐵去吸吸看！哪些東西<b>會被磁鐵吸住</b>？把它們分類放好。',
      recap: '磁鐵會吸引<b>鐵製品</b>；塑膠、木頭、紙、玻璃，還有鋁和銅等金屬，<b>都不會</b>被磁鐵吸住。',
      bins: [
        { k: 'yes', t: '會被吸住', e: '🧲', c: '#ff5a4e' },
        { k: 'no', t: '不會被吸住', e: '🚫', c: '#90a4ae' }
      ],
      items: [
        { t: '迴紋針', e: '📎', k: 'yes', hint: '迴紋針是鐵做的。' },
        { t: '鐵螺絲', e: '🔩', k: 'yes', hint: '鐵做的東西會被磁鐵吸住。' },
        { t: '大頭針', e: '📌', k: 'yes', hint: '大頭針的針是鐵做的。' },
        { t: '安全別針', e: '🧷', k: 'yes', hint: '安全別針是鐵做的。' },
        { t: '鐵絲', e: '➰', k: 'yes', hint: '鐵絲是鐵做的。' },
        { t: '塑膠尺', e: '📏', k: 'no', hint: '塑膠不會被磁鐵吸住。' },
        { t: '木頭鉛筆', e: '✏️', k: 'no', hint: '木頭不會被磁鐵吸住。' },
        { t: '橡皮擦', e: '🧽', k: 'no', hint: '橡皮擦不是鐵做的。' },
        { t: '紙張', e: '📄', k: 'no', hint: '紙不會被磁鐵吸住。' },
        { t: '玻璃彈珠', e: '🔮', k: 'no', hint: '玻璃不會被磁鐵吸住。' },
        { t: '鋁罐', e: '🥫', k: 'no', hint: '鋁罐雖然是金屬，但不是鐵，不會被吸住喔！' },
        { t: '1元硬幣', e: '🪙', k: 'no', hint: '1元硬幣是銅做的，不會被磁鐵吸住！' }
      ]
    },
    {
      name: '磁極大發現', kind: 'idea', type: 'poleLab', pick: 6, th: [1, 3],
      inst: '把右邊的磁鐵推向左邊的磁鐵，翻面再試試，找出磁極的規則！',
      recap: '磁鐵兩端叫<b>磁極</b>（N 極、S 極），磁力最強；<b>同極相斥、異極相吸</b>；磁鐵不用直接碰到鐵也能吸引它。',
      qs: [
        { q: 'N 極靠近 N 極，會發生什麼事？', big: '🟥N ➜ N🟥', opts: ['互相排斥', '互相吸引', '沒有反應', '黏在一起拿不開'], a: 0, why: '同極相斥：N 對 N、S 對 S 會互相推開。' },
        { q: 'N 極靠近 S 極，會發生什麼事？', big: '🟥N ➜ S🟦', opts: ['互相吸引', '互相排斥', '沒有反應', '磁鐵會壞掉'], a: 0, why: '異極相吸：N 和 S 會互相吸引。' },
        { q: '把長條形磁鐵放進迴紋針堆裡，哪裡吸住最多迴紋針？', big: '🧲📎📎📎', opts: ['兩端', '正中間', '到處都一樣多', '都吸不到'], a: 0, why: '磁鐵兩端的磁極磁力最強，所以吸最多迴紋針。' },
        { q: '隔著一張墊板，磁鐵還能吸動下面的迴紋針嗎？', opts: ['可以，磁鐵不用直接接觸也能吸引鐵', '不行，一定要碰到', '只有塑膠墊板不行', '迴紋針會飛走'], a: 0, why: '磁力可以隔著東西作用，不直接接觸也能吸引鐵製品。' },
        { q: '磁鐵兩端的磁極，分別叫做什麼？', opts: ['N 極和 S 極', '上極和下極', '紅極和藍極', '大極和小極'], a: 0, why: '磁鐵的兩個磁極分別是 N 極和 S 極。' },
        { q: '磁鐵距離迴紋針越遠，吸引的力量會怎樣？', opts: ['越弱', '越強', '一樣', '突然變超強'], a: 0, why: '距離越遠，磁力越弱，所以要靠近一點才吸得起來。' },
        { q: '拿一塊鐵片放在桌上，用另一塊磁鐵的 N 極和 S 極分別靠近它，結果會怎樣？', opts: ['兩端都會吸住鐵片', '只有 N 極會吸', '只有 S 極會吸', '都會被推開'], a: 0, why: '鐵片沒有磁極，磁鐵的 N 極、S 極都會吸引它。' }
      ]
    },
    {
      name: '神祕磁鐵偵探', kind: 'boss', type: 'combo', th: [1, 3],
      inst: '用你知道的磁極規則，找出神祕磁鐵的磁極！最後還有生活應用題。',
      recap: '利用<b>同極相斥、異極相吸</b>，就能判斷沒有標示的磁極；磁鐵兩邊加上鐵片可以<b>吸住更重</b>的東西；生活中處處有磁鐵。',
      steps: [
        { type: 'poleGuess', rounds: 5 },
        {
          type: 'quiz', pick: 3, qs: [
            { q: '在磁鐵兩邊加上鐵片，能吸住的東西會怎樣？', opts: ['可以吸住更重的東西', '變得吸不住', '完全沒有改變', '磁鐵會變輕'], a: 0, why: '磁鐵兩邊加上鐵片，可以增加磁鐵能吸住的重量。' },
            { q: '下面哪一個<b>沒有</b>用到磁鐵？', opts: ['木頭椅子', '冰箱門上的磁鐵貼', '鉛筆盒的磁鐵扣', '指北針'], a: 0, why: '冰箱貼、鉛筆盒扣、指北針都用到磁鐵，木頭椅子沒有。' },
            { q: '指北針的指針可以指出方向，因為指針本身是什麼？', big: '🧭', opts: ['一根小磁鐵', '一根木棒', '一根塑膠棒', '會發光的燈'], a: 0, why: '指北針的指針是小磁鐵，會指向南北方向。' },
            { q: '磁鐵掉進沙堆裡，拿出來時沾了一些黑黑的砂，這些砂可能是什麼？', opts: ['含鐵的鐵砂', '塑膠砂', '木屑', '糖粒'], a: 0, why: '沙堆裡有含鐵的鐵砂，會被磁鐵吸住。' }
          ]
        }
      ]
    }
  ]
});
