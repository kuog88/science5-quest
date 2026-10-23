// 單元一 太陽與光
(function () {
  const { hot } = window.H;

  // ---------------- 一-1 太陽在天空中的位置變化 ----------------
  // 觀察者面向南方：東在左、西在右、南在前（下）、北在後（上）
  const sunSVG = `<svg viewBox="0 0 600 480" role="img" aria-label="一天中太陽位置與竿影的變化">
    <defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f0"/><stop offset="1" stop-color="#eef6f0"/></linearGradient></defs>
    <rect width="600" height="480" fill="url(#skyG)"/>
    <path id="arcSummer" d="M60 380 Q300 -170 540 380" fill="none" stroke="var(--sunc)" stroke-width="2" stroke-dasharray="6 8" opacity=".5"/>
    <path id="arcAutumn" d="M60 380 Q300 -40 540 380" fill="none" stroke="var(--sunc)" stroke-width="3" stroke-dasharray="6 8" opacity=".8"/>
    <path id="arcWinter" d="M60 380 Q300 110 540 380" fill="none" stroke="var(--sunc)" stroke-width="2" stroke-dasharray="6 8" opacity=".5"/>
    <ellipse cx="300" cy="390" rx="270" ry="70" fill="#cfe0bf" stroke="#98bd86" stroke-width="3"/>
    <g class="lbl" style="font-size:22px"><text x="18" y="398">東</text><text x="562" y="398">西</text><text x="290" y="476">南</text><text x="290" y="336">北</text></g>
    <line id="shadowLine" x1="300" y1="390" x2="380" y2="380" stroke="#5d6b5a" stroke-width="10" stroke-linecap="round" opacity=".55"/>
    <rect x="295" y="300" width="10" height="90" rx="3" fill="var(--wood)"/>
    <g id="sunDot" transform="translate(130 200)"><circle r="30" fill="var(--sunc)"/><circle r="40" fill="var(--sunc)" opacity=".25"/></g>
    <path id="altArc" d="" fill="none" stroke="var(--acid)" stroke-width="3"/>
    ${hot('rise', 70, 330, '--fruit', '日出', 30, 300)}
    ${hot('noon', 300, 120, '--sunc', '中午', 330, 112)}
    ${hot('set', 530, 330, '--root', '日落', 500, 300)}
    ${hot('shadow', 380, 420, '--metal', '竿影', 400, 452)}
    ${hot('angle', 230, 360, '--acid', '高度角', 110, 368)}
  </svg>`;

  const SEASONS = { summer: { name: '夏天（夏至）', noon: 88, rise: 65 }, autumn: { name: '春分、秋分', noon: 67, rise: 90 }, winter: { name: '冬天（冬至）', noon: 44, rise: 115 } };
  let sunState = { t: 9, season: 'autumn' };
  function sunAt(t, s) {
    const S = SEASONS[s], f = (t - 6) / 12;              // 0 = 日出，1 = 日落
    const az = f <= 0.5 ? S.rise + (180 - S.rise) * (f / 0.5) : 180 + (180 - S.rise) * ((f - 0.5) / 0.5);
    const alt = Math.max(0, S.noon * Math.sin(Math.PI * f));
    return { az, alt };
  }
  const dirName = (az) => ['北', '東北', '東', '東南', '南', '西南', '西', '西北'][Math.round(((az % 360) + 360) % 360 / 45) % 8];
  function drawSun(stage) {
    const { t, season } = sunState, { az, alt } = sunAt(t, season), r = Math.PI / 180;
    const x = 300 - 240 * Math.sin(az * r), y = 380 - (alt / 90) * 300;
    stage.querySelector('#sunDot').setAttribute('transform', `translate(${x} ${y})`);
    const len = alt < 3 ? 0 : Math.min(230, 90 / Math.tan(alt * r)), d = (az + 180) * r;
    stage.querySelector('#shadowLine').setAttribute('x2', 300 - Math.sin(d) * len);
    stage.querySelector('#shadowLine').setAttribute('y2', 390 - Math.cos(d) * len * 0.3);
    ['Summer', 'Autumn', 'Winter'].forEach((k) => stage.querySelector('#arc' + k).setAttribute('opacity', k.toLowerCase() === season ? '.9' : '.25'));
    const hh = Math.floor(t), mm = Math.round((t - hh) * 60);
    const ro = stage.parentElement.parentElement.querySelector('#sunRead');
    if (ro) ro.innerHTML = `🕘 ${hh}:${String(mm).padStart(2, '0')}　太陽在<b>${dirName(az)}</b>方　高度角約 <b>${Math.round(alt)}°</b><br>竿影在<b>${dirName(az + 180)}</b>邊，${alt < 3 ? '太陽剛出來或快下山' : len < 40 ? '影子<b>很短</b>' : len < 110 ? '影子中等' : '影子<b>很長</b>'}`;
  }

  window.LESSONS.u1a = {
    id: 'u1a', no: '1', title: '太陽在天空中的位置變化', weeks: '1–2', clip: 'sky',
    intro: '太陽每天從東邊升起、西邊落下。拉動時間看看，太陽走到哪裡，竿子的影子就跑到哪裡。',
    svg: sunSVG,
    hint: '拉下面的時間軸，看太陽和竿影怎麼變。點圖上的圓點，會跳出講解。',
    chips: ['rise', 'noon', 'set', 'shadow', 'angle'],
    widget(el, api) {
      el.innerHTML = `
        <label for="sunT" style="font-weight:800">拉動時間：</label>
        <input id="sunT" type="range" min="6" max="18" step="0.25" value="${sunState.t}" style="width:100%">
        <div class="ctrl" style="margin:8px 0">${Object.entries(SEASONS).map(([k, v]) => `<button class="seg ${k === sunState.season ? 'on' : ''}" data-season="${k}">${v.name}</button>`).join('')}</div>
        <div class="readout" id="sunRead"></div>`;
      const stage = api.svg;
      el.querySelector('#sunT').oninput = (e) => { sunState.t = +e.target.value; drawSun(stage); };
      el.querySelectorAll('[data-season]').forEach((b) => b.onclick = () => {
        sunState.season = b.dataset.season;
        el.querySelectorAll('[data-season]').forEach((x) => x.classList.toggle('on', x === b));
        drawSun(stage);
        api.say(b.dataset.season === 'summer' ? '夏天中午太陽很高，高度角大，影子很短。' : b.dataset.season === 'winter' ? '冬天中午太陽比較低，高度角小，影子比較長。' : '春分和秋分，太陽正東方升起、正西方落下。');
      });
      drawSun(stage);
    },
    actions: [
      { label: '☀️ 太陽走一天', sub: '從早上 6 點到晚上 6 點', c: '#c08a1e', wide: true, run(api) {
        const input = document.querySelector('#sunT');
        let t = 6;
        const step = () => { if (!document.body.contains(input)) return; sunState.t = t; input.value = t; drawSun(api.svg); t += 0.25; if (t <= 18) api.later(step, 120); };
        step();
        api.say('早上太陽從東方升起，影子在西邊而且很長。中午太陽在南方最高，影子最短。下午太陽往西邊移動，影子跑到東邊又變長了。');
      } },
    ],
    facts: [{ t: '影子和太陽', d: '影子永遠在太陽的「相反方向」', c: '--metal' }, { t: '中午', d: '太陽最高、高度角最大、影子最短', c: '--fruit' }],
    parts: {
      rise: { name: '日出', kind: '太陽的位置', c: '--fruit', say: '太陽從東方升起。剛升起時太陽很低，竿子的影子在西邊，而且非常長。夏天日出偏東北，冬天日出偏東南。', points: ['太陽從東方升起', '影子在西邊，又長又斜', '夏天偏東北、冬天偏東南升起'],
        art: `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffe7c2"/><rect y="150" width="320" height="50" fill="#cfe0bf"/><circle cx="40" cy="150" r="26" fill="var(--sunc)"><animate attributeName="cy" values="170;140" dur="3s" repeatCount="indefinite"/></circle><rect x="158" y="90" width="6" height="60" fill="var(--wood)"/><path d="M164 150 L300 158" stroke="#5d6b5a" stroke-width="8" opacity=".5"/></svg>` },
      noon: { name: '中午', kind: '太陽的位置', c: '--sunc', say: '中午的時候，太陽在南方的天空，是一天中最高的時候。這時候高度角最大，影子最短。', points: ['太陽在南方天空', '一天中最高，高度角最大', '影子最短'],
        art: `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#d8eef7"/><rect y="150" width="320" height="50" fill="#cfe0bf"/><circle cx="170" cy="40" r="26" fill="var(--sunc)"/><rect x="158" y="90" width="6" height="60" fill="var(--wood)"/><path d="M164 150 L176 154" stroke="#5d6b5a" stroke-width="8" opacity=".5"/></svg>` },
      set: { name: '日落', kind: '太陽的位置', c: '--root', say: '下午太陽慢慢往西邊移動，傍晚從西方落下。這時候影子在東邊，又變得很長。', points: ['太陽從西方落下', '影子在東邊，又變長', '一天中太陽大致：東 → 南 → 西'],
        art: `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#ffd6c2"/><rect y="150" width="320" height="50" fill="#cfe0bf"/><circle cx="280" cy="150" r="26" fill="var(--fruit)"><animate attributeName="cy" values="140;170" dur="3s" repeatCount="indefinite"/></circle><rect x="158" y="90" width="6" height="60" fill="var(--wood)"/><path d="M158 150 L20 158" stroke="#5d6b5a" stroke-width="8" opacity=".5"/></svg>` },
      shadow: { name: '竿影', kind: '影子', c: '--metal', say: '影子會出現在太陽的相反方向。太陽在東邊，影子就在西邊。所以看影子的方向，就能找到太陽在哪裡。太陽越高，影子越短。', points: ['影子在太陽的相反方向', '太陽越高，影子越短', '一天中影子方向：西 → 北 → 東'],
        art: `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#eef6f0"/><ellipse cx="160" cy="160" rx="140" ry="30" fill="#cfe0bf"/><rect x="156" y="80" width="8" height="80" fill="var(--wood)"/><line x1="160" y1="160" x2="290" y2="165" stroke="#5d6b5a" stroke-width="8" opacity=".5"><animate attributeName="x2" values="290;175;30" dur="4s" repeatCount="indefinite"/></line></svg>` },
      angle: { name: '高度角', kind: '怎麼量太陽', c: '--acid', say: '高度角是太陽和地面之間的角度。太陽越高，高度角越大。用自製的太陽觀測器，就能量出太陽的高度角，再用指北針找出太陽的方位。', points: ['太陽和地平線之間的角度', '太陽越高，高度角越大', '中午高度角最大'],
        art: `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#eef6f0"/><line x1="40" y1="170" x2="300" y2="170" stroke="var(--ink)" stroke-width="3"/><line x1="60" y1="170" x2="260" y2="50" stroke="var(--sunc)" stroke-width="4"/><circle cx="270" cy="44" r="18" fill="var(--sunc)"/><path d="M130 170 A70 70 0 0 0 120 134" fill="none" stroke="var(--acid)" stroke-width="4"/><text x="140" y="155" font-size="22" font-weight="800" fill="var(--acid)">角度</text></svg>` },
      compass: { name: '指北針', kind: '觀測工具', c: '--metal', say: '指北針的紅色指針會指向北方。對好北方以後，就能找出東、南、西，知道太陽在哪個方位。', points: ['紅色指針指向北方', '先轉動盤面，讓北對準指針', '就能讀出太陽的方位'],
        art: `<svg viewBox="0 0 160 110"><circle cx="80" cy="55" r="44" fill="var(--card)" stroke="var(--metal)" stroke-width="6"/><path d="M80 18 L90 55 L80 92 L70 55Z" fill="var(--metal)"/><path d="M80 18 L90 55 L70 55Z" fill="var(--acid)"/><circle cx="80" cy="55" r="5" fill="var(--ink)"/></svg>` },
      observer: { name: '太陽觀測器', kind: '觀測工具', c: '--fruit', say: '太陽觀測器可以量太陽的高度角。讓竿子的影子對準刻度，就能讀出角度。千萬不要直接用眼睛看太陽喔！', points: ['用影子讀出太陽的高度角', '同時用指北針看方位', '絕對不能直接看太陽'],
        art: `<svg viewBox="0 0 160 110"><path d="M20 90 A60 60 0 0 1 140 90Z" fill="var(--card)" stroke="var(--fruit)" stroke-width="3"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI - i * Math.PI / 6; return `<line x1="${80 + 50 * Math.cos(a)}" y1="${90 - 50 * Math.sin(a)}" x2="${80 + 58 * Math.cos(a)}" y2="${90 - 58 * Math.sin(a)}" stroke="var(--ink)" stroke-width="2"/>`; }).join('')}<line x1="80" y1="90" x2="80" y2="30" stroke="var(--wood)" stroke-width="5"/><line x1="80" y1="90" x2="120" y2="60" stroke="#5d6b5a" stroke-width="4" opacity=".6"/></svg>` },
      seasons: { name: '季節不同', kind: '太陽的變化', c: '--sunc', say: '不同季節，太陽在天空走的路線不一樣。夏天中午太陽比較高，白天比較長；冬天中午太陽比較低，白天比較短。日出和日落的位置也會改變。', points: ['夏天：中午太陽高、白天長', '冬天：中午太陽低、白天短', '日出、日落的位置也會變'],
        art: `<svg viewBox="0 0 160 110"><rect y="90" width="160" height="20" fill="#cfe0bf"/><path d="M10 90 Q80 -40 150 90" fill="none" stroke="var(--acid)" stroke-width="3" stroke-dasharray="5 5"/><path d="M20 90 Q80 30 140 90" fill="none" stroke="var(--base)" stroke-width="3" stroke-dasharray="5 5"/><circle cx="80" cy="25" r="9" fill="var(--sunc)"/><circle cx="80" cy="60" r="9" fill="var(--sunc)" opacity=".7"/></svg>` },
      sundial: { name: '日晷', kind: '生活應用', c: '--wood', say: '古時候沒有時鐘，人們用日晷看時間。因為太陽的位置一直在變，影子也跟著移動，看影子指到哪裡，就知道現在幾點。', points: ['利用影子的方向看時間', '太陽移動，影子跟著轉', '古人的時鐘'],
        art: `<svg viewBox="0 0 160 110"><ellipse cx="80" cy="70" rx="64" ry="28" fill="var(--card)" stroke="var(--wood)" stroke-width="4"/><path d="M80 70 L80 30 L100 70Z" fill="var(--wood)"/><line x1="80" y1="70" x2="40" y2="82" stroke="#5d6b5a" stroke-width="4" opacity=".6"/></svg>` },
    },
    drawers: [{ title: '觀測太陽的工具與生活', desc: '怎麼量太陽的位置？古人又怎麼用太陽看時間？', ids: ['compass', 'observer', 'seasons', 'sundial'] }],
    quiz: [
      { lv: '點圖', q: '在圖上點出「一天中太陽最高」的位置。', tap: 'noon', why: '中午太陽在南方天空，是一天中最高的時候。' },
      { lv: '點圖', q: '在圖上點出「太陽升起」的位置。', tap: 'rise', why: '太陽從東方升起。' },
      { lv: '記憶', q: '一天中，太陽在天空移動的方向大致是？', opts: ['東 → 南 → 西', '西 → 南 → 東', '北 → 東 → 南', '南 → 北 → 西'], a: 0, why: '太陽從東方升起，中午在南方，傍晚從西方落下。' },
      { lv: '理解', q: '早上 8 點，竿子的影子會在竿子的哪一邊？', opts: ['東邊', '西邊', '南邊', '沒有影子'], a: 1, why: '早上太陽在東邊，影子在太陽的相反方向，所以在西邊。' },
      { lv: '理解', q: '一天中什麼時候，竿子的影子最短？', opts: ['早上', '中午', '傍晚', '都一樣長'], a: 1, why: '中午太陽最高、高度角最大，影子最短。' },
      { lv: '理解', q: '太陽的高度角越大，影子會怎麼樣？', opts: ['越長', '越短', '不會改變', '變成兩個'], a: 1, why: '太陽越高，光線越直，影子就越短。' },
      { lv: '推理', q: '下午 3 點看到影子在竿子的東邊，太陽應該在哪個方向？', opts: ['東邊', '北邊', '西邊', '正上方'], a: 2, why: '影子和太陽在相反方向，影子在東，太陽就在西邊。' },
      { lv: '工具', q: '要知道太陽在哪個「方位」，要用什麼工具？', opts: ['溫度計', '指北針', '放大鏡', '量杯'], a: 1, why: '指北針找出北方，就能判斷太陽的方位。' },
      { lv: '安全', q: '觀察太陽時，下面哪個做法是對的？', opts: ['直接用眼睛看太陽', '用望遠鏡看太陽', '觀察影子來判斷太陽位置', '用放大鏡看太陽'], a: 2, why: '直接看太陽會傷害眼睛，要用影子或觀測器來觀察。' },
      { lv: '季節', q: '和冬天比，夏天中午的太陽怎麼樣？', opts: ['比較低，影子比較長', '比較高，影子比較短', '一樣高', '在北方地平線上'], a: 1, why: '夏天中午太陽比較高、高度角大，影子比較短。' },
      { lv: '季節', q: '冬天的白天比夏天怎麼樣？', opts: ['比較長', '比較短', '一樣長', '沒有白天'], a: 1, why: '冬天太陽在天空走的路線比較短，白天比較短。' },
      { lv: '生活', q: '古人用「日晷」看時間，是利用什麼原理？', opts: ['月亮的形狀', '影子會隨太陽位置移動', '風的方向', '水的流動'], a: 1, why: '太陽位置改變，影子也跟著移動，就能看出時間。' },
    ],
  };

  // ---------------- 一-2 認識光的現象與特性 ----------------
  const lightSVG = `<svg viewBox="0 0 600 460" role="img" aria-label="三稜鏡、水杯和放大鏡">
    <rect width="600" height="460" fill="#eef4f6"/>
    <circle cx="40" cy="40" r="26" fill="var(--sunc)"/>
    <line x1="60" y1="60" x2="150" y2="120" stroke="var(--sunc)" stroke-width="6"/>
    <path d="M140 170 L200 70 L260 170Z" fill="#dbeef7" stroke="var(--sky-dark)" stroke-width="4" opacity=".9"/>
    <g id="spectrum">${['#e0566b', '#ef8f3a', '#f2cd3b', '#5aa86a', '#3a86d0', '#4a5cc0', '#8b6fc0'].map((c, i) => `<path d="M228 120 L380 ${70 + i * 14} L380 ${84 + i * 14}Z" fill="${c}" opacity=".85"/>`).join('')}</g>
    <rect x="380" y="60" width="14" height="120" fill="var(--card)" stroke="var(--line)"/>
    <!-- 水杯和吸管 -->
    <path d="M80 250 L100 420 L220 420 L240 250" fill="#cfe8f6" stroke="var(--sky-dark)" stroke-width="4"/>
    <rect x="86" y="300" width="148" height="4" fill="var(--sky-dark)" opacity=".4"/>
    <line x1="120" y1="230" x2="160" y2="302" stroke="var(--acid)" stroke-width="10" stroke-linecap="round"/>
    <line x1="160" y1="302" x2="210" y2="400" stroke="var(--acid)" stroke-width="10" stroke-linecap="round" opacity=".8"/>
    <g id="refrRay" opacity="0"><line x1="60" y1="230" x2="150" y2="302" stroke="var(--sunc)" stroke-width="5"/><line x1="150" y1="302" x2="190" y2="410" stroke="var(--sunc)" stroke-width="5"/><line x1="150" y1="302" x2="230" y2="366" stroke="var(--sunc)" stroke-width="2" stroke-dasharray="6 6"/></g>
    <!-- 放大鏡 -->
    <g id="lensRays" stroke="var(--sunc)" stroke-width="3"><line x1="380" y1="230" x2="380" y2="290"/><line x1="430" y1="230" x2="430" y2="290"/><line x1="480" y1="230" x2="480" y2="290"/><line x1="530" y1="230" x2="530" y2="290"/>
      <line class="cv" x1="380" y1="300" x2="455" y2="400"/><line class="cv" x1="430" y1="300" x2="455" y2="400"/><line class="cv" x1="480" y1="300" x2="455" y2="400"/><line class="cv" x1="530" y1="300" x2="455" y2="400"/></g>
    <ellipse cx="455" cy="296" rx="90" ry="14" fill="#dbeef7" stroke="var(--sky-dark)" stroke-width="4"/>
    <path d="M545 296 L590 330" stroke="var(--wood)" stroke-width="10" stroke-linecap="round"/>
    <rect x="360" y="400" width="190" height="20" fill="var(--card)" stroke="var(--line)"/>
    <circle id="spot" cx="455" cy="400" r="6" fill="var(--fruit)"/>
    ${hot('prism', 200, 140, '--neutral', '三稜鏡', 120, 205)}
    ${hot('spectrum', 330, 110, '--acid', '色光', 400, 210)}
    ${hot('straw', 160, 340, '--water', '折射', 20, 450)}
    ${hot('lens', 455, 296, '--sky-dark', '放大鏡', 470, 270)}
    ${hot('focus', 455, 400, '--fruit', '聚光', 470, 445)}
  </svg>`;

  window.LESSONS.u1b = {
    id: 'u1b', no: '2', title: '認識光的現象與特性', weeks: '3–4', clip: 'rainbow',
    intro: '陽光看起來是白色的，其實藏著好多顏色。光碰到水、玻璃時還會轉彎，放大鏡更能把光聚在一起。',
    svg: lightSVG,
    chips: ['prism', 'spectrum', 'straw', 'lens', 'focus'],
    widget(el, api) {
      el.innerHTML = `<label for="lensD" style="font-weight:800">移動放大鏡和紙的距離：</label>
        <input id="lensD" type="range" min="0" max="100" value="30" style="width:100%">
        <div class="readout" id="lensRead"></div>`;
      const draw = (v) => {
        // 50 是剛好聚焦的位置
        const off = Math.abs(v - 50), r = 4 + off * 0.9;
        const spot = api.svg.querySelector('#spot');
        spot.setAttribute('r', r); spot.setAttribute('opacity', Math.max(0.25, 1 - off / 60));
        api.svg.querySelectorAll('#lensRays .cv').forEach((l, i) => { l.setAttribute('x2', 455 + (i - 1.5) * off * 0.9); l.setAttribute('y2', 400); });
        el.querySelector('#lensRead').innerHTML = off < 8 ? '🔥 光點<b>最小最亮</b>：光都聚在一點，溫度很高！' : `光點比較大、比較暗（${v < 50 ? '太近' : '太遠'}）`;
      };
      el.querySelector('#lensD').oninput = (e) => draw(+e.target.value);
      draw(30);
    },
    actions: [
      { label: '💧 光線進入水', sub: '看光怎麼轉彎', c: '#3a86d0', run(api) {
        const g = api.svg.querySelector('#refrRay'); g.setAttribute('opacity', '1');
        api.later(() => g.setAttribute('opacity', '0'), 6000);
        api.say('光從空氣斜斜的射進水裡，前進的路線會偏折，這就是光的折射。所以水裡的吸管看起來像是折斷了。');
      } },
      { label: '🌈 分出色光', sub: '陽光穿過三稜鏡', c: '#8b6fc0', run(api) {
        const s = api.svg.querySelector('#spectrum');
        s.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1200 });
        api.say('陽光穿過三稜鏡會折射，分出紅、橙、黃、綠、藍、靛、紫等不同顏色的光。原來陽光是由很多種色光組成的。');
      } },
    ],
    facts: [{ t: '直線前進', d: '光在同一種東西裡走直線', c: '--sunc' }, { t: '折射', d: '光斜斜進入不同東西時會轉彎', c: '--water' }],
    parts: {
      prism: { name: '三稜鏡', kind: '光的折射', c: '--neutral', say: '三稜鏡是一塊三角形的玻璃。陽光穿過三稜鏡時會折射，而且不同顏色的光轉彎的程度不一樣，所以就被分開了。', points: ['三角形的透明玻璃', '光穿過時會折射', '把陽光分成不同的色光'],
        art: `<svg viewBox="0 0 320 200"><line x1="0" y1="80" x2="120" y2="100" stroke="var(--sunc)" stroke-width="6"/><path d="M90 170 L150 40 L210 170Z" fill="#dbeef7" stroke="var(--sky-dark)" stroke-width="4"/>${['#e0566b', '#ef8f3a', '#f2cd3b', '#5aa86a', '#3a86d0', '#8b6fc0'].map((c, i) => `<path d="M180 110 L320 ${60 + i * 16} L320 ${76 + i * 16}Z" fill="${c}"/>`).join('')}</svg>` },
      spectrum: { name: '色光', kind: '陽光的秘密', c: '--acid', say: '陽光看起來是白色的，其實是由紅、橙、黃、綠、藍、靛、紫很多種色光混合而成的。', points: ['陽光由很多種色光組成', '紅、橙、黃、綠、藍、靛、紫', '彩虹也是陽光被分開的色光'],
        art: `<svg viewBox="0 0 320 200">${['#e0566b', '#ef8f3a', '#f2cd3b', '#5aa86a', '#3a86d0', '#4a5cc0', '#8b6fc0'].map((c, i) => `<rect x="${20 + i * 40}" y="40" width="36" height="120" rx="8" fill="${c}"/>`).join('')}</svg>` },
      straw: { name: '折射', kind: '光的折射', c: '--water', say: '光從空氣斜斜進入水裡，或從水裡進入空氣，前進路線會偏折，這叫做折射。所以插在水裡的吸管，看起來像在水面折斷了。如果光是垂直射進去，就不會偏折。', points: ['光斜射進入不同東西時會偏折', '水裡的吸管看起來折斷了', '垂直射入就不會偏折'],
        art: `<svg viewBox="0 0 320 200"><rect x="40" y="80" width="240" height="110" fill="#cfe8f6"/><line x1="40" y1="80" x2="280" y2="80" stroke="var(--sky-dark)" stroke-width="3"/><line x1="80" y1="10" x2="160" y2="80" stroke="var(--acid)" stroke-width="10" stroke-linecap="round"/><line x1="160" y1="80" x2="200" y2="180" stroke="var(--acid)" stroke-width="10" stroke-linecap="round"/></svg>` },
      lens: { name: '放大鏡', kind: '凸透鏡', c: '--sky-dark', say: '放大鏡是中間厚、邊緣薄的凸透鏡。靠近東西看，可以看到正立放大的樣子；離遠一點看，東西會變成上下顛倒。', points: ['中間厚、邊緣薄的凸透鏡', '靠近看：正立、放大', '遠一點看：上下顛倒'],
        art: `<svg viewBox="0 0 320 200"><circle cx="140" cy="90" r="70" fill="#dbeef7" stroke="var(--sky-dark)" stroke-width="8"/><path d="M190 140 L270 190" stroke="var(--wood)" stroke-width="16" stroke-linecap="round"/><text x="105" y="112" font-size="64" font-weight="800" fill="var(--ink)">大</text></svg>` },
      focus: { name: '聚光', kind: '凸透鏡', c: '--fruit', say: '放大鏡可以把陽光聚在一點，這一點又亮又熱，甚至能把紙燒焦。所以不可以用放大鏡看太陽，也不能拿來照人。', points: ['把陽光聚成一個小亮點', '亮點很熱，可能燒焦紙', '不可用放大鏡看太陽、照人'],
        art: `<svg viewBox="0 0 320 200"><ellipse cx="160" cy="70" rx="100" ry="16" fill="#dbeef7" stroke="var(--sky-dark)" stroke-width="4"/>${[-75, -25, 25, 75].map((d) => `<line x1="${160 + d}" y1="0" x2="${160 + d}" y2="60" stroke="var(--sunc)" stroke-width="3"/><line x1="${160 + d}" y1="80" x2="160" y2="170" stroke="var(--sunc)" stroke-width="3"/>`).join('')}<rect x="60" y="170" width="200" height="20" fill="var(--card)"/><circle cx="160" cy="170" r="6" fill="var(--acid)"><animate attributeName="r" values="4;9;4" dur="1.2s" repeatCount="indefinite"/></circle></svg>` },
      rainbow: { name: '彩虹', kind: '生活中的光', c: '--neutral', say: '下過雨後，空氣中有很多小水滴。陽光穿過小水滴會折射，分出不同的色光，就形成了彩虹。看彩虹時，太陽通常在你的背後。', points: ['陽光穿過小水滴而折射', '分出不同色光', '太陽在背後時比較容易看到'],
        art: `<svg viewBox="0 0 160 110">${['#e0566b', '#ef8f3a', '#f2cd3b', '#5aa86a', '#3a86d0', '#8b6fc0'].map((c, i) => `<path d="M${15 + i * 6} 100 A${65 - i * 6} ${65 - i * 6} 0 0 1 ${145 - i * 6} 100" fill="none" stroke="${c}" stroke-width="6"/>`).join('')}</svg>` },
      pool: { name: '游泳池變淺', kind: '生活中的光', c: '--water', say: '從岸上看游泳池，水看起來比較淺，其實比看起來還深。這也是光的折射造成的，所以下水前要先確認水深。', points: ['光從水裡到空氣中會偏折', '池底看起來比較淺', '下水前要確認水深'],
        art: `<svg viewBox="0 0 160 110"><rect x="10" y="30" width="140" height="70" fill="#cfe8f6"/><line x1="10" y1="100" x2="150" y2="100" stroke="var(--sky-dark)" stroke-width="4"/><line x1="10" y1="80" x2="150" y2="80" stroke="var(--sky-dark)" stroke-width="2" stroke-dasharray="5 5"/></svg>` },
      chopstick: { name: '水中的筷子', kind: '生活中的光', c: '--wood', say: '把筷子斜斜放進裝水的碗裡，筷子看起來在水面的地方彎折了。拿出來一看，筷子還是直的，這是光的折射。', points: ['筷子在水面處好像折斷', '拿出來還是直的', '光的折射讓眼睛看錯位置'],
        art: `<svg viewBox="0 0 160 110"><path d="M20 50 Q80 110 140 50Z" fill="#cfe8f6"/><line x1="30" y1="10" x2="80" y2="50" stroke="var(--wood)" stroke-width="6"/><line x1="80" y1="50" x2="100" y2="90" stroke="var(--wood)" stroke-width="6"/></svg>` },
      magnify: { name: '看見放大的字', kind: '生活中的光', c: '--sky-dark', say: '把放大鏡靠近書本，字會變大而且是正的。老花眼鏡、顯微鏡、相機鏡頭，都用到凸透鏡。', points: ['靠近看到正立放大的字', '老花眼鏡也是凸透鏡', '顯微鏡、相機也會用到'],
        art: `<svg viewBox="0 0 160 110"><circle cx="70" cy="50" r="36" fill="#dbeef7" stroke="var(--sky-dark)" stroke-width="6"/><path d="M96 76 L140 104" stroke="var(--wood)" stroke-width="9" stroke-linecap="round"/><text x="50" y="64" font-size="38" font-weight="800" fill="var(--ink)">字</text></svg>` },
    },
    drawers: [{ title: '生活中的光', desc: '折射和凸透鏡，就藏在我們身邊。', ids: ['rainbow', 'pool', 'chopstick', 'magnify'] }],
    quiz: [
      { lv: '點圖', q: '在圖上點出「把陽光分成很多顏色」的東西。', tap: 'prism', why: '陽光穿過三稜鏡折射，會分出不同色光。' },
      { lv: '點圖', q: '在圖上點出「可以把陽光聚在一點」的東西。', tap: 'lens', why: '放大鏡是凸透鏡，可以聚光。' },
      { lv: '記憶', q: '陽光是由什麼組成的？', opts: ['只有白色的光', '很多種不同顏色的光', '只有黃色的光', '黑色的光'], a: 1, why: '陽光由紅、橙、黃、綠、藍、靛、紫等色光組成。' },
      { lv: '理解', q: '吸管插在水杯裡，看起來在水面處折斷，這是因為？', opts: ['吸管真的斷了', '光的折射', '水把吸管吸彎', '光的反射'], a: 1, why: '光從水進入空氣時偏折，讓我們看錯位置。' },
      { lv: '理解', q: '光在什麼情況下前進路線「不會」偏折？', opts: ['斜斜射進水裡', '垂直射進水裡', '穿過三稜鏡', '穿過放大鏡邊緣'], a: 1, why: '光垂直射入時，前進方向不會改變。' },
      { lv: '安全', q: '使用放大鏡時，下面哪個做法「不可以」？', opts: ['看書上的字', '觀察昆蟲', '用放大鏡看太陽', '看樹葉的葉脈'], a: 2, why: '放大鏡會聚光，看太陽會嚴重傷害眼睛。' },
      { lv: '推理', q: '用放大鏡把陽光聚在紙上，什麼時候紙最容易燒焦？', opts: ['光點最大的時候', '光點最小最亮的時候', '陰天的時候', '放大鏡離紙最遠的時候'], a: 1, why: '光點最小時，光都集中在一點，溫度最高。' },
      { lv: '生活', q: '雨後出現彩虹，是因為陽光穿過了什麼？', opts: ['雲裡的小冰塊', '空氣中的小水滴', '樹葉', '鳥的羽毛'], a: 1, why: '陽光穿過小水滴會折射，分出色光形成彩虹。' },
      { lv: '生活', q: '從岸上看游泳池，池水看起來比實際怎麼樣？', opts: ['比較深', '比較淺', '一樣', '變成彩色'], a: 1, why: '光的折射讓池底看起來比較淺，下水要小心。' },
      { lv: '記憶', q: '放大鏡是哪一種透鏡？', opts: ['中間薄、邊緣厚', '中間厚、邊緣薄', '平平的玻璃', '黑色的鏡子'], a: 1, why: '放大鏡是中間厚、邊緣薄的凸透鏡。' },
      { lv: '理解', q: '把放大鏡靠近書本看字，字會怎麼樣？', opts: ['正立變大', '上下顛倒變小', '消失不見', '變成彩色'], a: 0, why: '靠近看時，可以看到正立放大的像。' },
    ],
  };
})();
