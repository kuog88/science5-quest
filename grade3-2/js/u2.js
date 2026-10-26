/* 單元二 溫度與物質變化的關係 */

/* 溫度計 SVG：0～50°C，每 1 度一小格，每 10 度標數字 */
G.thermoSVG = function (temp) {
  var top = 20, bot = 270, pd = (bot - top) / 50, y = bot - temp * pd, t = '';
  for (var d = 0; d <= 50; d++) {
    var yy = (bot - d * pd).toFixed(1), w = d % 10 === 0 ? 18 : d % 5 === 0 ? 13 : 8;
    t += '<line x1="72" y1="' + yy + '" x2="' + (72 + w) + '" y2="' + yy + '" stroke="#333" stroke-width="' + (d % 10 === 0 ? 2 : 1) + '"/>';
    if (d % 10 === 0) t += '<text x="96" y="' + (+yy + 5) + '" font-size="15" font-weight="700" fill="#333">' + d + '</text>';
  }
  return '<svg viewBox="0 0 160 330" style="max-width:150px"><rect x="20" y="4" width="120" height="322" rx="16" fill="#f4f7ff" stroke="#8a93c9" stroke-width="2"/>' + t +
    '<rect x="56" y="14" width="12" height="268" rx="6" fill="#fff" stroke="#999"/>' +
    '<rect x="58" y="' + y.toFixed(1) + '" width="8" height="' + (bot - y + 18).toFixed(1) + '" fill="#e53935"/>' +
    '<circle cx="62" cy="296" r="15" fill="#e53935" stroke="#999"/><text x="96" y="310" font-size="14" fill="#555">°C</text></svg>';
};

/* 燒杯：依溫度顯示冰／水／沸騰 */
G.beakerSVG = function (t) {
  var st = t <= 0 ? 'ice' : t >= 100 ? 'boil' : 'water';
  var body = '';
  if (st === 'ice') {
    body = '<rect x="62" y="96" width="116" height="104" rx="8" fill="#d8f3ff" stroke="#9ad7f5" stroke-width="3"/>' +
      '<path d="M78 112 l18 10 M120 140 l22 -8 M90 170 l14 12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>';
  } else {
    body = '<rect x="57" y="96" width="126" height="108" fill="#4fb6ff" opacity=".85"/>';
    if (st === 'boil') {
      for (var i = 0; i < 9; i++) {
        var cx = 70 + i * 13, d = (i % 3) * .3;
        body += '<circle cx="' + cx + '" cy="196" r="' + (4 + i % 3) + '" fill="#e6f6ff"><animate attributeName="cy" values="200;100" dur="' + (0.9 + d) + 's" begin="' + d + 's" repeatCount="indefinite"/></circle>';
      }
      body += '<g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8">' +
        '<path d="M90 70 q-10 -15 0 -30 t0 -30"><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></path>' +
        '<path d="M150 70 q10 -15 0 -30 t0 -30"><animate attributeName="opacity" values=".2;1;.2" dur="1.6s" repeatCount="indefinite"/></path></g>';
    }
  }
  var flame = t > 40 ? '<path d="M120 268 q-18 -20 0 -44 q18 24 0 44z" fill="#ff9a3c"/><path d="M120 266 q-8 -10 0 -24 q8 14 0 24z" fill="#ffe14a"/>' : '';
  var frost = t <= 0 ? '<text x="196" y="60" font-size="30">❄️</text>' : '';
  return '<svg viewBox="0 0 240 280">' + frost +
    '<path d="M50 70 L50 206 Q50 216 60 216 L180 216 Q190 216 190 206 L190 70" fill="rgba(255,255,255,.12)" stroke="#dfe6ff" stroke-width="4"/>' + body +
    '<rect x="70" y="222" width="100" height="8" rx="3" fill="#8a93c9"/>' + flame + '</svg>';
};
G.waterState = function (t) { return t <= 0 ? 'ice' : t >= 100 ? 'boil' : 'water'; };

G.types.waterlab = function (lv, area, api) {
  var missions = [
    { want: 'ice', t: '任務 1：把燒杯裡的水變成<b>冰</b>（凝固）', ok: '水遇冷到 0°C 左右會<b>凝固</b>成冰！' },
    { want: 'water', t: '任務 2：讓冰塊<b>融化</b>成水', ok: '冰遇熱會<b>融化</b>成水！' },
    { want: 'boil', t: '任務 3：把水加熱到<b>沸騰</b>', ok: '水加熱到約 100°C 會<b>沸騰</b>，冒出大量氣泡，變成水蒸氣跑到空氣中！' }
  ];
  var m = 0, temp = 25;
  area.innerHTML = '<div class="panel sim"><div class="mission"></div>' +
    '<div class="simrow"><div class="simbox"><h3>🧪 燒杯</h3><div class="bk"></div></div>' +
    '<div class="simbox"><h3>🌡️ 溫度 <span class="tv"></span></h3><input class="slider" type="range" min="-10" max="110" step="1" aria-label="調整溫度">' +
    '<div class="seg"><button data-d="-10">❄️ 降溫 10 度</button><button data-d="10">🔥 加熱 10 度</button></div><div class="msg"></div></div></div>' +
    '<div class="row"><button class="btn chk">✅ 完成這個任務</button></div></div>';
  var sl = G.$('.slider', area);
  function draw() {
    G.$('.bk', area).innerHTML = G.beakerSVG(temp);
    G.$('.tv', area).textContent = temp + '°C';
    sl.value = temp;
    var st = G.waterState(temp);
    G.$('.msg', area).innerHTML = st === 'ice' ? '現在是<b>冰</b>' : st === 'boil' ? '水<b>沸騰</b>了！冒出大量氣泡' : temp >= 60 ? '水變熱了，表面冒出熱氣' : '現在是<b>水</b>';
  }
  function showMission() { G.$('.mission', area).innerHTML = missions[m].t; }
  sl.oninput = function () { temp = +sl.value; draw(); };
  area.querySelectorAll('.seg button').forEach(function (b) {
    b.onclick = function () { temp = Math.max(-10, Math.min(110, temp + +b.dataset.d)); G.sfx.tick(); draw(); };
  });
  G.$('.chk', area).onclick = function () {
    var M = missions[m];
    if (G.waterState(temp) === M.want) {
      G.sfx.ok(); G.toast('✅ ' + M.ok, 3000); m++;
      if (m < missions.length) showMission();
      else setTimeout(function () { thermoQuiz(); }, 900);
    } else {
      G.sfx.bad(); api.miss(); G.bump(G.$('.mission', area), 'shake');
      G.toast('還沒有喔！調整溫度再看看燒杯的變化。');
    }
  };
  function thermoQuiz() {
    var qs = [], used = {};
    while (qs.length < 3) {
      var v = 12 + Math.floor(Math.random() * 27);
      if (used[v]) continue; used[v] = 1;
      var wrong = [v + 2, v - 2, v + 5, v - 5, v + 10].filter(function (x) { return x > 0 && x < 50; });
      wrong = G.shuffle(wrong).slice(0, 3);
      qs.push({ q: '溫度計上紅色液柱的頂端在哪裡？讀出溫度。', big: G.thermoSVG(v), opts: [v + '°C'].concat(wrong.map(function (x) { return x + '°C'; })), a: 0, why: '液柱頂端對到 ' + v + '°C。每一小格是 1°C。' });
    }
    qs.push({ q: '讀溫度計的時候，眼睛要怎麼看？', big: '👀', opts: ['視線和液柱頂端保持水平', '從很高的地方往下看', '從很低的地方往上看', '閉上一隻眼睛隨便看'], a: 0, why: '眼睛要和液柱頂端在同一個高度，讀出來才準確。' });
    G.types.quiz({ qs: qs }, area, api);
  }
  showMission(); draw();
};

G.units.push({
  id: 'u2', no: '二', name: '溫度與物質變化的關係', e: '🌡️', c: '#ff8a65',
  sub: '物質變化的現象・溫度改變對水的影響・溫度改變對物質的影響',
  levels: [
    {
      name: '冰水蒸氣實驗室', kind: 'op', type: 'waterlab', th: [0, 2],
      inst: '拉動溫度滑桿或按按鈕，完成 3 個任務：讓水結冰、讓冰融化、讓水沸騰。再來練習讀溫度計！',
      recap: '溫度改變，水的樣子也會改變：<b>水 → 冰</b>叫凝固、<b>冰 → 水</b>叫融化、水加熱會變成看不見的<b>水蒸氣</b>。讀溫度計時視線要和液柱頂端水平。'
    },
    {
      name: '變得回來嗎？', kind: 'idea', type: 'combo', th: [1, 3],
      inst: '東西受熱或放久了會改變。哪些變化可以回復原狀，哪些不能？先分類，再回答問題。',
      recap: '冰、奶油、巧克力、蠟受熱融化後，冷卻又能<b>回復原狀</b>；紙燃燒、蛋煎熟、鐵生鏽、麵糰發酵烤成麵包，都<b>不能回復原狀</b>。',
      steps: [
        {
          type: 'sort',
          bins: [
            { k: 'yes', t: '可以回復原狀', e: '🔄', c: '#4fe0ff' },
            { k: 'no', t: '不能回復原狀', e: '🚫', c: '#ff6b81' }
          ],
          items: [
            { t: '冰塊融化成水', e: '🧊', k: 'yes', why: '水再放進冷凍庫，又會結成冰。' },
            { t: '奶油受熱融化', e: '🧈', k: 'yes', why: '冷卻後奶油又會變硬。' },
            { t: '巧克力融化', e: '🍫', k: 'yes', why: '放涼後巧克力又凝固了。' },
            { t: '蠟燭滴下的蠟油', e: '🕯️', k: 'yes', hint: '蠟油滴下來，放涼後變成什麼？' },
            { t: '紙燃燒變成灰', e: '📄', k: 'no', why: '灰不能再變回紙。' },
            { t: '生雞蛋煎熟', e: '🍳', k: 'no', why: '煎熟的蛋不能變回生蛋。' },
            { t: '吐司烤焦', e: '🍞', k: 'no' },
            { t: '鐵釘生鏽', e: '🔩', k: 'no', why: '鐵生鏽是變成了不同的物質。' },
            { t: '麵糰發酵烤成麵包', e: '🥐', k: 'no' },
            { t: '玉米粒爆成爆米花', e: '🍿', k: 'no', hint: '爆米花還能變回硬硬的玉米粒嗎？' }
          ]
        },
        {
          type: 'quiz',
          qs: [
            { q: '鐵釘放在哪裡，最容易生鏽？', big: '🔩', opts: ['潮溼的地方', '乾燥的盒子裡', '裝滿乾米的罐子', '冷凍庫的密封袋'], a: 0, why: '鐵碰到水和空氣容易生鏽，潮溼的地方最容易。' },
            { q: '麵糰放在哪裡，發酵得比較快？', big: '🍞', opts: ['溫暖的地方', '冷凍庫裡', '冰塊上面', '哪裡都一樣快'], a: 0, why: '溫度會影響發酵，溫暖的地方發酵比較快。' },
            { q: '冬天雙手互相搓一搓會變暖，是因為什麼讓溫度升高？', big: '🙌', opts: ['摩擦', '吹冷風', '喝冰水', '睡覺'], a: 0, why: '太陽照射、物質燃燒和摩擦，都可以使溫度升高。' }
          ]
        }
      ]
    },
    {
      name: '水的變身大挑戰', kind: 'boss', type: 'combo', th: [1, 3],
      inst: '生活中到處都有水的變身！先把每個現象放到「蒸發、凝結、凝固、融化」，再接受最後的考驗。',
      recap: '<b>蒸發</b>：水變成水蒸氣（衣服晾乾）；<b>凝結</b>：水蒸氣遇冷變成水（冰杯外的水珠）；<b>凝固</b>：水變成冰；<b>融化</b>：冰變成水。',
      steps: [
        {
          type: 'sort',
          bins: [
            { k: 'evap', t: '蒸發（水→水蒸氣）', e: '♨️', c: '#ff8a65' },
            { k: 'cond', t: '凝結（水蒸氣→水）', e: '💧', c: '#4fe0ff' },
            { k: 'frz', t: '凝固（水→冰）', e: '🧊', c: '#b5c7ff' },
            { k: 'melt', t: '融化（冰→水）', e: '🫗', c: '#ffd54a' }
          ],
          items: [
            { t: '溼衣服晾乾了', e: '👕', k: 'evap', why: '衣服上的水蒸發到空氣中了。' },
            { t: '雨後地上的水窪不見了', e: '🌤️', k: 'evap' },
            { t: '杯子裡的水放久變少了', e: '🥛', k: 'evap', hint: '水跑到哪裡去了？變成看不見的水蒸氣。' },
            { t: '冰飲料杯外面出現水珠', e: '🧋', k: 'cond', why: '空氣中的水蒸氣碰到冰冷的杯子，凝結成水珠。', hint: '水珠是從杯子裡漏出來的嗎？不是喔！' },
            { t: '煮湯時鍋蓋內側的水滴', e: '🍲', k: 'cond' },
            { t: '洗熱水澡後鏡子變霧霧的', e: '🪞', k: 'cond' },
            { t: '製冰盒的水變成冰塊', e: '🧊', k: 'frz' },
            { t: '果汁放冷凍庫變成冰棒', e: '🍡', k: 'frz' },
            { t: '冰淇淋在太陽下流下來', e: '🍦', k: 'melt' },
            { t: '冰塊放在桌上變成一灘水', e: '💦', k: 'melt' }
          ]
        },
        {
          type: 'quiz', pick: 5,
          qs: [
            { q: '水蒸氣用眼睛看得見嗎？', opts: ['看不見', '看得見，是白色的', '看得見，是藍色的', '只有晚上看得見'], a: 0, why: '水蒸氣是看不見的。' },
            { q: '燒開水時，壺口冒出的「白煙」其實是什麼？', big: '🫖', opts: ['水蒸氣遇冷凝結成的小水滴', '煙灰', '空氣變白了', '冰塊'], a: 0, why: '看不見的水蒸氣跑出壺口遇冷，凝結成很多小水滴，看起來像白煙。' },
            { q: '水沸騰的時候，會看到什麼？', opts: ['水裡冒出大量氣泡', '水變成冰', '水完全不會動', '水變成紅色'], a: 0, why: '水加熱到沸騰，會冒出大量氣泡。' },
            { q: '沒有加熱，水也會慢慢變成水蒸氣嗎？', opts: ['會，這叫蒸發', '不會，一定要煮沸', '只有冰會', '只有晚上會'], a: 0, why: '平常溫度下，水也會慢慢蒸發，例如晾衣服。' },
            { q: '同樣大小的冰塊，放在哪裡融化得最快？', big: '🧊', opts: ['溫水裡', '冷水裡', '冰箱冷藏室', '冷凍庫'], a: 0, why: '溫度越高，冰塊融化得越快。' },
            { q: '使用溫度計時，哪一個做法是<b>錯</b>的？', big: '🌡️', opts: ['拿溫度計當攪拌棒用力攪拌', '讀數時視線和液柱頂端水平', '測水溫時把感溫的地方放進水中', '等液柱不再移動再讀'], a: 0, why: '溫度計很容易破，不可以拿來攪拌。' }
          ]
        }
      ]
    }
  ]
});
