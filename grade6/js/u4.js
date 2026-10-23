/* 單元四 奇妙的電磁世界 */

/* 指北針（程式畫的 SVG）：deg 為指針紅色 N 端的方向，0 = 朝上 */
G.compassSVG = function (X, Y, deg, r) {
  r = r || 26;
  return '<g transform="translate(' + X + ' ' + Y + ')"><circle r="' + r + '" fill="#fff" stroke="#546e7a" stroke-width="3"/>' +
    '<g transform="rotate(' + deg + ')"><path d="M0 ' + (-r + 5) + ' L6 0 H-6Z" fill="#e53935"/><path d="M0 ' + (r - 5) + ' L6 0 H-6Z" fill="#90a4ae"/></g>' +
    '<circle r="3" fill="#37474f"/></g>';
};

/* 電磁鐵實驗室 */
G.types.emlab = function (lv, area, api) {
  var st = { on: 0, batt: 1, coil: 20, core: 1, dir: 1 };
  area.innerHTML = '<div class="panel sim"><svg viewBox="0 0 400 230"></svg><div class="readout"></div><div class="msg"></div>' +
    '<div class="ctl"><div><button class="seg" data-g="on" data-k="1">⚡ 接通電源</button><button class="seg" data-g="on" data-k="0">⭕ 切斷電源</button></div>' +
    '<div><b>🔋 電池（串聯）：</b>' + [1, 2, 3].map(function (n) { return '<button class="seg" data-g="batt" data-k="' + n + '">' + n + ' 顆</button>'; }).join('') + '</div>' +
    '<div><b>🌀 線圈：</b>' + [20, 40, 60].map(function (n) { return '<button class="seg" data-g="coil" data-k="' + n + '">' + n + ' 圈</button>'; }).join('') + '</div>' +
    '<div><b>🔩 鐵芯：</b><button class="seg" data-g="core" data-k="1">放入鐵棒</button><button class="seg" data-g="core" data-k="0">拿掉鐵棒</button>' +
    '<b style="margin-left:8px">↔️ 電流：</b><button class="seg" data-g="dir" data-k="1">正接</button><button class="seg" data-g="dir" data-k="-1">反接</button></div></div>' +
    '<ul class="tasks"></ul><div class="row"><button class="btn go" disabled>實驗完成，下一步 ➜</button></div></div>';
  var svg = G.$('svg', area), msg = G.$('.msg', area);
  var mark = G.labTasks(area, [
    { k: 'on', t: '接通電源，吸吸看迴紋針' },
    { k: 'batt', t: '增加串聯的電池數量' },
    { k: 'coil', t: '增加線圈的圈數' },
    { k: 'core', t: '拿掉鐵棒，比較磁力' },
    { k: 'dir', t: '把電池反接，看指北針' },
    { k: 'off', t: '切斷電源，迴紋針會怎樣？' }
  ], function () { G.thenQuiz(lv, area, api, '實驗結果記下來了嗎？來回答問題！'); });
  function clips() { return st.on ? Math.round(st.batt * (st.coil / 20) * (st.core ? 2 : 0.5)) : 0; }
  function draw() {
    var n = clips(), s = '';
    for (var i = 0; i < Math.min(n, 18); i++) s += '<text x="' + (126 + (i % 9) * 18) + '" y="' + (150 + Math.floor(i / 9) * 22) + '" font-size="18">📎</text>';
    var loops = st.coil / 4, coil = '';
    for (var j = 0; j < loops; j++) { var x = 120 + j * (160 / loops); coil += '<ellipse cx="' + x + '" cy="100" rx="5" ry="22" fill="none" stroke="#bf360c" stroke-width="3"/>'; }
    /* 指北針放在右端：正接右端是 N 極，指北針 S 端（灰）被吸過來，紅 N 端朝右外側 */
    var deg = st.on ? (st.dir > 0 ? 90 : -90) : 0;
    svg.innerHTML = '<rect width="400" height="230" rx="14" fill="#f5f9ff"/>' +
      (st.core ? '<rect x="110" y="90" width="180" height="20" rx="4" fill="#90a4ae"/>' : '<rect x="110" y="92" width="180" height="16" rx="4" fill="#fff8e1" stroke="#d7ccc8"/><text x="200" y="104" font-size="11" text-anchor="middle" fill="#a1887f">吸管（沒有鐵芯）</text>') +
      coil +
      '<path d="M120 78 V30 H160" fill="none" stroke="#e53935" stroke-width="3"/><path d="M280 78 V30 H240" fill="none" stroke="#1e88e5" stroke-width="3"/>' +
      Array.apply(null, Array(st.batt)).map(function (_, k) { var bx = 160 + k * (80 / st.batt); return '<rect x="' + bx + '" y="20" width="' + (80 / st.batt - 4) + '" height="20" rx="3" fill="#ffb300" stroke="#6d4c41" stroke-width="2"/>'; }).join('') +
      (st.on ? '<text x="200" y="64" font-size="14" text-anchor="middle" fill="#ff6f00">⚡ 通電中</text>' : '<text x="200" y="64" font-size="14" text-anchor="middle" fill="#90a4ae">未通電</text>') +
      s + (st.on ? '' : '<text x="200" y="210" font-size="16" text-anchor="middle">📎📎📎 （掉在桌上）</text>') +
      G.compassSVG(340, 100, deg) + '<text x="340" y="146" font-size="13" text-anchor="middle" fill="#546e7a">指北針</text>';
    G.$('.readout', area).innerHTML = '<span>🔋 ' + st.batt + ' 顆</span><span>🌀 ' + st.coil + ' 圈</span><span>' + (st.core ? '🔩 有鐵芯' : '🥤 無鐵芯') + '</span><span>📎 吸起 <b>' + n + '</b> 根</span>';
    msg.innerHTML = !st.on ? '沒通電時，線圈沒有磁性，迴紋針都掉下來了。' :
      '通電的線圈變成<b>電磁鐵</b>，吸起 ' + n + ' 根迴紋針！指北針' + (st.dir > 0 ? '紅色 N 端轉向右邊' : '紅色 N 端轉向左邊（反過來了）') + '。';
    area.querySelectorAll('.seg').forEach(function (b) { b.classList.toggle('on', String(st[b.dataset.g]) === b.dataset.k); });
  }
  area.querySelectorAll('.seg').forEach(function (b) {
    b.onclick = function () {
      var g = b.dataset.g, v = +b.dataset.k, old = st[g];
      st[g] = v; draw();
      if (g === 'on') { if (v && clips()) mark('on'); if (!v && old) mark('off'); return; }
      if (!st.on) { G.toast('先「接通電源」才看得到變化喔！'); return; }
      if (g === 'batt' && v > old) mark('batt');
      if (g === 'coil' && v > old) mark('coil');
      if (g === 'core' && !v && old) mark('core');
      if (g === 'dir' && v !== old) mark('dir');
    };
  });
  draw();
};

G.units.push({
  id: 'u4', no: '四', name: '奇妙的電磁世界', e: '🧲', c: '#5c6bc0',
  sub: '指北針與地磁・神奇的電磁鐵',
  levels: [
    {
      name: '電磁鐵實驗室', kind: 'op', type: 'emlab', pick: 4, th: [0, 1],
      inst: '把漆包線繞在鐵棒上，接上電池就變成電磁鐵！改變電池、線圈、鐵芯和電流方向，完成六個實驗。',
      recap: '<b>通電</b>的線圈才有磁性（電磁鐵），斷電磁性就消失。<b>串聯電池越多（電流越大）、線圈圈數越多、放入鐵芯</b>，磁力越強。<b>改變電流方向</b>，電磁鐵的 N、S 極就會對調。',
      qs: [
        { q: '電磁鐵和一般磁鐵最大的不同是什麼？', big: '🧲⚡', opts: ['通電才有磁性，斷電磁性就消失', '電磁鐵永遠都有磁性', '電磁鐵只能吸塑膠', '電磁鐵沒有 N、S 極'], a: 0, why: '電磁鐵通電時才有磁性，可以用開關控制。' },
        { q: '想讓電磁鐵吸起更多迴紋針，可以怎麼做？', opts: ['增加串聯的電池或線圈圈數', '把鐵棒拿掉', '把電池反接', '減少線圈圈數'], a: 0, why: '電流越大、線圈越多，磁力越強；放入鐵芯也會更強。' },
        { q: '把電池的正負極反過來接，電磁鐵會怎樣？', opts: ['N 極和 S 極對調', '磁力變成兩倍', '磁性完全消失', '電池會爆炸'], a: 0, why: '改變電流方向，電磁鐵的磁極方向就會相反。' },
        { q: '實驗「線圈圈數對磁力的影響」時，哪一項要改變？', opts: ['線圈的圈數', '電池的數量', '鐵棒的大小', '迴紋針的種類'], a: 0, why: '要探討的變因只改變一個（圈數），其他條件都要保持相同。' },
        { q: '用電磁鐵吸迴紋針，結果是用什麼來比較磁力大小？', opts: ['吸起迴紋針的數量', '電線的顏色', '電池的品牌', '鐵棒的長短'], a: 0, why: '吸起的迴紋針越多，表示磁力越強，這是我們觀察的結果。' }
      ]
    },
    {
      name: '指北針與地磁', kind: 'idea', type: 'quiz', pick: 8, th: [0, 2],
      inst: '指北針為什麼總是指向北方？磁鐵和通電的電線又會讓指北針怎樣？一起來想一想！',
      recap: '<b>地球像一個大磁鐵</b>，指北針的 N 極會指向<b>地理北方</b>（那裡附近是地磁的 S 極）。磁鐵、鐵製品或<b>通電的電線</b>靠近指北針，會讓指針<b>偏轉</b>。丹麥科學家<b>奧斯特</b>最早發現電流能產生磁力。',
      qs: [
        { q: '指北針的指針靜止時，紅色 N 極會指向哪裡？', big: G.compassSVG(40, 40, 0, 30).replace('<g', '<svg viewBox="0 0 80 80" width="90"><g') + '</svg>', opts: ['北方', '南方', '東方', '隨便亂指'], a: 0, why: '指北針的 N 極會指向北方，所以叫做指北針。' },
        { q: '指北針為什麼會固定指向南北方向？', opts: ['地球本身有磁場，像一個大磁鐵', '因為北方比較冷', '因為太陽的吸引', '因為指針比較重的一端朝北'], a: 0, why: '指北針的磁針和地球的磁場互相作用，所以會指向南北。' },
        { q: '指北針的 N 極指向北方，表示地球北方附近是磁鐵的哪一極？', opts: ['S 極', 'N 極', '沒有磁極', '電極'], a: 0, why: '異極相吸！N 極被吸向北方，所以地理北極附近是地磁的 S 極。' },
        { q: '把磁鐵的 N 極靠近指北針，指北針會怎樣？', opts: ['指針的 S 端轉過來靠近磁鐵', '指針的 N 端轉過來靠近', '完全不會動', '指北針會壞掉'], a: 0, why: '同極相斥、異極相吸，所以指北針的 S 端會被吸過來。' },
        { q: '使用指北針時，為什麼要遠離鐵製品和電器？', opts: ['它們會讓指針偏轉，方位就不準了', '它們會把指北針弄髒', '指北針會吸走電', '沒有任何原因'], a: 0, why: '鐵製品、磁鐵和通電的電器都會影響指北針的指向。' },
        { q: '把通電的電線放在指北針上方，會發生什麼事？', opts: ['指北針的指針會偏轉', '電線會變成冰', '指北針會發光', '什麼事也沒有'], a: 0, why: '電流會產生磁力，使附近的指北針偏轉。' },
        { q: '最早發現「電流可以讓指北針偏轉」的科學家是誰？', opts: ['奧斯特', '愛迪生', '牛頓', '達爾文'], a: 0, why: '1820 年丹麥科學家奧斯特在上課時發現這個現象，開啟了電磁學。' },
        { q: '電線通電時，若把電流方向反過來，指北針會怎樣？', opts: ['偏轉方向跟著相反', '偏轉方向不變', '不再偏轉', '指針會掉下來'], a: 0, why: '電流方向改變，產生的磁力方向也改變，指北針就往相反方向偏轉。' },
        { q: '登山迷路時，指北針可以幫我們做什麼？', opts: ['判斷方位', '測量溫度', '量山的高度', '預報天氣'], a: 0, why: '指北針可以找出北方，再推出東、西、南方，幫助判斷方向。' }
      ]
    },
    {
      name: '電磁發明大挑戰', kind: 'boss', type: 'combo', th: [1, 3],
      inst: '生活中哪些東西用到電磁鐵？先分類，再挑戰實驗設計題！',
      recap: '需要<b>控制磁力開或關</b>的地方常用電磁鐵：廢鐵吊車、電鈴、喇叭、馬達、磁浮列車等。冰箱貼、指北針用的是永久磁鐵。設計實驗時，<b>只改變一個變因</b>，其他條件保持相同，才能公平比較。',
      steps: [
        {
          type: 'sort',
          bins: [{ k: 'em', t: '用到電磁鐵', e: '⚡', c: '#5c6bc0' }, { k: 'pm', t: '用一般（永久）磁鐵', e: '🧲', c: '#ef5350' }],
          items: [
            { e: '🏗️', t: '吸廢鐵的起重機', k: 'em', why: '通電吸起廢鐵，斷電就放下來。' },
            { e: '🔔', t: '學校的電鈴', k: 'em' },
            { e: '🔊', t: '喇叭', k: 'em' },
            { e: '🚄', t: '磁浮列車', k: 'em' },
            { e: '🌀', t: '電風扇的馬達', k: 'em' },
            { e: '🧾', t: '冰箱上的磁鐵貼', k: 'pm' },
            { e: '🧭', t: '指北針的磁針', k: 'pm' },
            { e: '👜', t: '包包上的磁扣', k: 'pm' }
          ]
        },
        {
          type: 'quiz', pick: 4, qs: [
            { q: '小明想知道「電池數量會不會影響電磁鐵磁力」，哪一組比較方式最公平？', opts: ['線圈圈數、鐵芯都一樣，只改變電池數量', '電池和圈數一起增加', '每次換不同的鐵棒和電池', '只做一次就下結論'], a: 0, why: '一次只改變一個變因（電池數量），其他條件相同，才知道差別是誰造成的。' },
            { q: '為什麼廢鐵吊車要用電磁鐵，而不用普通磁鐵？', opts: ['斷電就能把廢鐵放下來', '電磁鐵比較便宜', '普通磁鐵吸不到鐵', '電磁鐵比較好看'], a: 0, why: '電磁鐵可以用開關控制磁性的有無，方便吸起和放下。' },
            { q: '同一個實驗為什麼要重複做好幾次？', opts: ['減少誤差，讓結果更可靠', '因為第一次一定錯', '讓電池用完', '浪費時間'], a: 0, why: '重複測試取多次結果比較，可以減少偶然的誤差。' },
            { q: '奧斯特發現「電流會產生磁力」，這個發現對生活最大的影響是？', opts: ['發明了馬達、電鈴、喇叭等電器', '發明了指北針', '發現了地球是圓的', '發明了望遠鏡'], a: 0, why: '電生磁的原理讓人類發明了馬達、電磁鐵等許多電器。' },
            { q: '用電磁鐵做實驗時，要注意哪件安全的事？', opts: ['不要長時間通電，線圈和電池會發燙', '可以直接接家裡的插座', '把電池丟進火裡', '用濕手操作比較好'], a: 0, why: '長時間通電，電線和電池會變熱；也絕對不可以接家用插座。' }
          ]
        }
      ]
    }
  ]
});
