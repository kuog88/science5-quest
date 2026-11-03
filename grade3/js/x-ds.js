/* 三版本補充單元：溶解與物質的辨別（康軒三上「廚房裡的科學」活動 1、2；翰林三上「奇妙的溶解」）
   砂糖溶解實驗、溶解了嗎？由三下「廚房中的科學」搬來，改成三上探險島的明亮畫面；廚房材料偵探是新做的關卡 */

/* 砂糖溶解實驗（模擬）：水量加倍、水溫提高，能溶解的糖都會變多 */
G.SUGAR_CAP = { 'c100': 5, 'c200': 10, 'w100': 7, 'w200': 14 };
G.cupSVG = function (ml, warm, spoons, cap) {
  var h = ml === 200 ? 150 : 80, top = 220 - h, extra = Math.max(0, spoons - cap);
  var tint = Math.min(spoons, cap) / 14;
  var pile = '';
  for (var i = 0; i < extra; i++) {
    var row = Math.floor(i / 4), col = i % 4;
    pile += '<ellipse cx="' + (95 + col * 17 + (row % 2) * 8) + '" cy="' + (214 - row * 7) + '" rx="11" ry="5" fill="#fffef5" stroke="#c9b98a"/>';
  }
  var steam = warm ? '<g stroke="#ff9a4d" stroke-width="3" fill="none" opacity=".6"><path d="M105 ' + (top - 10) + ' q-6 -10 0 -20"/><path d="M135 ' + (top - 10) + ' q6 -10 0 -20"/></g>' : '';
  return '<svg viewBox="0 0 240 240" style="max-width:240px">' + steam +
    '<rect x="72" y="' + top + '" width="96" height="' + h + '" fill="' + (warm ? '#ffb38a' : '#7fd0ff') + '" opacity="' + (0.55 + tint * 0.3).toFixed(2) + '"/>' + pile +
    '<path d="M70 50 L70 220 Q70 226 76 226 L164 226 Q170 226 170 220 L170 50" fill="none" stroke="#7a8a9a" stroke-width="4"/>' +
    '<text x="176" y="' + (top + 5) + '" font-size="13" fill="#36423a">' + ml + 'mL</text></svg>';
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

G.units.push({
  id: 'ds', no: '', name: '溶解與物質的辨別', e: '🥄', c: '#b07be6',
  sub: '分辨廚房裡的材料・物質在水中溶解・溶解的應用',
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
            { k: 'yes', t: '會完全溶解', e: '✨', c: '#4aa8ff' },
            { k: 'no', t: '不會完全溶解', e: '🌫️', c: '#ff9a4d' }
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
      name: '廚房材料偵探', kind: 'boss', type: 'combo', th: [1, 3],
      inst: '廚房裡有好多白白的粉末和顆粒！先用安全的方法觀察、分辨它們，再找出生活中利用溶解的例子。',
      recap: '分辨物質可以用<b>眼睛看</b>（顏色、形狀、大小）、<b>手摸</b>、<b>用手搧聞</b>，還可以放進水裡看<b>能不能溶解</b>。不知道是什麼的物質<b>不可以放進嘴裡嚐</b>。生活中調味（糖、鹽溶在湯和飲料裡）和清潔（清潔劑溶在水裡）都用到溶解。',
      steps: [
        {
          type: 'quiz', pick: 5, qs: [
            { q: '桌上有一小碟不知道是什麼的白色粉末，下面哪一個做法<b>不安全</b>？', big: '🥄❓', opts: ['用舌頭舔一口嚐嚐看', '用眼睛仔細看顏色和形狀', '戴手套或用乾淨的手摸摸看', '用手把氣味搧到鼻子前聞'], a: 0, why: '不知道是什麼的物質，不可以放進嘴裡嚐，以免傷害身體。' },
            { q: '聞物質的氣味時，正確的方法是？', big: '👃', opts: ['用手在上方輕輕搧，讓氣味飄到鼻子前', '鼻子貼近容器用力吸', '把粉末倒在手上直接聞', '對著粉末吹氣再聞'], a: 0, why: '用手搧聞比較安全，不會一下子吸入太多。' },
            { q: '食鹽和細沙看起來都是小顆粒，用哪一個方法最容易把它們分辨出來？', big: '🧂🏖️', opts: ['各放進一杯水攪拌，看會不會溶解', '比比看哪一包比較大', '把它們混在一起', '放在太陽下曬'], a: 0, why: '食鹽會溶解在水中，細沙不會溶解。' },
            { q: '砂糖和二砂（黃褐色的糖）最容易從哪一點看出不同？', big: '🍬🟨', opts: ['顏色', '會不會溶解', '能不能吃', '摸起來都是硬的'], a: 0, why: '砂糖是白色，二砂是黃褐色，用眼睛看顏色就能分辨。' },
            { q: '麵粉和砂糖分別放進水裡攪拌，會看到什麼？', big: '🌾🍬', opts: ['砂糖水是透明的，麵粉水變混濁', '兩杯都變透明', '兩杯都變混濁', '麵粉水是透明的，砂糖水變混濁'], a: 0, why: '砂糖會溶解，水還是透明；麵粉不會溶解，水變混濁。' },
            { q: '外觀很像的兩種白色顆粒，下面哪一句話正確？', opts: ['只用眼睛看不一定分得出來，還要用其他方法比較', '看起來一樣就一定是同一種東西', '只要聞一聞就一定分得出來', '白色的東西都會溶解在水裡'], a: 0, why: '外觀相似的物質，要再用摸、聞、溶解等方法比較。' }
          ]
        },
        {
          type: 'sort',
          bins: [
            { k: 'eat', t: '飲食調味用到溶解', e: '🍲', c: '#ff9a4d' },
            { k: 'clean', t: '清潔用到溶解', e: '🫧', c: '#4aa8ff' },
            { k: 'no', t: '沒有用到溶解', e: '🚫', c: '#7a8a7f' }
          ],
          items: [
            { t: '煮湯時加鹽', e: '🍲', k: 'eat' },
            { t: '泡一杯糖水', e: '🥤', k: 'eat' },
            { t: '用熱水沖泡奶粉', e: '🍼', k: 'eat' },
            { t: '洗衣粉加水洗衣服', e: '👕', k: 'clean' },
            { t: '洗碗精加水洗碗', e: '🍽️', k: 'clean' },
            { t: '把木頭鋸成兩半', e: '🪚', k: 'no', why: '鋸木頭只是改變形狀，沒有溶解。' },
            { t: '用剪刀剪紙', e: '✂️', k: 'no' }
          ]
        }
      ]
    }
  ]
});
