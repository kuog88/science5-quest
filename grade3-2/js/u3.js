/* 單元三 天氣特派員 */

/* 風向風力計（從上往下看）：彩帶飄向「風吹去的方向」 */
G.vaneSVG = function (to) {
  var ang = { 北: -90, 東: 0, 南: 90, 西: 180 }[to];
  return '<svg viewBox="0 0 240 240" style="max-width:240px">' +
    '<circle cx="120" cy="120" r="100" fill="#eaf6ff" stroke="#8a93c9" stroke-width="3"/>' +
    '<g font-size="22" font-weight="900" fill="#1b1f5c" text-anchor="middle"><text x="120" y="40">北</text><text x="120" y="218">南</text><text x="206" y="128">東</text><text x="34" y="128">西</text></g>' +
    '<path d="M120 28 v10 M120 202 v10 M28 120 h10 M202 120 h10" stroke="#8a93c9" stroke-width="3"/>' +
    '<g transform="rotate(' + ang + ' 120 120)"><path d="M120 113 q20 -12 38 0 t38 0 l0 14 q-19 -12 -38 0 t-38 0z" fill="#ff5fa8" stroke="#b0306e" stroke-width="2"/></g>' +
    '<circle cx="120" cy="120" r="9" fill="#5a4636"/></svg>';
};
/* 從側面看彩帶飄起的角度 */
G.ribbonSVG = function (deg) {
  return '<svg viewBox="0 0 140 130"><rect x="0" y="118" width="140" height="12" fill="#6fbf73"/><rect x="30" y="10" width="6" height="110" fill="#8d6e63"/>' +
    '<g transform="rotate(' + (-deg) + ' 36 16)"><path d="M36 14 q4 22 0 44 q4 22 0 40 l8 0 q-4 -20 0 -40 q-4 -22 0 -44z" fill="#ff5fa8"/></g></svg>';
};
G.windQs = function () {
  var opp = { 北: '南', 南: '北', 東: '西', 西: '東' };
  return ['北', '東', '南', '西'].map(function (from) {
    var others = ['北風', '東風', '南風', '西風'].filter(function (x) { return x !== from + '風'; });
    return {
      q: '從上面往下看，彩帶飄向<b>' + opp[from] + '方</b>。現在吹的是什麼風？', big: G.vaneSVG(opp[from]),
      opts: [from + '風'].concat(others), a: 0,
      why: '風從' + from + '方吹過來，彩帶就被吹向' + opp[from] + '方。風從哪裡吹來，就叫做什麼風，所以是' + from + '風。'
    };
  });
};

/* 一天的氣溫折線圖 */
G.tempData = [[6, 19], [8, 21], [10, 24], [12, 27], [14, 28], [16, 26], [18, 23]];
G.tempChartSVG = function () {
  var x0 = 50, y0 = 200, sx = 40, sy = 12, base = 16, d = G.tempData;
  var g = '';
  for (var v = 16; v <= 30; v += 2) {
    var y = y0 - (v - base) * sy;
    g += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + 6 * sx + 20) + '" y2="' + y + '" stroke="#d6dbf5"/><text x="' + (x0 - 8) + '" y="' + (y + 5) + '" font-size="13" text-anchor="end" fill="#333">' + v + '</text>';
  }
  var pts = d.map(function (p, i) { return [x0 + 10 + i * sx, y0 - (p[1] - base) * sy]; });
  return '<svg viewBox="0 0 340 250" style="max-width:420px"><rect width="340" height="250" rx="12" fill="#fff"/>' + g +
    '<polyline points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="none" stroke="#e53935" stroke-width="3"/>' +
    pts.map(function (p, i) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#e53935"/><text x="' + p[0] + '" y="222" font-size="13" text-anchor="middle" fill="#333">' + d[i][0] + '時</text>'; }).join('') +
    '<text x="12" y="22" font-size="13" fill="#333">氣溫(°C)</text><text x="170" y="244" font-size="13" text-anchor="middle" fill="#333">時間</text></svg>';
};

G.units.push({
  id: 'u3', no: '三', name: '天氣特派員', e: '⛅', c: '#7fb8ff',
  sub: '認識天氣與天氣資訊・測量與記錄天氣・天氣變化與生活',
  levels: [
    {
      name: '風向風力觀測', kind: 'op', type: 'combo', th: [1, 3],
      inst: '你是天氣特派員！先看風向風力計的彩帶判斷風向，再把風力由弱到強排好。',
      recap: '<b>風從哪裡吹來，就叫什麼風</b>：彩帶飄向南方，表示風從北方吹來，是北風。彩帶飄得越高（越接近水平），風力越強。',
      steps: [
        { type: 'quiz', qs: G.windQs() },
        {
          type: 'order',
          rounds: [{
            prompt: '從側面看彩帶。依照<b>風力由弱到強</b>的順序點一點。',
            items: [
              { t: '彩帶垂下來', svg: G.ribbonSVG(0) },
              { t: '彩帶微微飄起', svg: G.ribbonSVG(30) },
              { t: '彩帶斜斜飄起', svg: G.ribbonSVG(60) },
              { t: '彩帶幾乎水平', svg: G.ribbonSVG(88) }
            ],
            why: '風越強，彩帶被吹得越高。'
          }]
        }
      ]
    },
    {
      name: '看懂天氣資訊', kind: 'idea', type: 'quiz', pick: 8, th: [0, 2],
      inst: '天氣預報、雲量、雨量和氣溫，你都看得懂嗎？回答 8 題。',
      recap: '可以從氣象署網站或 App、電視、廣播查天氣預報。雲幾乎遮滿天空是<b>陰天</b>；用<b>雨量筒</b>量雨量，單位是<b>毫米</b>；測氣溫要在通風、不被陽光直接照射的地方。',
      qs: [
        { q: '看這張預報卡，明天出門最好帶什麼？', big: '<div class="packet"><div class="pt">📺 明天天氣</div>天氣：🌧️ 短暫雨<br>降雨機率：<b>80%</b><br>氣溫：<b>21～25°C</b></div>', opts: ['雨傘', '溜冰鞋', '厚羽絨衣和手套', '游泳圈'], a: 0, why: '降雨機率 80%，下雨的可能性很高，要帶雨具。' },
        { q: '「降雨機率 10%」是什麼意思？', opts: ['下雨的可能性很低', '一定會下雨', '會下 10 毫米的雨', '只會下 10 分鐘'], a: 0, why: '降雨機率是下雨的可能性，10% 表示不太會下雨。' },
        { q: '預報說明天氣溫 12～16°C，應該怎麼穿？', big: '🌡️', opts: ['多穿一件外套保暖', '只穿短袖短褲', '穿泳衣', '不用注意'], a: 0, why: '氣溫低，要穿暖和一點。' },
        { q: '天空幾乎被雲遮滿，看不到太陽，這是什麼天氣？', big: '☁️☁️☁️', opts: ['陰天', '晴天', '多雲', '下雪'], a: 0, why: '雲量越多，天空越陰暗；雲幾乎遮滿天空時是陰天。' },
        { q: '天空只有一點點雲，太陽很大，這是什麼天氣？', big: '☀️', opts: ['晴天', '陰天', '雨天', '颱風天'], a: 0, why: '雲量很少的時候是晴天。' },
        { q: '天上的雲越來越多、越來越黑，接下來可能會怎樣？', big: '🌥️', opts: ['可能會下雨', '一定會出大太陽', '一定會下雪', '天氣不會改變'], a: 0, why: '雲量變多、雲變黑，常常是快要下雨的訊號。' },
        { q: '測量雨量要用什麼工具？', opts: ['雨量筒', '溫度計', '量角器', '放大鏡'], a: 0, why: '雨量筒可以收集雨水，量出雨量。' },
        { q: '雨量的單位是什麼？', opts: ['毫米', '公斤', '度', '公升'], a: 0, why: '雨量的單位用毫米（mm）。' },
        { q: '雨量筒應該放在哪裡？', big: '🌧️', opts: ['空曠、沒有屋簷或樹遮住的地方', '教室裡面', '大樹下', '走廊屋簷下'], a: 0, why: '放在空曠的地方，雨水才能直接落進雨量筒。' },
        { q: '測量氣溫時，溫度計要放在哪裡？', big: '🌡️', opts: ['通風、不被陽光直接照射的地方', '直接曬太陽的地方', '冷氣機出風口', '握在手心裡'], a: 0, why: '陽光直接照射或手的溫度都會讓讀數不準。' },
        { q: '晴天時，一天之中氣溫通常在什麼時候最高？', big: '☀️', opts: ['中午過後', '清晨', '半夜', '傍晚太陽下山後'], a: 0, why: '晴天時氣溫通常在中午過後最高，清晨最低。' },
        { q: '下面哪一個<b>不是</b>查詢天氣預報的好方法？', opts: ['問同學猜猜看', '看電視氣象報告', '上氣象署網站或用 App', '聽廣播'], a: 0, why: '天氣預報要從可靠的來源查詢。' }
      ]
    },
    {
      name: '特派員出任務', kind: 'boss', type: 'combo', th: [1, 3],
      inst: '先讀懂一天的氣溫折線圖，再依照天氣特報，幫大家做好準備！',
      recap: '晴天時氣溫通常清晨最低、中午過後最高。颱風要固定門窗、準備手電筒；高溫要多喝水防中暑；寒流低溫要穿暖、注意長輩保暖。',
      steps: [
        {
          type: 'quiz',
          qs: [
            { q: '這是某一天的氣溫紀錄。這天什麼時候氣溫<b>最高</b>？', big: G.tempChartSVG(), opts: ['14 時（下午 2 點）', '6 時（早上 6 點）', '10 時（早上 10 點）', '18 時（傍晚 6 點）'], a: 0, why: '14 時的點最高，是 28°C。' },
            { q: '這天什麼時候氣溫<b>最低</b>？', big: G.tempChartSVG(), opts: ['6 時', '12 時', '14 時', '16 時'], a: 0, why: '6 時是 19°C，是這天紀錄中最低的。' },
            { q: '12 時的氣溫是幾度？', big: G.tempChartSVG(), opts: ['27°C', '24°C', '28°C', '21°C'], a: 0, why: '12 時的點對到 27°C。' },
            { q: '從 6 時到 14 時，氣溫上升了幾度？', big: G.tempChartSVG(), opts: ['9 度', '7 度', '28 度', '19 度'], a: 0, why: '28 − 19 = 9，上升了 9 度。' }
          ]
        },
        {
          type: 'sort',
          bins: [
            { k: 'ty', t: '颱風警報', e: '🌀', c: '#7fb8ff' },
            { k: 'hot', t: '高溫炎熱', e: '🥵', c: '#ff8a65' },
            { k: 'cold', t: '寒流低溫', e: '🥶', c: '#b5c7ff' }
          ],
          items: [
            { t: '固定門窗', e: '🪟', k: 'ty' },
            { t: '把陽台盆栽搬進屋', e: '🪴', k: 'ty', why: '颱風風很大，盆栽可能被吹落。' },
            { t: '準備手電筒和飲用水', e: '🔦', k: 'ty', why: '颱風可能停電、停水。' },
            { t: '不要去海邊看浪', e: '🌊', k: 'ty' },
            { t: '多喝水', e: '🚰', k: 'hot', why: '天氣炎熱容易流汗，要多補充水分。' },
            { t: '戴帽子、撐陽傘', e: '👒', k: 'hot' },
            { t: '避免中午在大太陽下運動', e: '🏃', k: 'hot', hint: '小心中暑喔！' },
            { t: '穿厚外套、戴圍巾', e: '🧣', k: 'cold' },
            { t: '提醒家中長輩保暖', e: '👵', k: 'cold' }
          ]
        }
      ]
    }
  ]
});
