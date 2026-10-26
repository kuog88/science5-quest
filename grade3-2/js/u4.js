/* 單元四 廚房中的科學 */

/* 砂糖溶解實驗（模擬）：水量加倍、水溫提高，能溶解的糖都會變多 */
G.SUGAR_CAP = { 'c100': 5, 'c200': 10, 'w100': 7, 'w200': 14 };
G.cupSVG = function (ml, warm, spoons, cap) {
  var h = ml === 200 ? 150 : 80, top = 220 - h, extra = Math.max(0, spoons - cap);
  var tint = Math.min(spoons, cap) / 14;
  var pile = '';
  for (var i = 0; i < extra; i++) {
    var row = Math.floor(i / 4), col = i % 4;
    pile += '<ellipse cx="' + (95 + col * 17 + (row % 2) * 8) + '" cy="' + (214 - row * 7) + '" rx="11" ry="5" fill="#fffef5" stroke="#d8cfa8"/>';
  }
  var steam = warm ? '<g stroke="#fff" stroke-width="3" fill="none" opacity=".6"><path d="M105 ' + (top - 10) + ' q-6 -10 0 -20"/><path d="M135 ' + (top - 10) + ' q6 -10 0 -20"/></g>' : '';
  return '<svg viewBox="0 0 240 240" style="max-width:240px">' + steam +
    '<rect x="72" y="' + top + '" width="96" height="' + h + '" fill="' + (warm ? '#ffb38a' : '#7fd0ff') + '" opacity="' + (0.55 + tint * 0.3).toFixed(2) + '"/>' + pile +
    '<path d="M70 50 L70 220 Q70 226 76 226 L164 226 Q170 226 170 220 L170 50" fill="none" stroke="#dfe6ff" stroke-width="4"/>' +
    '<text x="176" y="' + (top + 5) + '" font-size="13" fill="#dfe6ff">' + ml + 'mL</text></svg>';
};

G.types.sugarlab = function (lv, area, api) {
  var ml = 100, warm = false, spoons = 0, rec = {};
  function key() { return (warm ? 'w' : 'c') + ml; }
  area.innerHTML = '<div class="panel sim"><div class="mission">選一種水量和水溫，一匙一匙加入砂糖並攪拌，直到杯底出現<b>沉澱</b>。四種組合都要做！</div>' +
    '<div class="simrow"><div class="simbox"><h3>🥛 實驗杯</h3><div class="cup"></div><div class="msg"></div></div>' +
    '<div class="simbox"><h3>⚙️ 實驗設定</h3><div class="seg sml"><button data-ml="100">100 mL</button><button data-ml="200">200 mL</button></div>' +
    '<div class="seg stp"><button data-w="0">🧊 冷水</button><button data-w="1">♨️ 溫水</button></div>' +
    '<div class="row"><button class="btn add">🥄 加一匙糖並攪拌</button><button class="btn alt pour">🫗 倒掉重做</button></div>' +
    '<table class="rec"><tr><th>最多溶解幾匙</th><th>100 mL</th><th>200 mL</th></tr><tr><th>冷水</th><td data-k="c100">？</td><td data-k="c200">？</td></tr><tr><th>溫水</th><td data-k="w100">？</td><td data-k="w200">？</td></tr></table></div></div>' +
    '<div class="row"><button class="btn go" disabled>四杯都完成了，看結果 ➜</button></div></div>';
  function draw() {
    var cap = G.SUGAR_CAP[key()];
    G.$('.cup', area).innerHTML = G.cupSVG(ml, warm, spoons, cap);
    area.querySelectorAll('.sml button').forEach(function (b) { b.classList.toggle('on', +b.dataset.ml === ml); });
    area.querySelectorAll('.stp button').forEach(function (b) { b.classList.toggle('on', !!+b.dataset.w === warm); });
    area.querySelectorAll('td[data-k]').forEach(function (td) { td.textContent = rec[td.dataset.k] != null ? rec[td.dataset.k] + ' 匙' : '？'; td.classList.toggle('cur', td.dataset.k === key()); });
    var msg = G.$('.msg', area);
    if (!spoons) msg.innerHTML = '已加入 0 匙';
    else if (spoons <= cap) msg.innerHTML = '已加入 ' + spoons + ' 匙，糖<b>全部溶解</b>，看不到顆粒';
    else msg.innerHTML = '已加入 ' + spoons + ' 匙，杯底出現<b>沉澱</b>了！';
    G.$('.add', area).disabled = spoons > cap;
  }
  function reset() { spoons = 0; draw(); }
  area.querySelectorAll('.sml button').forEach(function (b) { b.onclick = function () { ml = +b.dataset.ml; reset(); }; });
  area.querySelectorAll('.stp button').forEach(function (b) { b.onclick = function () { warm = !!+b.dataset.w; reset(); }; });
  G.$('.pour', area).onclick = reset;
  G.$('.add', area).onclick = function () {
    var cap = G.SUGAR_CAP[key()];
    spoons++; G.sfx.tick();
    if (spoons > cap && rec[key()] == null) {
      rec[key()] = cap; G.sfx.ok();
      G.toast('📝 記錄下來：' + (warm ? '溫水' : '冷水') + ' ' + ml + ' mL 最多溶解 ' + cap + ' 匙糖。', 3000);
      if (Object.keys(rec).length === 4) { var g = G.$('.go', area); g.disabled = false; G.bump(g, 'pop'); }
    }
    draw();
  };
  G.$('.go', area).onclick = function () { G.types.quiz({ qs: lv.qs }, area, api); };
  draw();
};

/* 紫色高麗菜汁變色 */
G.LIQ = {
  vinegar: { t: '白醋', e: '🍶', col: '#ff4f8b', k: 'acid' },
  lemon: { t: '檸檬汁', e: '🍋', col: '#ff4f8b', k: 'acid' },
  water: { t: '清水', e: '💧', col: '#7b4fc4', k: 'neu' },
  sugar: { t: '糖水', e: '🍬', col: '#7b4fc4', k: 'neu' },
  salt: { t: '鹽水', e: '🧂', col: '#7b4fc4', k: 'neu' },
  soda: { t: '小蘇打水', e: '🥄', col: '#2fa7a0', k: 'base' },
  soap: { t: '肥皂水', e: '🧼', col: '#3cbf5a', k: 'base' }
};
G.tubeSVG = function (col) {
  return '<svg viewBox="0 0 60 110"><path d="M14 6 L14 92 Q14 104 30 104 Q46 104 46 92 L46 6" fill="rgba(255,255,255,.15)" stroke="#dfe6ff" stroke-width="3"/>' +
    '<path d="M16 40 L16 92 Q16 102 30 102 Q44 102 44 92 L44 40Z" fill="' + col + '" style="transition:fill .8s"/></svg>';
};
G.types.cabbage = function (lv, area, api) {
  var demo = ['vinegar', 'water', 'soda'], tried = 0;
  area.innerHTML = '<div class="panel sim"><div class="mission">每支試管都裝了<b>紫色高麗菜汁</b>。點一下試管，把上面的液體倒進去，看看顏色有沒有改變！</div>' +
    '<div class="tubes">' + demo.map(function (id) {
      var L = G.LIQ[id];
      return '<button class="tube" data-id="' + id + '"><div style="font-size:26px">' + L.e + '</div>' + L.t + G.tubeSVG('#7b4fc4') + '<div class="res">點我倒入</div></button>';
    }).join('') + '</div><div class="row"><button class="btn go" disabled>看懂了，換我來預測 ➜</button></div></div>';
  area.querySelectorAll('.tube').forEach(function (b) {
    b.onclick = function () {
      if (b.classList.contains('done')) return;
      var L = G.LIQ[b.dataset.id];
      b.classList.add('done'); G.sfx.ok();
      G.$('path:last-child', b).setAttribute('fill', L.col);
      G.$('.res', b).innerHTML = L.k === 'acid' ? '變成<b>紅色</b>！' : L.k === 'base' ? '變成<b>藍綠色</b>！' : '還是<b>紫色</b>';
      tried++;
      if (tried === demo.length) { var g = G.$('.go', area); g.disabled = false; G.bump(g, 'pop'); G.toast('白醋是<b>酸性</b>、小蘇打水是<b>鹼性</b>、清水是<b>中性</b>。', 3200); }
    };
  });
  G.$('.go', area).onclick = function () {
    G.types.combo({
      steps: [
        {
          type: 'sort',
          bins: [
            { k: 'acid', t: '變紅色（酸性）', e: '🔴', c: '#ff4f8b' },
            { k: 'neu', t: '還是紫色（中性）', e: '🟣', c: '#a07be0' },
            { k: 'base', t: '變藍綠色（鹼性）', e: '🟢', c: '#2fa7a0' }
          ],
          items: ['lemon', 'sugar', 'salt', 'soap', 'vinegar', 'soda'].map(function (id) {
            var L = G.LIQ[id];
            return { t: L.t, e: L.e, k: L.k, hint: L.k === 'acid' ? '嚐起來酸酸的喔！' : L.k === 'base' ? '摸起來滑滑的，和小蘇打水同一類。' : '和清水一樣，不會讓菜汁變色。' };
          })
        },
        { type: 'quiz', qs: lv.qs }
      ]
    }, area, api);
  };
};

G.units.push({
  id: 'u4', no: '四', name: '廚房中的科學', e: '🧪', c: '#c792ff',
  sub: '認識廚房裡的材料・物質能溶解的量・菜汁變色了',
  levels: [
    {
      name: '砂糖溶解實驗', kind: 'op', type: 'sugarlab', th: [0, 1],
      inst: '一杯水可以溶解無限多的糖嗎？改變水量和水溫做實驗，記錄每杯最多溶解幾匙糖。',
      recap: '一定量的水能溶解的砂糖是<b>有限的</b>，溶解不了的會沉在杯底。<b>增加水量</b>或<b>提高水溫</b>，都能溶解更多砂糖。（遊戲裡的匙數是模擬，用來比較多少。）',
      qs: [
        { q: '看你的紀錄：哪一杯溶解的糖最多？', opts: ['溫水 200 mL', '冷水 100 mL', '冷水 200 mL', '溫水 100 mL'], a: 0, why: '水量最多、水溫又比較高的那杯，溶解的糖最多。' },
        { q: '水溫一樣時，水量變多，能溶解的糖會怎樣？', opts: ['變多', '變少', '不變', '完全不能溶解'], a: 0, why: '水量增加，能溶解的砂糖也變多。' },
        { q: '水量一樣時，提高水溫，能溶解的糖會怎樣？', opts: ['變多', '變少', '不變', '糖會消失不見'], a: 0, why: '提高水溫，能溶解的砂糖變多。' },
        { q: '一直加糖，杯底出現沉澱，表示什麼？', big: '🥛', opts: ['這杯水已經不能再溶解更多糖了', '糖變成了鹽', '水變少了一半', '糖全部溶解了'], a: 0, why: '砂糖能溶解的量是有限的，超過的糖會沉在杯底。' }
      ]
    },
    {
      name: '溶解了嗎？', kind: 'idea', type: 'combo', th: [1, 3],
      inst: '廚房裡的材料放進水裡攪拌，哪些會完全溶解？先分類，再回答溶解的問題。',
      recap: '物質放進水中，散開到<b>看不見顆粒</b>、均勻分布在水中，就是<b>溶解</b>。砂糖、食鹽會完全溶解；麵粉、沙子、胡椒粉不會完全溶解。',
      steps: [
        {
          type: 'sort',
          bins: [
            { k: 'yes', t: '會完全溶解', e: '✨', c: '#4fe0ff' },
            { k: 'no', t: '不會完全溶解', e: '🌫️', c: '#ff8a65' }
          ],
          items: [
            { t: '砂糖', e: '🍬', k: 'yes' },
            { t: '食鹽', e: '🧂', k: 'yes' },
            { t: '冰糖', e: '💎', k: 'yes', hint: '冰糖溶解得比較慢，但攪拌久一點會完全溶解。' },
            { t: '黑糖', e: '🟫', k: 'yes' },
            { t: '麵粉', e: '🌾', k: 'no', why: '麵粉會讓水變混濁，靜置後沉在杯底。' },
            { t: '沙子', e: '🏖️', k: 'no' },
            { t: '胡椒粉', e: '🌶️', k: 'no' },
            { t: '太白粉', e: '🥣', k: 'no', hint: '攪拌後水變白白混濁，放久會沉到杯底。' },
            { t: '沙拉油', e: '🛢️', k: 'no', why: '油會浮在水面上，不會溶解。' }
          ]
        },
        {
          type: 'quiz',
          qs: [
            { q: '下面哪一個是「溶解」的樣子？', opts: ['物質散開到看不見顆粒，均勻分布在水中', '物質沉在杯底', '物質浮在水面上', '水變得很混濁'], a: 0, why: '溶解後看不見顆粒，而且均勻分布在水中。' },
            { q: '糖溶解在水裡看不見了，糖還在嗎？', big: '🍬💧', opts: ['還在，喝起來甜甜的', '不見了，消失了', '變成水了', '跑到空氣中了'], a: 0, why: '糖還在水裡，只是散得很細看不見，所以喝起來是甜的。' },
            { q: '想讓糖溶解得快一點，可以怎麼做？', opts: ['用湯匙攪拌', '把杯子放著不動', '把糖放在杯子外面', '把水倒掉'], a: 0, why: '攪拌可以讓糖溶解得比較快。' },
            { q: '下面哪一件事<b>不是</b>生活中應用溶解的例子？', opts: ['把米煮成飯', '用水泡奶粉', '煮湯時加鹽', '用水沖泡果汁粉'], a: 0, why: '泡奶粉、湯裡加鹽、沖果汁粉都是溶解；煮飯不是。' }
          ]
        }
      ]
    },
    {
      name: '菜汁變色魔法', kind: 'boss', type: 'cabbage', th: [1, 3],
      inst: '紫色高麗菜汁會變魔術！先做 3 個示範實驗，再預測其他液體會讓菜汁變成什麼顏色。',
      recap: '紫色高麗菜汁遇到<b>酸性</b>物質（白醋、檸檬汁）變<b>紅色</b>，遇到<b>鹼性</b>物質（小蘇打水、肥皂水）變<b>藍綠色</b>；清水、糖水、鹽水是<b>中性</b>，顏色不變。',
      qs: [
        { q: '紫色高麗菜汁加入白醋變成紅色，表示白醋是什麼性質？', opts: ['酸性', '鹼性', '中性', '沒有性質'], a: 0, why: '紫色高麗菜汁遇到酸性物質會變紅色。' },
        { q: '紫色高麗菜汁可以用來做什麼？', big: '🥬🧪', opts: ['檢驗物質是酸性、中性或鹼性', '量溫度', '量雨量', '讓水沸騰'], a: 0, why: '紫色高麗菜汁遇到酸性、鹼性物質會變色，可以用來檢驗。' },
        { q: '為了安全，做菜汁變色實驗時哪一個做法<b>不對</b>？', opts: ['把每一杯液體都喝喝看', '用滴管小心滴入', '做完把器材洗乾淨', '不知道是什麼的液體先問老師'], a: 0, why: '實驗用的液體不可以隨便喝。' }
      ]
    }
  ]
});
