// 單元三 水溶液
(function () {
  const { hot } = window.H;
  const beaker = (x, y, w, h, fill, extra = '') => `<path d="M${x} ${y} L${x} ${y + h} Q${x} ${y + h + 10} ${x + 10} ${y + h + 10} L${x + w - 10} ${y + h + 10} Q${x + w} ${y + h + 10} ${x + w} ${y + h} L${x + w} ${y}" fill="none" stroke="var(--sky-dark)" stroke-width="4"/><rect x="${x + 3}" y="${y + h * 0.35}" width="${w - 6}" height="${h * 0.65 + 6}" rx="6" fill="${fill}" opacity=".75" ${extra}/>`;

  // ---------------- 三-1 溶解現象 ----------------
  const dissolveSVG = `<svg viewBox="0 0 600 460" role="img" aria-label="把糖加進水裡溶解">
    <rect width="600" height="460" fill="#f1eee6"/>
    <rect x="0" y="400" width="600" height="60" fill="var(--wood)" opacity=".5"/>
    <rect x="170" y="370" width="260" height="34" rx="8" fill="var(--metal)"/>
    <rect x="255" y="378" width="90" height="20" rx="4" fill="#20342a"/><text id="scaleTxt" x="300" y="394" text-anchor="middle" font-size="16" font-weight="800" fill="#8ff0a4" font-family="monospace">250 g</text>
    ${beaker(210, 170, 180, 190, '#d4ecf7', 'id="waterFill"')}
    <g id="particles"></g>
    <g id="sediment"></g>
    <line id="rod" x1="330" y1="120" x2="290" y2="350" stroke="var(--sky-dark)" stroke-width="6" stroke-linecap="round"/>
    <g id="cubes"><rect x="60" y="300" width="36" height="36" rx="4" fill="#fff" stroke="var(--line)" stroke-width="2"/><rect x="100" y="300" width="36" height="36" rx="4" fill="#fff" stroke="var(--line)" stroke-width="2"/><rect x="80" y="264" width="36" height="36" rx="4" fill="#fff" stroke="var(--line)" stroke-width="2"/></g>
    ${hot('solute', 98, 300, '--fruit', '糖（溶質）', 20, 250)}
    ${hot('solvent', 300, 300, '--water', '水（溶劑）', 400, 230)}
    ${hot('rod', 330, 140, '--sky-dark', '攪拌', 350, 120)}
    ${hot('scale', 210, 387, '--metal', '電子秤', 70, 440)}
    ${hot('sediment', 360, 350, '--root', '沉澱', 440, 360)}
  </svg>`;
  let sugar = 0, hotWater = false, stirred = true;
  function drawDissolve(stage) {
    const cap = hotWater ? 8 : 5, dissolved = Math.min(sugar, cap), extra = sugar - dissolved;
    const p = stage.querySelector('#particles'), s = stage.querySelector('#sediment');
    let html = '';
    for (let i = 0; i < dissolved * 6; i++) html += `<circle cx="${222 + Math.random() * 156}" cy="${245 + Math.random() * 120}" r="3" fill="var(--fruit)" opacity=".55"/>`;
    p.innerHTML = stirred ? html : '';
    s.innerHTML = Array.from({ length: extra * 4 }, (_, i) => `<rect x="${226 + (i * 23) % 148}" y="${352 - Math.floor(i / 7) * 8}" width="14" height="8" rx="2" fill="#fff" stroke="var(--line)"/>`).join('');
    stage.querySelector('#waterFill').setAttribute('fill', hotWater ? '#f7d9cf' : '#d4ecf7');
    stage.querySelector('#scaleTxt').textContent = `${250 + sugar * 10} g`;
    const ro = document.querySelector('#disRead');
    if (ro) ro.innerHTML = `加了 <b>${sugar}</b> 匙糖（每匙 10 g）　總重量 <b>${250 + sugar * 10} g</b><br>${extra > 0 ? `杯底有 <b>${extra}</b> 匙溶不下去，出現沉澱` : sugar ? '糖全部溶解了，看不到顆粒' : '還沒加糖'}${hotWater ? '　🔥 熱水可以溶更多糖' : ''}`;
  }
  window.LESSONS.u3a = {
    id: 'u3a', no: '1', title: '溶解現象', weeks: '10', clip: 'pets',
    intro: '糖放進水裡，攪一攪就不見了，它跑去哪裡了？溶解以後，重量會不會變？一起來實驗。',
    svg: dissolveSVG,
    chips: ['solute', 'solvent', 'rod', 'scale', 'sediment'],
    widget(el, api) {
      el.innerHTML = `<div class="ctrl"><button class="seg" id="addSugar">＋ 加一匙糖</button><button class="seg" id="hotW">🔥 換成熱水</button><button class="seg" id="resetS">重新開始</button></div><div class="readout" id="disRead" style="margin-top:8px"></div>`;
      const st = api.svg;
      el.querySelector('#addSugar').onclick = () => { sugar = Math.min(sugar + 1, 10); api.sfx.tap(); drawDissolve(st); if (sugar === (hotWater ? 9 : 6)) api.say('糖溶不下去了，杯底出現沉澱。一定量的水，能溶解的量是有限的。'); };
      el.querySelector('#hotW').onclick = (e) => { hotWater = !hotWater; e.target.classList.toggle('on', hotWater); drawDissolve(st); api.say(hotWater ? '換成熱水，糖可以溶解得更多。' : '換回冷水。'); };
      el.querySelector('#resetS').onclick = () => { sugar = 0; drawDissolve(st); };
      drawDissolve(st);
    },
    actions: [
      { label: '⚖️ 溶解前後秤重', sub: '重量會不會變？', c: '#8e9aa3', wide: true, run(api) {
        api.say('溶解前，水加糖一起秤是 280 公克；攪拌到糖全部溶解以後再秤，還是 280 公克。糖只是變成很小很小的顆粒散在水裡，總重量不會改變。');
        api.toast('溶解前 280 g ＝ 溶解後 280 g', 2400);
      } },
    ],
    facts: [{ t: '溶解', d: '物質均勻散在水裡，看不到顆粒', c: '--water' }, { t: '重量不變', d: '溶解前後，總重量一樣', c: '--metal' }],
    parts: {
      solute: { name: '溶質（糖）', kind: '溶解的東西', c: '--fruit', say: '被溶解的東西叫做溶質，例如糖、鹽。糖溶解後，會變成很小很小、眼睛看不到的顆粒，均勻散在水裡，所以整杯水都是甜的。', points: ['被溶解的物質叫溶質', '變成看不見的小顆粒', '均勻分散在水中，每一口都一樣甜'],
        art: `<svg viewBox="0 0 320 200"><rect x="40" y="70" width="70" height="70" rx="8" fill="#fff" stroke="var(--line)" stroke-width="3"/><path d="M130 105 h40 M160 95 l12 10 l-12 10" stroke="var(--muted)" stroke-width="4" fill="none"/><rect x="190" y="40" width="110" height="140" rx="10" fill="#d4ecf7"/>${Array.from({ length: 30 }, (_, i) => `<circle cx="${200 + (i * 37) % 90}" cy="${55 + (i * 53) % 115}" r="3" fill="var(--fruit)"/>`).join('')}</svg>` },
      solvent: { name: '溶劑（水）', kind: '用來溶解的東西', c: '--water', say: '用來溶解其他東西的液體叫做溶劑，水就是最常用的溶劑。糖溶在水裡，就變成了糖水，糖水就是一種水溶液。', points: ['用來溶解的液體叫溶劑', '水是最常見的溶劑', '溶質 ＋ 溶劑 ＝ 水溶液'],
        art: `<svg viewBox="0 0 320 200"><rect x="100" y="40" width="120" height="140" rx="12" fill="#d4ecf7" stroke="var(--sky-dark)" stroke-width="4"/><path d="M120 90 q20 -10 40 0 t40 0" stroke="#fff" stroke-width="4" fill="none"/></svg>` },
      rod: { name: '攪拌', kind: '讓溶解更快', c: '--sky-dark', say: '用攪拌棒攪拌，可以讓糖溶解得比較快。把方糖壓碎成糖粉，或是用熱水，也都能溶得比較快。', points: ['攪拌可以加快溶解', '顆粒越小，溶得越快', '水溫高，溶得比較快'],
        art: `<svg viewBox="0 0 320 200"><rect x="100" y="60" width="120" height="120" rx="12" fill="#d4ecf7" stroke="var(--sky-dark)" stroke-width="4"/><line x1="200" y1="10" x2="150" y2="160" stroke="var(--sky-dark)" stroke-width="6"><animateTransform attributeName="transform" type="rotate" values="-8 175 90;8 175 90;-8 175 90" dur="1s" repeatCount="indefinite"/></line><path d="M130 130 a30 12 0 1 0 60 0" stroke="#fff" stroke-width="3" fill="none"/></svg>` },
      scale: { name: '電子秤', kind: '溶解前後的重量', c: '--metal', say: '把水、糖和杯子一起秤，再把糖溶解後秤一次，兩次的重量一樣。溶解前後，總重量不會改變，而且水溶液的體積會比原來的水多一點。', points: ['溶解前後總重量一樣', '糖沒有消失，只是看不到', '水溶液的體積比原來的水多一點'],
        art: `<svg viewBox="0 0 320 200"><rect x="60" y="140" width="200" height="40" rx="8" fill="var(--metal)"/><rect x="120" y="150" width="80" height="22" rx="4" fill="#20342a"/><text x="160" y="167" text-anchor="middle" font-size="16" font-weight="800" fill="#8ff0a4" font-family="monospace">280 g</text><rect x="110" y="40" width="100" height="100" rx="10" fill="#d4ecf7" stroke="var(--sky-dark)" stroke-width="4"/></svg>` },
      sediment: { name: '沉澱', kind: '溶解量有限', c: '--root', say: '一杯水能溶解的糖是有限的。糖加太多，溶不下去的糖就會沉到杯底，這叫做沉澱。用熱水的話，可以溶解比較多的糖。', points: ['一定量的水，溶解量有限', '溶不下的會沉在杯底', '水溫高，糖可以溶得比較多'],
        art: `<svg viewBox="0 0 320 200"><rect x="100" y="40" width="120" height="140" rx="12" fill="#d4ecf7" stroke="var(--sky-dark)" stroke-width="4"/>${Array.from({ length: 14 }, (_, i) => `<rect x="${108 + (i * 17) % 100}" y="${165 - Math.floor(i / 6) * 9}" width="14" height="8" rx="2" fill="#fff" stroke="var(--line)"/>`).join('')}</svg>` },
      milk: { name: '泡奶粉', kind: '生活中的溶解', c: '--fruit', say: '泡奶粉時要攪拌搖一搖，奶粉才會溶得比較快、比較均勻。', points: ['攪拌、搖晃溶得快', '溫水比冷水溶得快'], art: `<svg viewBox="0 0 160 110"><rect x="60" y="20" width="44" height="80" rx="12" fill="#fff8ea" stroke="var(--line)" stroke-width="3"/><rect x="66" y="8" width="32" height="14" rx="4" fill="var(--sky)"/></svg>` },
      sea: { name: '海水', kind: '生活中的溶解', c: '--water', say: '海水是鹹的，因為海水裡溶解了很多鹽。把海水曬乾，就能得到鹽，這就是曬鹽。', points: ['海水溶解了很多鹽', '把水曬乾就留下鹽', '台灣以前有很多鹽田'], art: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#bfe0f0"/><path d="M0 60 q20 -10 40 0 t40 0 t40 0 t40 0 V110 H0Z" fill="var(--water)"/><path d="M90 30 l20 -12 l20 12Z" fill="#fff"/></svg>` },
      sand: { name: '沙子不會溶解', kind: '不溶於水', c: '--root', say: '不是每樣東西都能溶在水裡。沙子放進水裡攪拌，還是會沉到杯底，水也會變混濁，這不是溶解。', points: ['沙子不溶於水', '攪拌後還是會沉下去', '油也不溶於水，會浮在上面'], art: `<svg viewBox="0 0 160 110"><rect x="50" y="15" width="60" height="85" rx="8" fill="#d4ecf7" stroke="var(--sky-dark)" stroke-width="3"/>${Array.from({ length: 16 }, (_, i) => `<circle cx="${58 + (i * 11) % 46}" cy="${92 - Math.floor(i / 5) * 5}" r="3" fill="var(--soil-deep)"/>`).join('')}</svg>` },
      tea: { name: '熱茶溶糖', kind: '生活中的溶解', c: '--wood', say: '同樣一杯，熱茶可以溶解比較多的糖，冰茶裡的糖比較容易沉在杯底，所以手搖飲店常用糖水來調味。', points: ['熱的溶比較多', '冰飲料常用糖水調味'], art: `<svg viewBox="0 0 160 110"><path d="M45 30 L55 100 H105 L115 30Z" fill="#c9824a" opacity=".8"/><path d="M70 20 q5 -10 0 -18 M90 20 q5 -10 0 -18" stroke="var(--muted)" stroke-width="3" fill="none"/></svg>` },
    },
    drawers: [{ title: '生活中的溶解', desc: '哪些東西會溶解？哪些不會？', ids: ['milk', 'sea', 'tea', 'sand'] }],
    quiz: [
      { lv: '點圖', q: '在圖上點出「可以讓糖溶解得比較快」的工具。', tap: 'rod', why: '攪拌可以加快溶解。' },
      { lv: '點圖', q: '在圖上點出「溶不下去的糖」會跑去的地方。', tap: 'sediment', why: '溶解量有限，溶不下的糖會沉在杯底。' },
      { lv: '理解', q: '糖溶解在水裡以後，糖到哪裡去了？', opts: ['消失不見了', '變成很小的顆粒，均勻散在水裡', '變成水了', '跑到空氣中'], a: 1, why: '糖變成看不見的小顆粒，均勻散在水中，所以每一口都是甜的。' },
      { lv: '推理', q: '水 200 g 加糖 30 g，糖全部溶解後，糖水有多重？', opts: ['200 g', '230 g', '170 g', '比 200 g 還輕'], a: 1, why: '溶解前後總重量不變：200 ＋ 30 ＝ 230 g。' },
      { lv: '理解', q: '下面哪個方法「不能」讓糖溶解得比較快？', opts: ['攪拌', '把方糖壓碎', '用熱水', '把杯子放進冰箱'], a: 3, why: '水溫變低，溶解會變慢。' },
      { lv: '理解', q: '一杯水一直加糖，最後會發生什麼事？', opts: ['可以一直溶解下去', '溶不下的糖沉在杯底', '水會變多', '糖會浮在水面'], a: 1, why: '一定量的水，能溶解的量有限。' },
      { lv: '記憶', q: '糖水裡，「水」叫做什麼？', opts: ['溶質', '溶劑', '沉澱', '結晶'], a: 1, why: '用來溶解的液體叫溶劑，被溶解的糖叫溶質。' },
      { lv: '分類', q: '下面哪一樣放進水裡攪拌後，「不會」溶解？', opts: ['鹽', '糖', '沙子', '奶粉'], a: 2, why: '沙子不溶於水，攪拌後還是會沉下去。' },
      { lv: '生活', q: '海水為什麼是鹹的？', opts: ['海裡有很多魚', '海水溶解了很多鹽', '海水是藍色的', '太陽曬的'], a: 1, why: '海水裡溶解了很多鹽，曬乾就能得到鹽。' },
      { lv: '推理', q: '同樣 100 毫升的水，哪一杯可以溶解最多的糖？', opts: ['冰水', '常溫水', '熱水', '都一樣'], a: 2, why: '糖在熱水中可以溶解得比較多。' },
    ],
  };

  // ---------------- 三-2 水溶液的酸鹼性 ----------------
  const LIQ = {
    vinegar: { name: '白醋', type: 'acid', cab: '#e0566b' },
    lemon: { name: '檸檬汁', type: 'acid', cab: '#e86a8a' },
    salt: { name: '食鹽水', type: 'neutral', cab: '#8b6fc0' },
    sugarw: { name: '糖水', type: 'neutral', cab: '#8b6fc0' },
    soda: { name: '小蘇打水', type: 'base', cab: '#3f7fd0' },
    soap: { name: '肥皂水', type: 'base', cab: '#3fa58a' },
  };
  const TYPE = { acid: '酸性', neutral: '中性', base: '鹼性' };
  const acidSVG = `<svg viewBox="0 0 600 440" role="img" aria-label="六瓶水溶液和石蕊試紙">
    <rect width="600" height="440" fill="#f1eee6"/>
    <rect x="20" y="300" width="560" height="16" rx="4" fill="var(--wood)"/>
    ${Object.entries(LIQ).map(([k, v], i) => `<g id="bt-${k}"><rect x="${40 + i * 92}" y="170" width="60" height="130" rx="12" fill="#eef6fa" stroke="var(--sky-dark)" stroke-width="3"/><rect x="${52 + i * 92}" y="150" width="36" height="24" rx="4" fill="var(--metal)"/><rect class="liq" x="${44 + i * 92}" y="220" width="52" height="76" rx="8" fill="${{ vinegar: '#fbf6dc', lemon: '#f7ec9c', salt: '#eef6fa', sugarw: '#eef6fa', soda: '#eef6fa', soap: '#e3f1ea' }[k]}"/><text x="${70 + i * 92}" y="345" text-anchor="middle" class="lbl" style="font-size:18px">${v.name}</text></g>`).join('')}
    <g id="strips"><rect x="150" y="380" width="120" height="22" rx="4" fill="#e9a3ad" stroke="var(--line)"/><rect x="330" y="380" width="120" height="22" rx="4" fill="#9cbfe8" stroke="var(--line)"/></g>
    <g class="lbl" style="font-size:16px"><text x="160" y="425">紅色石蕊試紙</text><text x="340" y="425">藍色石蕊試紙</text></g>
    ${Object.keys(LIQ).map((k, i) => hot(k, 70 + i * 92, 120, LIQ[k].type === 'acid' ? '--acid' : LIQ[k].type === 'base' ? '--base' : '--neutral', LIQ[k].name, -999, -999)).join('')}
  </svg>`;
  function testLiquid(stage, k) {
    const v = LIQ[k];
    const red = stage.querySelector('#strips rect:nth-child(1)'), blue = stage.querySelector('#strips rect:nth-child(2)');
    red.setAttribute('fill', '#e9a3ad'); blue.setAttribute('fill', '#9cbfe8');
    setTimeout(() => {
      if (v.type === 'base') red.setAttribute('fill', '#9cbfe8');
      if (v.type === 'acid') blue.setAttribute('fill', '#e9a3ad');
    }, 400);
    Object.keys(LIQ).forEach((x) => stage.querySelector(`#bt-${x} .liq`).setAttribute('stroke', x === k ? 'var(--sun-dark)' : 'none'));
    const ro = document.querySelector('#acidRead');
    if (ro) ro.innerHTML = `<b>${v.name}</b> 是 <b style="color:var(--${v.type === 'acid' ? 'acid' : v.type === 'base' ? 'base' : 'neutral'})">${TYPE[v.type]}</b>：${v.type === 'acid' ? '藍色石蕊試紙變紅色' : v.type === 'base' ? '紅色石蕊試紙變藍色' : '兩種試紙都不變色'}<br>滴入紫色高麗菜汁 → <span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${v.cab};vertical-align:-3px"></span> ${v.type === 'acid' ? '偏紅色' : v.type === 'base' ? '偏藍綠色' : '還是紫色'}`;
  }
  const bottleArt = (c, label) => `<svg viewBox="0 0 320 200"><rect x="110" y="40" width="100" height="150" rx="16" fill="#eef6fa" stroke="var(--sky-dark)" stroke-width="4"/><rect x="130" y="20" width="60" height="26" rx="6" fill="var(--metal)"/><rect x="116" y="100" width="88" height="84" rx="10" fill="${c}"/><rect x="20" y="80" width="70" height="18" rx="3" fill="#e9a3ad"/><rect x="230" y="80" width="70" height="18" rx="3" fill="#9cbfe8"/>${label}</svg>`;
  const liqPart = (k, say, points) => ({ name: LIQ[k].name, kind: TYPE[LIQ[k].type] + '水溶液', c: LIQ[k].type === 'acid' ? '--acid' : LIQ[k].type === 'base' ? '--base' : '--neutral', say, points, art: bottleArt(LIQ[k].cab, '') });

  window.LESSONS.u3b = {
    id: 'u3b', no: '2', title: '水溶液的酸鹼性', weeks: '11–14', clip: 'mood',
    intro: '醋和肥皂水都是透明的，怎麼知道誰是酸性、誰是鹼性？用石蕊試紙和紫色高麗菜汁來檢驗。',
    svg: acidSVG,
    hint: '點瓶子上方的圓點，石蕊試紙會變色，還會唸出結果。',
    chips: Object.keys(LIQ),
    widget(el) { el.innerHTML = '<div class="readout" id="acidRead">點一瓶水溶液來檢驗看看。</div>'; },
    actions: [
      { label: '🥬 紫色高麗菜汁', sub: '天然的酸鹼指示劑', c: '#8b6fc0', run(api) { const b = document.querySelector('.drawer[data-part="cabbage"]'); if (b) b.click(); } },
      { label: '⚗️ 酸鹼中和', sub: '酸和鹼混在一起', c: '#3f7fd0', run(api) { const b = document.querySelector('.drawer[data-part="neutralize"]'); if (b) b.click(); } },
    ],
    facts: [{ t: '酸性', d: '藍色石蕊試紙 → 紅色', c: '--acid' }, { t: '鹼性', d: '紅色石蕊試紙 → 藍色', c: '--base' }],
    parts: {
      vinegar: liqPart('vinegar', '白醋是酸性。把醋滴在藍色石蕊試紙上，試紙會變成紅色；紅色石蕊試紙不會變色。', ['酸性', '藍色石蕊試紙變紅', '生活中可以用來去除水垢']),
      lemon: liqPart('lemon', '檸檬汁是酸性，吃起來酸酸的。它會讓藍色石蕊試紙變成紅色。', ['酸性', '藍色石蕊試紙變紅', '紫色高麗菜汁變紅色']),
      salt: liqPart('salt', '食鹽水是中性。紅色和藍色的石蕊試紙都不會變色。', ['中性', '兩種石蕊試紙都不變', '紫色高麗菜汁還是紫色']),
      sugarw: liqPart('sugarw', '糖水是中性，紅色和藍色的石蕊試紙都不會變色。', ['中性', '兩種石蕊試紙都不變', '甜甜的不代表是酸性']),
      soda: liqPart('soda', '小蘇打水是鹼性。它會讓紅色石蕊試紙變成藍色，藍色石蕊試紙不會變。', ['鹼性', '紅色石蕊試紙變藍', '紫色高麗菜汁變藍綠色']),
      soap: liqPart('soap', '肥皂水是鹼性，會讓紅色石蕊試紙變成藍色。摸起來滑滑的。', ['鹼性', '紅色石蕊試紙變藍', '清潔用品很多是鹼性']),
      litmus: { name: '石蕊試紙', kind: '酸鹼檢驗', c: '--neutral', say: '石蕊試紙有紅色和藍色兩種。用玻璃棒或滴管沾一點水溶液，滴在試紙上。酸性會讓藍色試紙變紅，鹼性會讓紅色試紙變藍，中性兩種都不變。換液體前要把玻璃棒洗乾淨。', points: ['用玻璃棒沾液體，不要用手摸', '酸性：藍 → 紅；鹼性：紅 → 藍', '中性：兩種都不變色'],
        art: `<svg viewBox="0 0 160 110"><rect x="20" y="30" width="50" height="16" rx="3" fill="#e9a3ad"/><rect x="20" y="60" width="50" height="16" rx="3" fill="#9cbfe8"/><line x1="110" y1="10" x2="80" y2="90" stroke="var(--sky-dark)" stroke-width="5"/><circle cx="80" cy="92" r="5" fill="var(--water)"/></svg>` },
      cabbage: { name: '紫色高麗菜汁', kind: '天然指示劑', c: '--neutral', say: '把紫色高麗菜切碎泡熱水，就能做出紫色高麗菜汁。滴進酸性的水溶液會變紅色、粉紅色；滴進中性的還是紫色；滴進鹼性的會變藍色、綠色，越鹼越偏黃綠色。', points: ['酸性：變紅、粉紅', '中性：保持紫色', '鹼性：變藍、綠，越鹼越黃綠'],
        art: `<svg viewBox="0 0 160 110">${['#d9374f', '#e86a8a', '#8b6fc0', '#3f7fd0', '#3fa58a', '#a9c23a'].map((c, i) => `<rect x="${8 + i * 25}" y="30" width="20" height="60" rx="6" fill="${c}"/>`).join('')}<text x="8" y="105" font-size="12" fill="var(--ink)">酸</text><text x="140" y="105" font-size="12" fill="var(--ink)">鹼</text></svg>` },
      neutralize: { name: '酸鹼中和', kind: '酸 ＋ 鹼', c: '--base', say: '酸性和鹼性的水溶液混在一起，性質會互相抵消，這叫做中和。混合後可能變成中性，也可能還是酸性或鹼性，要看哪一邊比較多。', points: ['酸和鹼混合會互相抵消', '結果可能是中性、酸性或鹼性', '要看哪一種比較多'],
        art: `<svg viewBox="0 0 160 110"><rect x="10" y="40" width="40" height="50" rx="6" fill="#e86a8a"/><text x="58" y="72" font-size="22" font-weight="800" fill="var(--ink)">+</text><rect x="75" y="40" width="40" height="50" rx="6" fill="#3f7fd0"/><text x="120" y="72" font-size="22" font-weight="800" fill="var(--ink)">→</text><rect x="138" y="40" width="18" height="50" rx="4" fill="#8b6fc0"/></svg>` },
      stomach: { name: '胃藥', kind: '生活中的中和', c: '--base', say: '胃酸太多會胃痛，有些胃藥是鹼性的，可以中和多餘的胃酸，讓胃舒服一點。', points: ['胃酸是酸性', '胃藥多是鹼性', '中和多餘的胃酸'],
        art: `<svg viewBox="0 0 160 110"><ellipse cx="80" cy="55" rx="50" ry="22" fill="#f5c8bf" stroke="var(--rose-dark)" stroke-width="3"/><rect x="60" y="45" width="40" height="20" rx="10" fill="#fff" stroke="var(--line)" stroke-width="2"/></svg>` },
      safety: { name: '使用安全', kind: '一定要記得', c: '--acid', say: '實驗時不可以用嘴巴嚐，也不可以用手直接摸。家裡的清潔劑，像漂白水和酸性的浴廁清潔劑，絕對不能混在一起，會產生有毒的氣體！', points: ['不可以嚐、不可以用手摸', '清潔劑不能混在一起用', '用完要洗手、收好'],
        art: `<svg viewBox="0 0 160 110"><path d="M80 10 L150 100 H10Z" fill="var(--sun)" stroke="var(--sun-dark)" stroke-width="4"/><rect x="76" y="40" width="8" height="34" rx="3" fill="var(--ink)"/><circle cx="80" cy="86" r="5" fill="var(--ink)"/></svg>` },
    },
    drawers: [{ title: '檢驗工具與生活應用', desc: '怎麼檢驗酸鹼？生活中又怎麼用？', ids: ['litmus', 'cabbage', 'neutralize', 'stomach', 'safety'] }],
    quiz: [
      { lv: '點圖', q: '下面的瓶子裡，點出一瓶「酸性」的水溶液。', tap: 'vinegar', alt: ['vinegar', 'lemon'], why: '白醋和檸檬汁都是酸性。' },
      { lv: '點圖', q: '點出一瓶會讓「紅色石蕊試紙變藍」的水溶液。', tap: 'soda', alt: ['soda', 'soap'], why: '小蘇打水和肥皂水是鹼性，會讓紅色石蕊試紙變藍。' },
      { lv: '記憶', q: '酸性的水溶液會讓哪一種石蕊試紙變色？', opts: ['藍色試紙變紅', '紅色試紙變藍', '兩種都變黑', '都不變'], a: 0, why: '酸性：藍色石蕊試紙變紅。' },
      { lv: '記憶', q: '食鹽水滴在紅色和藍色石蕊試紙上，會怎麼樣？', opts: ['紅變藍', '藍變紅', '兩種都不變色', '兩種都變白'], a: 2, why: '食鹽水是中性，兩種試紙都不變色。' },
      { lv: '分類', q: '下面哪一個是「鹼性」水溶液？', opts: ['檸檬汁', '白醋', '小蘇打水', '糖水'], a: 2, why: '小蘇打水是鹼性。' },
      { lv: '理解', q: '紫色高麗菜汁滴進白醋裡，會變成什麼顏色？', opts: ['紅色或粉紅色', '藍綠色', '還是紫色', '黑色'], a: 0, why: '紫色高麗菜汁遇到酸性會變紅。' },
      { lv: '理解', q: '紫色高麗菜汁滴進肥皂水裡，會變成什麼顏色？', opts: ['紅色', '藍綠色', '還是紫色', '白色'], a: 1, why: '紫色高麗菜汁遇到鹼性會變藍、綠色。' },
      { lv: '推理', q: '酸性和鹼性的水溶液混在一起，結果會是？', opts: ['一定是中性', '一定是酸性', '可能是中性、酸性或鹼性', '會爆炸'], a: 2, why: '中和後的結果，要看酸和鹼哪一邊比較多。' },
      { lv: '操作', q: '用石蕊試紙檢驗水溶液，正確的做法是？', opts: ['用手指沾液體摸試紙', '用玻璃棒沾液體滴在試紙上', '用嘴巴嚐嚐看', '把試紙丟進瓶子裡'], a: 1, why: '用玻璃棒或滴管沾液體，換液體前要洗乾淨。' },
      { lv: '安全', q: '下面哪一個做法很危險，「絕對不可以」？', opts: ['實驗後洗手', '把漂白水和浴廁清潔劑混在一起', '戴手套', '標示清楚瓶子'], a: 1, why: '不同清潔劑混合可能產生有毒氣體。' },
      { lv: '生活', q: '胃酸太多時吃的胃藥，通常是什麼性質？', opts: ['酸性', '中性', '鹼性', '沒有性質'], a: 2, why: '鹼性的胃藥可以中和多餘的胃酸。' },
      { lv: '迷思', q: '「糖水很甜，所以是酸性。」這句話對嗎？', opts: ['對', '不對'], a: 1, why: '糖水是中性，要用試紙檢驗，不能用味道判斷。' },
    ],
  };

  // ---------------- 三-3 水溶液的導電性 ----------------
  const COND = {
    salt: { name: '食鹽水', on: 1 }, vinegar: { name: '白醋', on: 0.6 }, soda: { name: '小蘇打水', on: 0.9 },
    sugarw: { name: '糖水', on: 0 }, pure: { name: '純水', on: 0 }, alcohol: { name: '酒精', on: 0 },
  };
  let condPick = 'salt';
  const condSVG = `<svg viewBox="0 0 600 440" role="img" aria-label="檢測水溶液導電的電路">
    <rect width="600" height="440" fill="#f1eee6"/>
    <g id="glow"><circle cx="300" cy="90" r="70" fill="var(--sunc)" opacity="0"/></g>
    <circle id="bulb" cx="300" cy="90" r="36" fill="#f5f2e6" stroke="var(--metal)" stroke-width="4"/>
    <path d="M288 92 q12 -20 24 0" stroke="var(--root)" stroke-width="3" fill="none"/>
    <rect x="284" y="124" width="32" height="20" rx="3" fill="var(--metal)"/>
    <rect x="60" y="180" width="110" height="56" rx="10" fill="#3a3f45"/><rect x="170" y="196" width="12" height="24" rx="3" fill="#3a3f45"/><rect x="60" y="180" width="40" height="56" rx="8" fill="var(--fruit)"/>
    <path d="M182 208 H230 V134 H284 M316 134 H370 V250" stroke="var(--acid)" stroke-width="5" fill="none"/>
    <path d="M60 208 H30 V400 H230 V250" stroke="var(--base)" stroke-width="5" fill="none"/>
    <rect x="222" y="250" width="16" height="130" rx="4" fill="#4a4a4a"/><rect x="362" y="250" width="16" height="130" rx="4" fill="#4a4a4a"/>
    ${beaker(190, 270, 220, 130, '#d4ecf7', 'id="condFill"')}
    <g id="ions"></g>
    ${hot('battery', 115, 208, '--fruit', '電池', 80, 270)}
    ${hot('bulbP', 300, 90, '--sunc', '燈泡', 350, 70)}
    ${hot('electrode', 370, 300, '--metal', '電極', 420, 300)}
    ${hot('circuit', 230, 160, '--acid', '通路', 120, 150)}
    ${hot('liquid', 300, 360, '--water', '水溶液', 430, 400)}
  </svg>`;
  function drawCond(stage) {
    const c = COND[condPick];
    stage.querySelector('#glow circle').setAttribute('opacity', c.on * 0.6);
    stage.querySelector('#bulb').setAttribute('fill', c.on ? '#fff3b0' : '#f5f2e6');
    stage.querySelector('#ions').innerHTML = c.on ? Array.from({ length: 10 }, (_, i) => `<circle cx="${250 + (i * 37) % 110}" cy="${330 + (i * 23) % 50}" r="4" fill="var(--sunc)"><animate attributeName="cx" values="${250 + (i * 37) % 110};${260 + (i * 41) % 100}" dur="1s" repeatCount="indefinite"/></circle>`).join('') : '';
    const ro = document.querySelector('#condRead');
    if (ro) ro.innerHTML = `${c.name}：${c.on ? `💡 燈泡<b>${c.on < 0.8 ? '微微亮' : '亮'}</b>了，可以導電` : '燈泡<b>不亮</b>，不能導電'}`;
  }
  window.LESSONS.u3c = {
    id: 'u3c', no: '3', title: '水溶液的導電性', weeks: '15', clip: 'toys',
    intro: '電要走一圈完整的路，燈泡才會亮。把不同的水溶液接進電路裡，看看誰能讓電通過。',
    svg: condSVG,
    chips: ['battery', 'bulbP', 'electrode', 'circuit', 'liquid'],
    widget(el, api) {
      el.innerHTML = `<b>換一杯水溶液：</b><div class="ctrl" style="margin:8px 0">${Object.entries(COND).map(([k, v]) => `<button class="seg ${k === condPick ? 'on' : ''}" data-cond="${k}">${v.name}</button>`).join('')}</div><div class="readout" id="condRead"></div>`;
      el.querySelectorAll('[data-cond]').forEach((b) => b.onclick = () => {
        condPick = b.dataset.cond; el.querySelectorAll('[data-cond]').forEach((x) => x.classList.toggle('on', x === b));
        drawCond(api.svg); const c = COND[condPick];
        api.say(c.on ? `${c.name}可以導電，燈泡亮了。` : `${c.name}不能導電，燈泡不亮。`);
      });
      drawCond(api.svg);
    },
    actions: [],
    facts: [{ t: '會導電', d: '食鹽水、醋、小蘇打水', c: '--sunc' }, { t: '不導電', d: '糖水、純水、酒精', c: '--metal' }],
    parts: {
      battery: { name: '電池', kind: '電路的一部分', c: '--fruit', say: '電池提供電。電從電池的一端出發，經過電線、燈泡、水溶液，再回到電池的另一端。', points: ['提供電的來源', '有正極和負極', '電要走一圈回到電池'], art: `<svg viewBox="0 0 320 200"><rect x="60" y="70" width="180" height="70" rx="12" fill="#3a3f45"/><rect x="60" y="70" width="60" height="70" rx="10" fill="var(--fruit)"/><rect x="240" y="92" width="18" height="26" rx="4" fill="#3a3f45"/><text x="200" y="115" font-size="30" font-weight="800" fill="#fff">+</text></svg>` },
      bulbP: { name: '燈泡', kind: '電路的一部分', c: '--sunc', say: '燈泡用來看電有沒有通過。燈泡亮了，表示電路是通的，水溶液可以導電；燈泡不亮，表示電過不去。', points: ['亮了 → 電通過了', '不亮 → 電過不去', '用來檢查是不是通路'], art: `<svg viewBox="0 0 320 200"><circle cx="160" cy="80" r="80" fill="var(--sunc)" opacity=".3"><animate attributeName="opacity" values=".2;.5;.2" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="160" cy="80" r="44" fill="#fff3b0" stroke="var(--metal)" stroke-width="4"/><rect x="142" y="120" width="36" height="26" rx="4" fill="var(--metal)"/></svg>` },
      electrode: { name: '電極', kind: '電路的一部分', c: '--metal', say: '電極是插進水溶液裡的兩根棒子，通常用碳棒或金屬片。兩根電極不能互相碰到，否則電就不會經過水溶液了。', points: ['插進水溶液的兩根棒子', '兩根電極不能碰在一起', '每次換液體要擦乾淨'], art: `<svg viewBox="0 0 320 200"><rect x="80" y="70" width="160" height="120" rx="10" fill="#d4ecf7"/><rect x="120" y="20" width="18" height="150" rx="4" fill="#4a4a4a"/><rect x="182" y="20" width="18" height="150" rx="4" fill="#4a4a4a"/></svg>` },
      circuit: { name: '通路', kind: '電的道路', c: '--acid', say: '電要走一整圈完整的路，燈泡才會亮，這叫做通路。如果中間有斷掉的地方，或是水溶液不能導電，就變成斷路，燈泡不會亮。', points: ['電走一整圈 → 通路，燈亮', '中間斷掉 → 斷路，燈不亮', '水溶液也是電路的一部分'], art: `<svg viewBox="0 0 320 200"><rect x="60" y="40" width="200" height="120" rx="20" fill="none" stroke="var(--acid)" stroke-width="6"/><circle r="8" fill="var(--sunc)"><animateMotion dur="3s" repeatCount="indefinite" path="M80 40 H240 Q260 40 260 60 V140 Q260 160 240 160 H80 Q60 160 60 140 V60 Q60 40 80 40Z"/></circle></svg>` },
      liquid: { name: '水溶液', kind: '會不會導電？', c: '--water', say: '食鹽水、醋、小蘇打水可以導電；糖水、純水和酒精不能導電。所以有些水溶液可以讓電通過，有些不行。', points: ['可以導電：食鹽水、醋、小蘇打水', '不能導電：糖水、純水、酒精', '自來水含雜質，也可能導電'], art: `<svg viewBox="0 0 320 200"><rect x="40" y="50" width="100" height="130" rx="10" fill="#d4ecf7"/><rect x="180" y="50" width="100" height="130" rx="10" fill="#d4ecf7"/><circle cx="90" cy="30" r="18" fill="var(--sunc)"/><circle cx="230" cy="30" r="18" fill="#ddd"/></svg>` },
      wethand: { name: '濕手不碰電', kind: '用電安全', c: '--acid', say: '我們的汗水和自來水裡有溶解的物質，可以導電。所以手濕濕的時候，絕對不能碰插座、插頭和電器，以免觸電。', points: ['汗水、自來水可能導電', '手濕不碰插座、插頭', '浴室用電要特別小心'], art: `<svg viewBox="0 0 160 110"><rect x="60" y="20" width="50" height="70" rx="8" fill="var(--card)" stroke="var(--line)" stroke-width="3"/><rect x="74" y="40" width="6" height="16" fill="var(--ink)"/><rect x="90" y="40" width="6" height="16" fill="var(--ink)"/><path d="M20 100 L140 10" stroke="var(--acid)" stroke-width="8"/></svg>` },
      sea: { name: '海水會導電', kind: '生活中的導電', c: '--water', say: '海水裡溶解了很多鹽，所以海水可以導電。打雷的時候不要在海邊或游泳池玩水。', points: ['海水溶有鹽，可以導電', '打雷時不要玩水'], art: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#bfe0f0"/><path d="M0 60 q20 -10 40 0 t40 0 t40 0 t40 0 V110 H0Z" fill="var(--water)"/><path d="M90 0 L76 34 H90 L78 60" stroke="var(--sunc)" stroke-width="5" fill="none"/></svg>` },
    },
    drawers: [{ title: '用電安全與生活', desc: '知道誰能導電，就知道怎麼保護自己。', ids: ['wethand', 'sea'] }],
    quiz: [
      { lv: '點圖', q: '在圖上點出「用來看電有沒有通過」的東西。', tap: 'bulbP', why: '燈泡亮了，表示電通過了。' },
      { lv: '點圖', q: '在圖上點出「提供電」的東西。', tap: 'battery', why: '電池是電的來源。' },
      { lv: '記憶', q: '下面哪一杯水溶液「可以」讓燈泡亮？', opts: ['糖水', '食鹽水', '純水', '酒精'], a: 1, why: '食鹽水可以導電。' },
      { lv: '記憶', q: '下面哪一杯「不能」導電？', opts: ['食鹽水', '白醋', '小蘇打水', '糖水'], a: 3, why: '糖水不能導電。' },
      { lv: '理解', q: '燈泡要亮，電必須怎麼走？', opts: ['走一半就好', '走一整圈完整的路（通路）', '只要接到電池正極', '不用電線'], a: 1, why: '電要走一整圈回到電池，才是通路。' },
      { lv: '操作', q: '做導電實驗時，兩根電極應該？', opts: ['緊緊碰在一起', '分開，不能互相碰到', '拿出水面', '用手握住'], a: 1, why: '兩根電極碰在一起，電就不會經過水溶液了。' },
      { lv: '安全', q: '為什麼手濕濕的時候不能碰插座？', opts: ['會把插座弄濕而已', '手上的水可能導電，會觸電', '水會變熱', '插座會壞掉'], a: 1, why: '汗水、自來水溶有物質可以導電，會觸電。' },
      { lv: '推理', q: '把食鹽水換成糖水，燈泡由亮變不亮，表示？', opts: ['電池沒電了', '糖水不能導電', '燈泡壞了', '電線斷了'], a: 1, why: '只改變了水溶液，所以是糖水不能導電。' },
      { lv: '分類', q: '下面哪一組「全部」可以導電？', opts: ['食鹽水、醋、小蘇打水', '糖水、純水、酒精', '食鹽水、糖水、純水', '醋、酒精、糖水'], a: 0, why: '食鹽水、醋、小蘇打水都能導電。' },
      { lv: '生活', q: '打雷時，為什麼不要在海邊玩水？', opts: ['海水會變冷', '海水溶有鹽，可以導電', '會被浪打到', '魚會咬人'], a: 1, why: '海水可以導電，打雷時很危險。' },
    ],
  };
  // 點圖題答案可以是同一類中的任一瓶
  window.LESSONS.u3b.quiz.forEach((q) => { if (q.alt) q.accept = q.alt; });
})();
