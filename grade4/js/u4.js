/* 單元四 電路好好玩 */

/* 燈泡：b = 亮度（0 不亮、0.25 暗、1 普通、4 很亮） */
G.bulbSVG = function (X, Y, b, gone) {
  if (gone) return '<rect x="' + (X - 16) + '" y="' + (Y - 18) + '" width="32" height="36" fill="#fff"/><text x="' + X + '" y="' + (Y + 6) + '" font-size="14" text-anchor="middle" fill="#e53935">拔掉</text>';
  var glow = b > 0 ? '<circle cx="' + X + '" cy="' + (Y - 6) + '" r="' + (16 + b * 4) + '" fill="#ffee58" opacity="' + Math.min(0.85, 0.25 + b * 0.15) + '"/>' : '';
  return glow + '<rect x="' + (X - 8) + '" y="' + (Y + 6) + '" width="16" height="12" fill="#90a4ae"/>' +
    '<circle cx="' + X + '" cy="' + (Y - 6) + '" r="14" fill="' + (b > 0 ? '#fff59d' : '#eceff1') + '" stroke="#78909c" stroke-width="2"/>' +
    '<path d="M' + (X - 5) + ' ' + (Y + 6) + ' L' + (X - 4) + ' ' + (Y - 6) + ' L' + (X + 4) + ' ' + (Y - 6) + ' L' + (X + 5) + ' ' + (Y + 6) + '" fill="none" stroke="' + (b > 0 ? '#ff6f00' : '#90a4ae') + '" stroke-width="2"/>';
};
G.battSVG = function (X, Y) {
  return '<rect x="' + (X - 26) + '" y="' + (Y - 11) + '" width="48" height="22" rx="4" fill="#ffb300" stroke="#6d4c41" stroke-width="2"/>' +
    '<rect x="' + (X + 22) + '" y="' + (Y - 5) + '" width="6" height="10" fill="#6d4c41"/>' +
    '<text x="' + (X - 18) + '" y="' + (Y + 5) + '" font-size="14" font-weight="900" fill="#4e342e">－</text><text x="' + (X + 8) + '" y="' + (Y + 5) + '" font-size="14" font-weight="900" fill="#4e342e">＋</text>';
};

/* 導電小偵探：把物品夾進電路缺口，看燈泡亮不亮 */
G.types.conduct = function (lv, area, api) {
  var tested = {}, cur = null;
  area.innerHTML = '<div class="panel sim"><svg viewBox="0 0 400 230"></svg><div class="msg">點一個物品，把它夾進電路的缺口！</div>' +
    '<div class="pool tools"></div><p class="note">已經測試 <b class="cnt">0</b> / ' + lv.items.length + ' 樣</p>' +
    '<div class="row"><button class="btn go" disabled>全部測完，下一步 ➜</button></div></div>';
  var svg = G.$('svg', area), msg = G.$('.msg', area);
  function draw() {
    var on = cur && cur.k === 'yes';
    svg.innerHTML = '<rect width="400" height="230" rx="14" fill="#f5f9ff"/>' +
      '<path d="M330 100 V50 H70 V190 H330 V150" fill="none" stroke="#e53935" stroke-width="5" stroke-linejoin="round"/>' +
      '<rect x="318" y="96" width="24" height="10" rx="3" fill="#455a64"/><rect x="318" y="144" width="24" height="10" rx="3" fill="#455a64"/>' +
      (cur ? '<text x="330" y="138" font-size="34" text-anchor="middle">' + cur.e + '</text>' : '<text x="352" y="130" font-size="13" fill="#90a4ae">缺口</text>') +
      '<rect x="160" y="30" width="80" height="40" fill="#f5f9ff"/>' + G.bulbSVG(200, 46, on ? 1 : 0) +
      '<rect x="150" y="178" width="100" height="24" fill="#f5f9ff"/>' + G.battSVG(200, 190);
  }
  var pool = G.$('.tools', area);
  G.shuffle(lv.items).forEach(function (it) {
    var b = document.createElement('button'); b.className = 'chip'; b.innerHTML = G.chipHTML(it); pool.appendChild(b);
    b.onclick = function () {
      cur = it; draw();
      if (it.k === 'yes') { G.sfx.ok(); msg.innerHTML = '💡 燈泡<b>亮了</b>！' + it.t + '<b>容易導電</b>。'; }
      else { G.sfx.tick(); msg.innerHTML = '⚫ 燈泡<b>不亮</b>，' + it.t + '<b>不容易導電</b>。'; }
      if (!tested[it.t]) {
        tested[it.t] = 1; b.classList.add('tested');
        var n = Object.keys(tested).length; G.$('.cnt', area).textContent = n;
        if (n === lv.items.length) { var g = G.$('.go', area); g.disabled = false; G.bump(g, 'pop'); }
      }
    };
  });
  draw();
  G.$('.go', area).onclick = function () {
    G.types.sort({
      bins: [{ k: 'yes', t: '容易導電（良導體）', e: '💡', c: '#ffb300' }, { k: 'no', t: '不容易導電', e: '⚫', c: '#78909c' }],
      items: lv.items
    }, area, api);
    area.insertAdjacentHTML('afterbegin', '<div class="why" style="margin:0 0 10px">📝 依照剛才的實驗結果，把物品分類！</div>');
  };
};

/* 串並聯實驗室：切換電池與燈泡的接法，觀察亮度 */
G.types.circuitlab = function (lv, area, api) {
  var st = { batt: 'one', bulb: 'one', pull: false };
  var NAME = { one: '1 顆', ser: '2 顆串聯', par: '2 顆並聯' };
  area.innerHTML = '<div class="panel sim"><svg viewBox="0 0 400 262"></svg><div class="msg"></div>' +
    '<div class="ctl"><div><b>🔋 電池：</b>' + ['one', 'ser', 'par'].map(function (k) { return '<button class="seg" data-g="batt" data-k="' + k + '">' + NAME[k] + '</button>'; }).join('') + '</div>' +
    '<div><b>💡 燈泡：</b>' + ['one', 'ser', 'par'].map(function (k) { return '<button class="seg" data-g="bulb" data-k="' + k + '">' + NAME[k] + '</button>'; }).join('') + '</div>' +
    '<div><button class="btn alt pull">✋ 拔掉一顆燈泡</button></div></div>' +
    '<ul class="tasks"></ul><div class="row"><button class="btn go" disabled>實驗完成，下一步 ➜</button></div></div>';
  var svg = G.$('svg', area), msg = G.$('.msg', area);
  var tick = G.checklist(G.$('.tasks', area), [
    { k: 'bs', t: '1 顆燈泡＋<b>電池串聯</b>' },
    { k: 'bp', t: '1 顆燈泡＋<b>電池並聯</b>' },
    { k: 'ls', t: '1 顆電池＋<b>燈泡串聯</b>' },
    { k: 'lp', t: '1 顆電池＋<b>燈泡並聯</b>' },
    { k: 'xs', t: '燈泡串聯時<b>拔掉一顆</b>' },
    { k: 'xp', t: '燈泡並聯時<b>拔掉一顆</b>' }
  ], function () { var g = G.$('.go', area); g.disabled = false; G.bump(g, 'pop'); });
  function group(kind, mode, X, Y, b, pull) {
    var h = '', put = kind === 'bulb' ? function (x, y, i) { return G.bulbSVG(x, y, b[i], pull && i === 1); } : function (x, y) { return G.battSVG(x, y); };
    if (mode === 'one') return '<rect x="' + (X - 36) + '" y="' + (Y - 20) + '" width="72" height="40" fill="#f5f9ff"/>' + put(X, Y, 0);
    if (mode === 'ser') return '<rect x="' + (X - 90) + '" y="' + (Y - 20) + '" width="180" height="40" fill="#f5f9ff"/><line x1="' + (X - 90) + '" y1="' + Y + '" x2="' + (X + 90) + '" y2="' + Y + '" stroke="#e53935" stroke-width="5"/>' +
      '<rect x="' + (X - 80) + '" y="' + (Y - 20) + '" width="60" height="40" fill="#f5f9ff"/><rect x="' + (X + 20) + '" y="' + (Y - 20) + '" width="60" height="40" fill="#f5f9ff"/>' + put(X - 50, Y, 0) + put(X + 50, Y, 1);
    h = '<rect x="' + (X - 80) + '" y="' + (Y - 46) + '" width="160" height="92" fill="#f5f9ff"/>' +
      '<path d="M' + (X - 80) + ' ' + Y + ' H' + (X - 70) + ' M' + (X - 70) + ' ' + (Y - 30) + ' V' + (Y + 30) + ' M' + (X + 70) + ' ' + (Y - 30) + ' V' + (Y + 30) + ' M' + (X + 70) + ' ' + Y + ' H' + (X + 80) +
      ' M' + (X - 70) + ' ' + (Y - 30) + ' H' + (X + 70) + ' M' + (X - 70) + ' ' + (Y + 30) + ' H' + (X + 70) + '" fill="none" stroke="#e53935" stroke-width="5"/>';
    return h + '<rect x="' + (X - 30) + '" y="' + (Y - 52) + '" width="60" height="40" fill="#f5f9ff"/><rect x="' + (X - 30) + '" y="' + (Y + 10) + '" width="60" height="40" fill="#f5f9ff"/>' + put(X, Y - 30, 0) + put(X, Y + 30, 1);
  }
  function draw() {
    var V = st.batt === 'ser' ? 2 : 1, b;
    if (st.bulb === 'one') b = [V * V, 0];
    else if (st.bulb === 'ser') b = st.pull ? [0, 0] : [V * V / 4, V * V / 4];
    else b = [V * V, st.pull ? 0 : V * V];
    svg.innerHTML = '<rect width="400" height="262" rx="14" fill="#f5f9ff"/>' +
      '<rect x="50" y="84" width="300" height="140" fill="none" stroke="#e53935" stroke-width="5" stroke-linejoin="round"/>' +
      group('bulb', st.bulb, 200, 84, b, st.pull) + group('batt', st.batt, 200, 224, null, false);
    var word = function (x) { return x >= 4 ? '<b>很亮</b>' : x >= 1 ? '<b>普通亮</b>' : x > 0 ? '<b>變暗</b>' : '<b>不亮</b>'; };
    var s = st.bulb === 'one' ? '燈泡' + word(b[0]) : st.pull ? (st.bulb === 'ser' ? '拔掉一顆後，另一顆也<b>不亮</b>了（電路斷了）' : '拔掉一顆後，另一顆<b>還是亮的</b>') : '兩顆燈泡都' + word(b[0]);
    if (st.batt === 'par' && st.bulb === 'one') s += '（和 1 顆電池差不多，但可以用比較久）';
    msg.innerHTML = s;
    area.querySelectorAll('.seg').forEach(function (x) { x.classList.toggle('on', st[x.dataset.g] === x.dataset.k); });
    var p = G.$('.pull', area); p.disabled = st.bulb === 'one'; p.textContent = st.pull ? '🔄 裝回燈泡' : '✋ 拔掉一顆燈泡';
    if (st.bulb === 'one' && st.batt === 'ser') tick('bs');
    if (st.bulb === 'one' && st.batt === 'par') tick('bp');
    if (st.batt === 'one' && st.bulb === 'ser' && !st.pull) tick('ls');
    if (st.batt === 'one' && st.bulb === 'par' && !st.pull) tick('lp');
    if (st.pull && st.bulb === 'ser') tick('xs');
    if (st.pull && st.bulb === 'par') tick('xp');
  }
  area.querySelectorAll('.seg').forEach(function (x) {
    x.onclick = function () { st[x.dataset.g] = x.dataset.k; st.pull = false; G.sfx.tick(); draw(); };
  });
  G.$('.pull', area).onclick = function () { st.pull = !st.pull; draw(); };
  draw();
  G.$('.go', area).onclick = function () { G.types.quiz({ qs: lv.qs }, area, api); };
};

G.units.push({
  id: 'u4', no: '四', name: '電路好好玩', e: '🔋', c: '#ef5350',
  sub: '讓燈泡亮的方式・電路的串聯和並聯・生活中的電',
  levels: [
    {
      name: '導電小偵探', kind: 'op', type: 'conduct', th: [0, 1],
      inst: '把不同的物品夾進電路的缺口，燈泡亮了就表示它容易導電。每一樣都要測試喔！',
      recap: '燈泡亮代表電路是<b>通路</b>。<b>金屬</b>（鐵、銅、鋁）和<b>鉛筆芯</b>容易導電，叫做<b>電的良導體</b>；塑膠、木頭、橡皮擦、玻璃不容易導電。',
      items: [
        { t: '鐵釘', e: '📍', k: 'yes' },
        { t: '迴紋針', e: '📎', k: 'yes' },
        { t: '鋁箔紙', e: '🥈', k: 'yes' },
        { t: '10 元硬幣', e: '🪙', k: 'yes' },
        { t: '鉛筆芯', e: '✏️', k: 'yes', hint: '鉛筆芯是石墨做的，雖然不是金屬，但是會導電喔！' },
        { t: '塑膠尺', e: '📏', k: 'no' },
        { t: '橡皮擦', e: '🧽', k: 'no' },
        { t: '木筷子', e: '🥢', k: 'no' },
        { t: '玻璃彈珠', e: '🔮', k: 'no' },
        { t: '橡皮筋', e: '➰', k: 'no' }
      ]
    },
    {
      name: '讓燈泡亮起來', kind: 'idea', type: 'quiz', pick: 8, th: [1, 3],
      inst: '燈泡、電池和電線要怎麼接，燈泡才會亮？選出正確答案吧！',
      recap: '電從電池<b>正極</b>出發，經過燈泡回到<b>負極</b>，形成<b>通路</b>燈泡才會亮；中間斷掉就是<b>斷路</b>。<b>開關</b>可以控制通路和斷路。',
      qs: [
        { q: '電線要接在燈泡的哪兩個地方，燈泡才會亮？', big: '💡', opts: ['燈泡底部的金屬點和側面的金屬螺紋', '燈泡的玻璃兩邊', '只接燈泡底部', '只接燈泡頂端'], a: 0, why: '燈泡底部和側面的金屬要分別接到電池的正極和負極。' },
        { q: '電路接好、燈泡會發亮，這樣的電路叫做什麼？', opts: ['通路', '斷路', '短路', '水路'], a: 0, why: '電可以從電池出發繞一圈回來，叫做通路。' },
        { q: '電路中有一條電線鬆掉了，燈泡不亮，這叫做什麼？', opts: ['斷路', '通路', '串聯', '並聯'], a: 0, why: '電路中斷了，電流不能通過，叫做斷路。' },
        { q: '開關在電路中有什麼作用？', opts: ['控制電路通路或斷路', '讓電池變大', '讓燈泡變色', '讓電線變長'], a: 0, why: '按下開關變通路燈亮，打開開關變斷路燈熄。' },
        { q: '乾電池上「＋」的那一端叫做什麼？', big: '🔋', opts: ['正極', '負極', '中間', '開關'], a: 0, why: '凸起、標示「＋」的是正極；平平、標示「－」的是負極。' },
        { q: '燈泡裡細細的、通電會發光的部分叫做什麼？', opts: ['燈絲', '燈罩', '電池', '開關'], a: 0, why: '電流通過燈絲時會發熱發光。' },
        { q: '發光二極體（LED）要怎麼接才會亮？', opts: ['長腳接電池正極，短腳接負極', '兩隻腳都接正極', '短腳接正極', '怎麼接都會亮'], a: 0, why: 'LED 有方向性，長腳接正極、短腳接負極才會亮。' },
        { q: '把電線直接接在電池的正極和負極，中間沒有燈泡，會怎樣？', opts: ['電線和電池會變得很燙，很危險', '燈泡變更亮', '電池充飽電', '什麼事都沒有'], a: 0, why: '這叫短路，電池和電線會發燙，很危險，不可以這樣做。' },
        { q: '下面哪一種物品最適合做電線外面的那層皮？', opts: ['塑膠', '銅', '鐵', '鋁'], a: 0, why: '塑膠不容易導電，包在電線外面可以防止觸電。' }
      ]
    },
    {
      name: '串並聯實驗室', kind: 'boss', type: 'circuitlab', th: [0, 1],
      inst: '切換電池和燈泡的接法，觀察燈泡亮度！再試試看拔掉一顆燈泡會怎樣。完成全部實驗再挑戰問題。',
      recap: '<b>電池串聯</b>燈泡較亮；<b>電池並聯</b>亮度和 1 顆差不多但用較久；<b>燈泡串聯</b>每顆較暗、拔掉一顆全部熄；<b>燈泡並聯</b>每顆一樣亮、拔掉一顆其他仍亮。家裡的電器是<b>並聯</b>的。',
      qs: [
        { q: '想讓 1 顆燈泡變得比較亮，2 顆電池要怎麼接？', opts: ['串聯', '並聯', '只用 1 顆', '正極接正極疊在一起'], a: 0, why: '電池串聯，燈泡會比較亮。' },
        { q: '兩顆燈泡<b>串聯</b>，拔掉其中一顆，另一顆會怎樣？', opts: ['也熄滅', '變得更亮', '亮度不變', '變成彩色'], a: 0, why: '串聯只有一條路，拔掉一顆電路就斷了。' },
        { q: '家裡的電燈、電視、冰箱可以各自開關，它們是怎麼連接的？', big: '🏠', opts: ['並聯', '串聯', '沒有連接', '用繩子綁'], a: 0, why: '並聯的電器各有自己的路，一個關掉不影響其他。' },
        { q: '用電時，下面哪個做法是<b>安全</b>的？', opts: ['手擦乾後再拔插頭，並抓住插頭拔', '用濕濕的手拔插頭', '拉電線把插頭拔出來', '一個插座插很多電器'], a: 0, why: '濕手容易觸電；拉電線會讓電線受損；插太多電器容易過熱。' },
        { q: '用完的廢電池要怎麼處理？', opts: ['拿到回收點回收', '丟進一般垃圾桶', '丟到河裡', '埋在花盆裡'], a: 0, why: '廢電池含有害物質，要拿到便利商店或回收點回收。' }
      ]
    }
  ]
});
