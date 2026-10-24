/* 單元二 熱對物質的影響 */

/* 熱脹冷縮實驗室：選材料，加熱或冷卻，觀察變化 */
G.types.expandlab = function (lv, area, api) {
  var st = { m: 'air', s: 0 }; /* s：-1 冷卻、0 室溫、1 加熱 */
  var M = { air: '🎈 空氣（瓶口套氣球）', water: '💧 水（插細管的瓶子）', metal: '⚙️ 金屬（銅球和銅環）' };
  area.innerHTML = '<div class="panel sim"><svg viewBox="0 0 400 250"></svg><div class="msg"></div>' +
    '<div class="ctl"><div><b>材料：</b>' + Object.keys(M).map(function (k) { return '<button class="seg" data-g="m" data-k="' + k + '">' + M[k] + '</button>'; }).join('') + '</div>' +
    '<div><button class="seg" data-g="s" data-k="1">🔥 泡熱水（加熱）</button><button class="seg" data-g="s" data-k="-1">🧊 泡冰水（冷卻）</button><button class="seg" data-g="s" data-k="0">↩️ 回到室溫</button></div></div>' +
    '<ul class="tasks"></ul><div class="row"><button class="btn go" disabled>實驗完成，下一步 ➜</button></div></div>';
  var svg = G.$('svg', area), msg = G.$('.msg', area);
  var mark = G.labTasks(area, [
    { k: 'air1', t: '把空氣加熱' }, { k: 'air-1', t: '把空氣冷卻' },
    { k: 'water1', t: '把水加熱' }, { k: 'water-1', t: '把水冷卻' },
    { k: 'metal1', t: '把金屬球加熱' }, { k: 'metal-1', t: '把金屬球冷卻' }
  ], function () { G.thenQuiz(lv, area, api, '氣體、液體、固體都觀察過了，來回答問題！'); });
  function draw() {
    var s = st.s, tub = s === 1 ? '#ffccbc' : s === -1 ? '#b3e5fc' : '#eceff1';
    var body = '<rect x="110" y="150" width="180" height="80" rx="10" fill="' + tub + '" stroke="#90a4ae" stroke-width="3"/>' +
      '<text x="200" y="245" font-size="13" text-anchor="middle" fill="#78909c">' + (s === 1 ? '熱水' : s === -1 ? '冰水' : '室溫') + '</text>';
    var text = '';
    if (st.m === 'air') {
      var r = s === 1 ? 34 : s === -1 ? 6 : 16;
      body += '<path d="M170 210 V120 Q170 105 185 100 V86 H215 V100 Q230 105 230 120 V210Z" fill="#e3f2fd" stroke="#546e7a" stroke-width="3"/>' +
        (s === -1 ? '<path d="M190 86 Q200 96 210 86" fill="#ef5350" stroke="#c62828" stroke-width="2"/>' :
          '<ellipse cx="200" cy="' + (86 - r) + '" rx="' + (r * 0.85 + 6) + '" ry="' + r + '" fill="#ef5350" stroke="#c62828" stroke-width="2"/>');
      text = s === 1 ? '🎈 氣球<b>鼓起來</b>了！空氣受熱<b>體積變大</b>。' : s === -1 ? '🎈 氣球<b>扁下去、被吸進瓶口</b>！空氣遇冷<b>體積變小</b>。' : '氣球軟軟的掛在瓶口。';
    } else if (st.m === 'water') {
      var h = s === 1 ? 90 : s === -1 ? 30 : 60;
      body += '<path d="M160 210 V130 Q160 115 175 115 H225 Q240 115 240 130 V210Z" fill="#81d4fa" stroke="#546e7a" stroke-width="3"/>' +
        '<rect x="194" y="10" width="12" height="108" fill="#fff" stroke="#546e7a" stroke-width="2"/>' +
        '<rect x="196" y="' + (116 - h) + '" width="8" height="' + h + '" fill="#29b6f6"/>' +
        '<line x1="186" y1="56" x2="214" y2="56" stroke="#ff7043" stroke-width="2" stroke-dasharray="4 3"/><text x="218" y="60" font-size="12" fill="#ff7043">原來高度</text>';
      text = s === 1 ? '💧 細管裡的水面<b>上升</b>！水受熱<b>體積變大</b>。' : s === -1 ? '💧 細管裡的水面<b>下降</b>！水遇冷<b>體積變小</b>。' : '水面停在原來的高度。';
    } else {
      var br = s === 1 ? 27 : s === -1 ? 21 : 24, pass = br <= 24;
      body =
        '<rect x="60" y="190" width="280" height="40" rx="10" fill="' + tub + '" stroke="#90a4ae" stroke-width="3"/>' +
        '<text x="200" y="245" font-size="13" text-anchor="middle" fill="#78909c">' + (s === 1 ? '用酒精燈加熱銅球' : s === -1 ? '把銅球泡冰水' : '室溫') + '</text>' +
        '<line x1="120" y1="40" x2="120" y2="' + (pass ? 150 : 90) + '" stroke="#795548" stroke-width="4"/>' +
        '<circle cx="120" cy="' + (pass ? 150 + br : 90 + br) + '" r="' + br + '" fill="#ffb74d" stroke="#e65100" stroke-width="3"/>' +
        '<ellipse cx="120" cy="140" rx="26" ry="7" fill="none" stroke="#6d4c41" stroke-width="5"/><line x1="146" y1="140" x2="230" y2="140" stroke="#6d4c41" stroke-width="5"/>' +
        '<text x="240" y="135" font-size="14" fill="#6d4c41">銅環</text>';
      text = s === 1 ? '⚙️ 加熱後的銅球<b>卡住，穿不過</b>銅環！金屬受熱<b>體積變大</b>。' : s === -1 ? '⚙️ 冷卻後的銅球<b>輕鬆穿過</b>銅環！金屬遇冷<b>體積變小</b>。' : '室溫時，銅球剛好可以穿過銅環。';
    }
    svg.innerHTML = '<rect width="400" height="250" rx="14" fill="#fffaf3"/>' + body;
    msg.innerHTML = text;
    area.querySelectorAll('.seg').forEach(function (b) { b.classList.toggle('on', String(st[b.dataset.g]) === b.dataset.k); });
    if (s) mark(st.m + s);
  }
  area.querySelectorAll('.seg').forEach(function (b) {
    b.onclick = function () {
      if (b.dataset.g === 'm') { st.m = b.dataset.k; st.s = 0; } else st.s = +b.dataset.k;
      draw();
    };
  });
  draw();
};

G.units.push({
  id: 'u2', no: '二', name: '熱對物質的影響', e: '🔥', c: '#ff7043',
  sub: '物質受熱後的變化・熱的傳播方式（含保溫與散熱）',
  levels: [
    {
      name: '熱脹冷縮實驗室', kind: 'op', type: 'expandlab', pick: 4, th: [0, 1],
      inst: '選一種材料，按「泡熱水」或「泡冰水」，看看空氣、水、金屬有什麼變化。六個實驗都要做完！',
      recap: '<b>氣體、液體、固體</b>都有<b>熱脹冷縮</b>的性質：受熱體積變大，遇冷體積變小。生活中：凹陷的乒乓球泡熱水會恢復、溫度計液柱升降、鐵軌和橋梁留<b>伸縮縫</b>。',
      qs: [
        { q: '凹下去的乒乓球放進熱水裡會恢復原狀，主要是因為？', big: '🏓', opts: ['球裡的空氣受熱膨脹', '熱水把球吸出來', '塑膠遇熱變硬', '水跑進球裡面'], a: 0, why: '球內空氣受熱體積變大，把凹下去的地方推回來。' },
        { q: '溫度計裡的液柱為什麼會隨溫度上升？', big: '🌡️', opts: ['液體受熱體積變大', '液體受熱變輕飛起來', '玻璃管遇熱變短', '液體變多了'], a: 0, why: '溫度計利用液體熱脹冷縮的性質來測量溫度。' },
        { q: '鐵軌接縫處會留一點空隙，是為了什麼？', big: '🛤️', opts: ['夏天鐵軌受熱膨脹時才不會變形', '讓火車比較安靜', '省一點鐵', '方便排水'], a: 0, why: '金屬受熱會膨脹，留伸縮縫可以避免鐵軌擠壓彎曲。' },
        { q: '瓶蓋太緊打不開，可以怎麼做比較容易轉開？', big: '🫙', opts: ['用熱水沖一下金屬瓶蓋', '把整瓶放進冰箱', '用力搖一搖', '倒過來放'], a: 0, why: '金屬瓶蓋受熱膨脹得比玻璃多，就會比較鬆。' },
        { q: '把套著氣球的空瓶泡進冰水，氣球會怎樣？', big: '🎈', opts: ['變扁、被吸進瓶口', '鼓得更大', '爆破', '完全不變'], a: 0, why: '瓶內空氣遇冷體積變小，氣球就扁下去了。' }
      ]
    },
    {
      name: '熱的旅行方式', kind: 'idea', type: 'sort', th: [0, 2],
      inst: '熱會從高溫的地方傳到低溫的地方。把每個生活現象分到「傳導」「對流」「輻射」！',
      recap: '<b>傳導</b>：熱沿著物體從高溫處傳到低溫處（固體為主，金屬傳得快）。<b>對流</b>：液體、氣體受熱上升、冷的下降，形成循環。<b>輻射</b>：熱不需要靠物質，直接向四周傳出（如太陽、暖爐）。',
      bins: [{ k: 'c', t: '傳導', e: '🥄', c: '#ff7043' }, { k: 'v', t: '對流', e: '🔄', c: '#29b6f6' }, { k: 'r', t: '輻射', e: '☀️', c: '#ffb300' }],
      items: [
        { e: '🥄', t: '金屬湯匙放熱湯，握柄變燙', k: 'c' },
        { e: '🍳', t: '鍋子加熱，煎蛋變熟', k: 'c' },
        { e: '🧊', t: '手握冰塊，手變冰冷', k: 'c', why: '熱從溫暖的手傳到冰塊，也是傳導。' },
        { e: '🫕', t: '煮水時，下面熱水往上翻滾', k: 'v' },
        { e: '❄️', t: '冷氣機裝在房間高處', k: 'v', why: '冷空氣會往下沉，裝高處可以讓房間均勻變涼。' },
        { e: '🏮', t: '天燈裡的熱空氣上升', k: 'v' },
        { e: '☀️', t: '站在陽光下覺得溫暖', k: 'r' },
        { e: '🔥', t: '圍著營火，臉覺得熱', k: 'r' },
        { e: '🍞', t: '烤麵包機的發熱管烤吐司', k: 'r' }
      ]
    },
    {
      name: '保溫散熱大挑戰', kind: 'boss', type: 'combo', th: [1, 3],
      inst: '生活中有時要「保溫」、有時要「散熱」。先分類，再回答挑戰題！',
      recap: '保溫要<b>阻擋熱的傳播</b>：用不容易傳熱的材料（塑膠、木頭、保麗龍、羽毛、空氣層），或用真空、反光層阻擋輻射。散熱要<b>加快熱的傳播</b>：用金屬散熱片、增加表面積、風扇加強對流。',
      steps: [
        {
          type: 'sort',
          bins: [{ k: 'k', t: '幫忙保溫', e: '🧣', c: '#ff7043' }, { k: 's', t: '幫忙散熱', e: '🌬️', c: '#29b6f6' }],
          items: [
            { e: '🧥', t: '冬天穿羽絨衣', k: 'k' },
            { e: '🥤', t: '保溫瓶的真空雙層瓶身', k: 'k' },
            { e: '📦', t: '保麗龍箱裝冰品', k: 'k', why: '保麗龍不易傳熱，冷的東西也能保持冰涼。' },
            { e: '🍱', t: '便當袋裡的鋁箔保溫層', k: 'k' },
            { e: '💻', t: '電腦裡的風扇', k: 's' },
            { e: '🏍️', t: '機車引擎外的金屬散熱片', k: 's' },
            { e: '👕', t: '夏天穿寬鬆透氣的衣服', k: 's' },
            { e: '🐶', t: '狗狗吐舌頭喘氣', k: 's' }
          ]
        },
        {
          type: 'quiz', pick: 5, qs: [
            { q: '茶壺的壺身用金屬、把手用木頭或塑膠，為什麼？', big: '🫖', opts: ['金屬傳熱快能加熱，把手傳熱慢不燙手', '因為比較便宜', '木頭比金屬重', '為了比較好看'], a: 0, why: '金屬是熱的良導體；木頭、塑膠不容易傳熱，拿著不會燙。' },
            { q: '太陽的熱穿過幾乎沒有空氣的太空傳到地球，是靠哪一種方式？', big: '☀️➡️🌏', opts: ['輻射', '傳導', '對流', '蒸發'], a: 0, why: '太空中幾乎沒有物質，熱不能靠傳導或對流，太陽的熱是以輻射的方式傳到地球。' },
            { q: '熱的傳播方向是？', opts: ['從高溫處傳到低溫處', '從低溫處傳到高溫處', '只會往上傳', '不會移動'], a: 0, why: '熱一定是從溫度高的地方傳到溫度低的地方。' },
            { q: '保溫瓶的真空層主要阻擋了哪些熱的傳播方式？', opts: ['傳導和對流', '只有輻射', '什麼都沒擋', '只擋住光'], a: 0, why: '真空裡沒有物質，熱就不能靠傳導和對流傳出去；瓶內的反光層再擋住輻射。' },
            { q: '為什麼暖氣機通常放在房間低處？', opts: ['熱空氣會上升，形成對流讓整間變暖', '放高處會掉下來', '低處比較好插電', '熱空氣會往下沉'], a: 0, why: '熱空氣上升、冷空氣下降，暖氣放低處能讓房間對流循環。' },
            { q: '想比較不同杯子的保溫效果，哪一項應該保持「相同」？', opts: ['倒入的熱水量和起始溫度', '杯子的材料', '杯子的種類', '測得的溫度'], a: 0, why: '要比較的是杯子材料（改變的變因），其他條件如水量、起始溫度都要相同才公平。' }
          ]
        }
      ]
    }
  ]
});
