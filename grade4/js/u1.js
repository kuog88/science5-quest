/* 單元一 地球的夥伴—日月星辰 */

/* 任務清單：達成後打勾，全部完成才能進下一步 */
G.checklist = function (box, tasks, onAll) {
  var done = {};
  function render() {
    box.innerHTML = tasks.map(function (t) { return '<li class="' + (done[t.k] ? 'ok' : '') + '">' + (done[t.k] ? '✅' : '⬜') + ' ' + t.t + '</li>'; }).join('');
  }
  render();
  return function (k) {
    if (done[k]) return;
    done[k] = true; G.sfx.tick(); render();
    if (tasks.every(function (t) { return done[t.k]; })) onAll();
  };
};

/* 太陽影子觀測站：拉動時間，看太陽位置與竹竿影子 */
G.types.shadow = function (lv, area, api) {
  area.innerHTML = '<div class="panel sim"><svg viewBox="0 0 400 230"></svg>' +
    '<div class="slider"><span>🕕 6 點</span><input type="range" min="6" max="18" step="0.25" value="7"><span>18 點 🕕</span></div>' +
    '<div class="msg"></div><ul class="tasks"></ul>' +
    '<div class="row"><button class="btn go" disabled>我觀察好了，下一步 ➜</button></div></div>';
  var svg = G.$('svg', area), rng = G.$('input', area), msg = G.$('.msg', area);
  var tick = G.checklist(G.$('.tasks', area), [
    { k: 'am', t: '看看<b>早上</b>（8 點以前）的影子' },
    { k: 'noon', t: '看看<b>中午</b>（12 點左右）的影子' },
    { k: 'pm', t: '看看<b>下午</b>（16 點以後）的影子' }
  ], function () { var g = G.$('.go', area); g.disabled = false; G.bump(g, 'pop'); });
  function draw() {
    var t = +rng.value, th = Math.PI * (t - 6) / 12;
    var cx = 200, gy = 190, R = 165;
    var sx = cx - R * Math.cos(th), sy = gy - 150 * Math.sin(th);
    var elev = Math.max(4, 72 * Math.sin(th));
    var len = Math.min(170, 40 / Math.tan(elev * Math.PI / 180));
    var dir = t < 12 ? 1 : t > 12 ? -1 : 0;
    var tip = cx + dir * len;
    var hh = Math.floor(t), mm = Math.round((t - hh) * 60);
    var sky = t < 7 || t > 17 ? '#ffd9a8' : '#cfe9ff';
    svg.innerHTML = '<rect width="400" height="230" fill="' + sky + '"/>' +
      '<path d="M35 190 A165 150 0 0 1 365 190" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 6"/>' +
      '<rect y="190" width="400" height="40" fill="#9ccc65"/>' +
      '<text x="14" y="214" font-size="18" font-weight="900" fill="#33691e">東</text><text x="368" y="214" font-size="18" font-weight="900" fill="#33691e">西</text>' +
      '<text x="200" y="224" font-size="12" text-anchor="middle" fill="#33691e">（面向南方觀察）</text>' +
      '<polygon points="' + (cx - 3) + ',190 ' + (cx + 3) + ',190 ' + (tip + 2 * dir) + ',201 ' + (tip - 2) + ',201" fill="#37474f" opacity=".6"/>' +
      (dir === 0 ? '<ellipse cx="200" cy="193" rx="9" ry="3" fill="#37474f" opacity=".6"/>' : '') +
      '<rect x="197" y="150" width="6" height="40" fill="#8d6e63"/>' +
      '<circle cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="16" fill="#ffca28" stroke="#ff8f00" stroke-width="3"/>' +
      '<text x="10" y="24" font-size="18" font-weight="900" fill="#37474f">' + hh + ':' + (mm < 10 ? '0' : '') + mm + '</text>';
    var where = t < 12 ? '東邊' : t > 12 ? '西邊' : '天空最高的地方';
    var sh = dir === 0 ? '影子最短' : '影子在<b>' + (dir > 0 ? '西' : '東') + '邊</b>，' + (len > 90 ? '很長' : len > 40 ? '中等' : '比較短');
    msg.innerHTML = '太陽在' + where + '，' + sh;
    if (t <= 8) tick('am');
    if (t >= 11.5 && t <= 12.5) tick('noon');
    if (t >= 16) tick('pm');
  }
  rng.addEventListener('input', draw);
  draw();
  G.$('.go', area).onclick = function () { G.types.quiz({ qs: lv.qs }, area, api); };
};

/* 月相圖：p = 0 新月、0.5 滿月；北半球盈月亮面在右 */
G.moonSVG = function (p, size) {
  var r = 40, c = 50, k = Math.cos(2 * Math.PI * p), rx = Math.abs(k * r).toFixed(1);
  var waxing = p < 0.5, gib = k < 0;
  var lit = '';
  if (p > 0.02 && p < 0.98) {
    if (Math.abs(p - 0.5) < 0.01) lit = '<circle cx="50" cy="50" r="40" fill="#fff59d"/>';
    else lit = '<path d="M50 10 A40 40 0 0 ' + (waxing ? 1 : 0) + ' 50 90 A' + rx + ' 40 0 0 ' + (waxing ? (gib ? 1 : 0) : (gib ? 0 : 1)) + ' 50 10 Z" fill="#fff59d"/>';
  }
  return '<svg viewBox="0 0 100 100"' + (size ? ' width="' + size + '"' : '') + '><rect width="100" height="100" rx="12" fill="#1a237e"/>' +
    '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="#37427a" stroke="#5c6bc0" stroke-width="2" stroke-dasharray="' + (p < 0.02 || p > 0.98 ? '4 4' : '0') + '"/>' + lit + '</svg>';
};

G.units.push({
  id: 'u1', no: '一', name: '地球的夥伴—日月星辰', e: '🌙', c: '#7e57c2',
  sub: '太陽、月亮與星星・多變的月亮・月相變化與生活',
  levels: [
    {
      name: '太陽影子觀測站', kind: 'op', type: 'shadow', th: [0, 1],
      inst: '拉動下面的時間條，觀察太陽的位置和竹竿影子的變化。早上、中午、下午都要看看喔！',
      recap: '太陽<b>東升西落</b>；影子在太陽的<b>相反方向</b>；早上影子在西邊、下午在東邊；<b>中午太陽最高、影子最短</b>。',
      qs: [
        { q: '早上太陽在東邊，竹竿的影子會在哪一邊？', big: '🌅', opts: ['西邊', '東邊', '正上方', '沒有影子'], a: 0, why: '影子在太陽的相反方向，太陽在東，影子就在西。' },
        { q: '一天之中，什麼時候竹竿的影子最短？', opts: ['中午', '早上', '傍晚', '都一樣長'], a: 0, why: '中午太陽在天空最高的位置，影子最短。' },
        { q: '從早上到下午，太陽在天空中怎麼移動？', opts: ['從東邊升起，往西邊落下', '從西邊升起，往東邊落下', '一直停在中間', '從北邊移到南邊'], a: 0, why: '太陽每天都是東升西落。' }
      ]
    },
    {
      name: '日月星辰小博士', kind: 'idea', type: 'quiz', pick: 8, th: [1, 3],
      inst: '太陽、月亮和星星有什麼不一樣？怎麼描述月亮的位置？選出正確答案吧！',
      recap: '太陽和星星自己會發光，月亮是<b>反射太陽光</b>；用<b>方位</b>和<b>高度角</b>（一個拳頭約 10 度）描述月亮位置；月亮也是<b>東升西落</b>。',
      qs: [
        { q: '月亮看起來亮亮的，是因為什麼？', big: '🌕', opts: ['反射太陽的光', '月亮自己會發光', '月亮上有很多燈', '星星照亮月亮'], a: 0, why: '月亮本身不會發光，我們看到的是它反射的太陽光。' },
        { q: '下面哪一個天體<b>自己會發光</b>？', opts: ['太陽', '月亮', '地球', '人造衛星'], a: 0, why: '太陽和大部分的星星都會自己發光發熱。' },
        { q: '白天為什麼看不到星星？', big: '☀️⭐', opts: ['太陽光太亮，把星光蓋過去了', '星星白天都跑掉了', '星星白天會熄滅', '星星只在晚上出生'], a: 0, why: '星星一直都在，只是白天太陽光太強，所以看不見。' },
        { q: '天上的星星有的亮、有的暗，下面哪個說法正確？', opts: ['星星的亮度不一樣', '所有星星一樣亮', '越暗的星星越近', '星星不會發光'], a: 0, why: '星星有些亮、有些暗，亮度不一樣。' },
        { q: '觀察月亮時，手臂伸直、握拳，一個拳頭大約代表幾度的高度角？', big: '✊', opts: ['10 度', '1 度', '45 度', '90 度'], a: 0, why: '伸直手臂時，一個拳頭大約是 10 度，可以用來量月亮的高度角。' },
        { q: '要清楚說出月亮的位置，需要記錄哪兩樣？', opts: ['方位和高度角', '顏色和大小', '形狀和溫度', '時間和天氣'], a: 0, why: '用方位（例如東南方）加上高度角（例如 30 度），就能描述月亮的位置。' },
        { q: '月亮在一天之中是怎麼移動的？', opts: ['東升西落，和太陽一樣', '西升東落', '固定在同一個位置', '只會上下移動'], a: 0, why: '月亮和太陽一樣，都有東升西落的現象。' },
        { q: '小美面向南方站好，她的左手邊是哪一個方位？', big: '🧍', opts: ['東方', '西方', '北方', '南方'], a: 0, why: '面向南方時，左手是東方、右手是西方、背後是北方。' },
        { q: '觀察太陽時，下面哪個做法是<b>安全</b>的？', opts: ['不可以直接用眼睛看太陽', '用望遠鏡直接看太陽', '一直盯著太陽看', '戴一般眼鏡看太陽'], a: 0, why: '太陽光很強，直接看會傷害眼睛。' },
        { q: '要找出觀察地點的方位，可以使用什麼工具？', big: '🧭', opts: ['指北針', '溫度計', '量筒', '放大鏡'], a: 0, why: '指北針可以找出東、西、南、北。' }
      ]
    },
    {
      name: '月相排一排', kind: 'boss', type: 'combo', th: [0, 2],
      inst: '月亮的形狀每天都在變！依照農曆日期把月相排好，再挑戰生活應用題。',
      recap: '農曆初一<b>新月</b>→初七八<b>上弦月</b>（右半邊亮）→十五<b>滿月</b>→廿二三<b>下弦月</b>（左半邊亮），大約<b>一個月（約 29.5 天）</b>循環一次。',
      steps: [
        {
          type: 'order', rounds: [
            {
              prompt: '從<b>農曆初一到十五</b>，依序點選月相。', why: '月亮亮的部分從右邊開始，越來越大，十五變成滿月！', items: [
                { t: '新月（初一）', svg: G.moonSVG(0) },
                { t: '眉月（初三）', svg: G.moonSVG(0.1) },
                { t: '上弦月（初八）', svg: G.moonSVG(0.25) },
                { t: '盈凸月（十一）', svg: G.moonSVG(0.37) },
                { t: '滿月（十五）', svg: G.moonSVG(0.5) }
              ]
            },
            {
              prompt: '從<b>農曆十五到月底</b>，依序點選月相。', why: '滿月之後，亮的部分從右邊開始變少，最後只剩左邊一點點。', items: [
                { t: '滿月（十五）', svg: G.moonSVG(0.5) },
                { t: '虧凸月（十八）', svg: G.moonSVG(0.63) },
                { t: '下弦月（廿二）', svg: G.moonSVG(0.75) },
                { t: '殘月（廿六）', svg: G.moonSVG(0.88) }
              ]
            }
          ]
        },
        {
          type: 'quiz', qs: [
            { q: '中秋節（農曆八月十五日）晚上，天氣晴朗時會看到什麼月相？', big: '🥮', opts: ['滿月', '新月', '上弦月', '下弦月'], a: 0, why: '農曆十五左右是滿月，所以中秋節賞月看到圓圓的月亮。' },
            { q: '月相從新月變到下一次新月，大約要多久？', opts: ['大約一個月（約 29.5 天）', '一天', '一個星期', '一年'], a: 0, why: '月相變化有規律，大約 29.5 天循環一次，農曆就是依照月相來訂的。' },
            { q: '農曆初一幾乎看不到月亮，這時的月相叫做什麼？', opts: ['新月', '滿月', '眉月', '殘月'], a: 0, why: '農曆初一是新月，亮面背對地球，所以看不到。' },
            { q: '下面哪個節日和月相有關，常在<b>滿月</b>時過節？', opts: ['元宵節（農曆一月十五）', '端午節（農曆五月五日）', '兒童節（四月四日）', '國慶日（十月十日）'], a: 0, why: '元宵節和中秋節都在農曆十五，是滿月的時候。' }
          ]
        }
      ]
    }
  ]
});
