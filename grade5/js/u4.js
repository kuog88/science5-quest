// 單元四 力與運動
(function () {
  const { hot } = window.H;

  // ---------------- 四-1 力的測量 ----------------
  const springSVG = `<svg viewBox="0 0 600 480" role="img" aria-label="彈簧掛砝碼的實驗">
    <rect width="600" height="480" fill="#f1eee6"/>
    <rect x="60" y="440" width="300" height="20" rx="4" fill="var(--wood)"/>
    <rect x="90" y="40" width="14" height="410" fill="var(--wood)"/>
    <rect x="90" y="40" width="220" height="14" fill="var(--wood)"/>
    <g id="ruler"><rect x="320" y="70" width="40" height="360" fill="#fff8dc" stroke="var(--line)" stroke-width="2"/>
      ${Array.from({ length: 19 }, (_, i) => `<line x1="320" y1="${80 + i * 20}" x2="${i % 5 === 0 ? 342 : 332}" y2="${80 + i * 20}" stroke="var(--ink)" stroke-width="2"/>${i % 5 === 0 ? `<text x="344" y="${86 + i * 20}" font-size="13" fill="var(--ink)">${i * 2}</text>` : ''}`).join('')}</g>
    <path id="springPath" d="" fill="none" stroke="var(--metal)" stroke-width="5"/>
    <g id="weights"></g>
    <line id="pointer" x1="250" y1="120" x2="322" y2="120" stroke="var(--acid)" stroke-width="3" stroke-dasharray="6 4"/>
    <g id="springScale" transform="translate(440 70)"><rect x="0" y="0" width="80" height="260" rx="20" fill="var(--card)" stroke="var(--metal)" stroke-width="4"/>
      <circle cx="40" cy="-10" r="12" fill="none" stroke="var(--metal)" stroke-width="5"/>
      <rect x="28" y="30" width="24" height="180" fill="#fff8dc" stroke="var(--line)"/>${Array.from({ length: 10 }, (_, i) => `<line x1="28" y1="${40 + i * 18}" x2="40" y2="${40 + i * 18}" stroke="var(--ink)"/>`).join('')}
      <rect x="20" y="90" width="40" height="8" rx="3" fill="var(--acid)"/>
      <path d="M40 260 V290 q0 14 -12 14" stroke="var(--metal)" stroke-width="5" fill="none"/></g>
    ${hot('spring', 220, 140, '--metal', '彈簧', 130, 100)}
    ${hot('weight', 220, 330, '--root', '砝碼', 130, 320)}
    ${hot('ruler', 340, 420, '--fruit', '伸長量', 250, 470)}
    ${hot('scale', 480, 160, '--acid', '彈簧秤', 470, 400)}
  </svg>`;
  let wt = 0, stretched = 0; // stretched：超過彈性限度後留下的變形
  function drawSpring(stage) {
    const LIMIT = 5, ext = Math.min(wt, 8) * 20 + stretched;       // 每個砝碼伸長 2 公分（畫面 20px）
    const top = 54, len = 66 + ext, coils = 12;
    let d = `M220 ${top}`;
    for (let i = 1; i <= coils; i++) d += ` L${i % 2 ? 196 : 244} ${top + (len * i) / coils}`;
    d += ` L220 ${top + len + 10}`;
    stage.querySelector('#springPath').setAttribute('d', d);
    const y = top + len + 10;
    stage.querySelector('#weights').innerHTML = Array.from({ length: wt }, (_, i) => `<rect x="196" y="${y + i * 24}" width="48" height="22" rx="4" fill="var(--root)" stroke="#7a3f12"/>`).join('');
    stage.querySelector('#pointer').setAttribute('y1', y); stage.querySelector('#pointer').setAttribute('y2', y);
    const cm = Math.round((ext / 10)) ;
    const ro = document.querySelector('#springRead');
    if (ro) ro.innerHTML = `掛了 <b>${wt}</b> 個砝碼（每個 10 g）　彈簧伸長 <b>${cm}</b> 公分<br>${wt > LIMIT ? '⚠️ 超過<b>彈性限度</b>了！拿下砝碼也回不去原來長度' : stretched ? '⚠️ 彈簧被拉壞了，回不到原本的長度' : wt ? '砝碼數變 2 倍，伸長量也變 2 倍' : '彈簧是原來的長度'}`;
  }
  window.LESSONS.u4a = {
    id: 'u4a', no: '1', title: '力的測量', weeks: '16–17', clip: 'sports',
    intro: '彈簧被拉會變長，放手又會彈回去。掛上砝碼看看，掛越多，彈簧就伸越長嗎？',
    svg: springSVG,
    chips: ['spring', 'weight', 'ruler', 'scale'],
    widget(el, api) {
      el.innerHTML = `<div class="ctrl"><button class="seg" id="addW">＋ 掛一個砝碼</button><button class="seg" id="subW">－ 拿下一個</button><button class="seg" id="newS">換新彈簧</button></div><div class="readout" id="springRead" style="margin-top:8px"></div>`;
      el.querySelector('#addW').onclick = () => { if (wt >= 8) return; wt++; api.sfx.tap(); drawSpring(api.svg); if (wt === 6) api.say('超過彈性限度了！彈簧被拉得太長，拿掉砝碼也回不去了。'); };
      el.querySelector('#subW').onclick = () => { if (!wt) return; if (wt > 5) stretched = 30; wt--; api.sfx.tap(); drawSpring(api.svg); };
      el.querySelector('#newS').onclick = () => { wt = 0; stretched = 0; drawSpring(api.svg); };
      drawSpring(api.svg);
    },
    actions: [
      { label: '🪢 拔河比賽', sub: '兩個力方向相反', c: '#c77d70', run(api) { const b = document.querySelector('.drawer[data-part="tug"]'); if (b) b.click(); } },
      { label: '🧲 不用碰也有力', sub: '磁力、地球引力', c: '#7aa9c0', run(api) { const b = document.querySelector('.drawer[data-part="magnet"]'); if (b) b.click(); } },
    ],
    facts: [{ t: '越重伸越長', d: '彈性限度內，砝碼數變 2 倍，伸長量也變 2 倍', c: '--metal' }, { t: '重量', d: '地球吸引物體的力', c: '--root' }],
    parts: {
      spring: { name: '彈簧', kind: '有彈性的物體', c: '--metal', say: '彈簧受到拉力會變長，拉力拿走後會恢復原狀，這就是彈性。在彈性限度內，掛的重量越重，彈簧伸得越長，而且砝碼數變成 2 倍，伸長量也變成 2 倍。', points: ['受力會變形，放開會恢復', '重量越重，伸長越多', '每多掛 1 個砝碼，就多伸長一樣長'],
        art: `<svg viewBox="0 0 320 200"><path d="M160 10 L140 25 L180 40 L140 55 L180 70 L140 85 L180 100 L160 115" fill="none" stroke="var(--metal)" stroke-width="6"><animateTransform attributeName="transform" type="scale" values="1 1;1 1.4;1 1" dur="2s" repeatCount="indefinite"/></path></svg>` },
      weight: { name: '砝碼', kind: '已知重量的物體', c: '--root', say: '砝碼是知道重量的金屬塊。掛一個、兩個、三個砝碼，比較彈簧伸長了多少，就能找出重量和伸長量的關係。', points: ['重量已知，用來做實驗', '一個一個加，記錄伸長量', '重量就是地球對物體的引力'],
        art: `<svg viewBox="0 0 320 200">${[0, 1, 2].map((i) => `<rect x="${70 + i * 70}" y="${120 - i * 30}" width="50" height="${40 + i * 30}" rx="6" fill="var(--root)"/>`).join('')}</svg>` },
      ruler: { name: '伸長量', kind: '怎麼量', c: '--fruit', say: '伸長量是彈簧變長了多少，等於掛上砝碼後的長度，減掉原來的長度。量的時候眼睛要和刻度平平的看。', points: ['伸長量 ＝ 現在長度 － 原來長度', '眼睛要和刻度平視', '多量幾次比較準確'],
        art: `<svg viewBox="0 0 320 200"><rect x="140" y="20" width="40" height="170" fill="#fff8dc" stroke="var(--line)"/>${Array.from({ length: 9 }, (_, i) => `<line x1="140" y1="${30 + i * 20}" x2="160" y2="${30 + i * 20}" stroke="var(--ink)" stroke-width="2"/>`).join('')}<circle cx="80" cy="110" r="14" fill="var(--card)" stroke="var(--ink)" stroke-width="3"/><line x1="96" y1="110" x2="140" y2="110" stroke="var(--acid)" stroke-dasharray="5 5" stroke-width="3"/></svg>` },
      scale: { name: '彈簧秤', kind: '量力的工具', c: '--acid', say: '彈簧秤就是利用彈簧受力伸長的原理做成的。使用前要先歸零，拉的時候要和彈簧秤保持在同一直線上，讀刻度時眼睛要平視指針。', points: ['利用彈簧伸長量來量力', '用前先歸零', '直線拉、平視讀刻度'],
        art: `<svg viewBox="0 0 320 200"><rect x="120" y="10" width="80" height="160" rx="20" fill="var(--card)" stroke="var(--metal)" stroke-width="4"/><rect x="146" y="30" width="28" height="120" fill="#fff8dc"/><rect x="138" y="80" width="44" height="8" rx="3" fill="var(--acid)"/><path d="M160 170 V190" stroke="var(--metal)" stroke-width="5"/></svg>` },
      limit: { name: '彈性限度', kind: '彈簧的極限', c: '--acid', say: '彈簧能承受的最大力量叫做彈性限度。拉力超過彈性限度，彈簧就會變形，放開後回不到原來的長度。', points: ['彈簧能承受的最大力量', '超過就回不到原狀', '不要掛太重的東西'],
        art: `<svg viewBox="0 0 160 110"><path d="M40 10 L30 20 L50 30 L30 40 L50 50 L40 60" fill="none" stroke="var(--metal)" stroke-width="4"/><path d="M110 10 L100 30 L120 50 L100 70 L120 90 L110 105" fill="none" stroke="var(--acid)" stroke-width="4"/></svg>` },
      fatigue: { name: '彈性疲乏', kind: '用太久的彈簧', c: '--muted', say: '就算沒有超過彈性限度，如果彈簧被拉住太久，也可能回不去原來的樣子，這叫做彈性疲乏。像橡皮筋綁太久會鬆掉。', points: ['受力時間太長也會變形', '例子：綁太久的橡皮筋', '用完要讓它恢復原狀'],
        art: `<svg viewBox="0 0 160 110"><ellipse cx="80" cy="55" rx="60" ry="30" fill="none" stroke="var(--fruit)" stroke-width="6"/><ellipse cx="80" cy="55" rx="40" ry="14" fill="none" stroke="var(--fruit)" stroke-width="3" opacity=".5"/></svg>` },
      tug: { name: '拔河比賽', kind: '兩個力', c: '--rose-dark', say: '兩隊拔河，兩個拉力方向相反。力量大的一方，繩子就往那邊移動；兩邊力量一樣大的時候，繩子就停著不動，這叫做力的平衡。', points: ['兩個力在同一直線、方向相反', '力大的那邊贏，物體往那邊移動', '兩邊一樣大，靜止不動（平衡）'],
        art: `<svg viewBox="0 0 160 110"><line x1="10" y1="60" x2="150" y2="60" stroke="var(--wood)" stroke-width="5"/><circle cx="25" cy="45" r="10" fill="var(--rose)"/><circle cx="135" cy="45" r="10" fill="var(--sky)"/><rect x="76" y="50" width="8" height="20" fill="var(--acid)"/><path d="M60 90 h-30 M30 90 l8 -6 M30 90 l8 6 M100 90 h30 M130 90 l-8 -6 M130 90 l-8 6" stroke="var(--ink)" stroke-width="3"/></svg>` },
      magnet: { name: '不接觸的力', kind: '磁力、地球引力', c: '--sky-dark', say: '有些力不用碰到也有作用。磁鐵不用碰到迴紋針就能把它吸過來；地球也會吸引所有東西，所以東西會往下掉，地球對物體的引力就是物體的重量。', points: ['磁力：不碰到也能吸鐵', '地球引力讓東西往下掉', '地球引力 ＝ 物體的重量'],
        art: `<svg viewBox="0 0 160 110"><path d="M30 20 v40 a30 30 0 0 0 60 0 v-40 h-18 v40 a12 12 0 0 1 -24 0 v-40Z" fill="var(--acid)"/><rect x="30" y="20" width="18" height="14" fill="var(--metal)"/><rect x="72" y="20" width="18" height="14" fill="var(--metal)"/><path d="M120 70 q10 -20 20 0 q-10 20 -20 0" fill="none" stroke="var(--metal)" stroke-width="3"/></svg>` },
      tools: { name: '生活中的彈簧', kind: '生活應用', c: '--metal', say: '原子筆、彈簧床、釘書機、腳踏車座墊裡面都有彈簧，利用彈簧可以恢復原狀的特性。', points: ['原子筆、釘書機', '彈簧床、座墊', '利用彈性讓東西彈回來'],
        art: `<svg viewBox="0 0 160 110"><rect x="20" y="48" width="120" height="14" rx="7" fill="var(--sky)"/><path d="M60 55 l6 -8 l6 16 l6 -16 l6 16 l6 -8" stroke="var(--metal)" stroke-width="3" fill="none"/></svg>` },
    },
    drawers: [{ title: '更多力的秘密', desc: '彈簧的極限、兩個力的比賽、還有不用碰也有的力。', ids: ['limit', 'fatigue', 'tug', 'magnet', 'tools'] }],
    quiz: [
      { lv: '點圖', q: '在圖上點出「用來測量力的大小」的工具。', tap: 'scale', why: '彈簧秤利用彈簧伸長量來測量力。' },
      { lv: '推理', q: '掛 1 個砝碼，彈簧伸長 2 公分；在彈性限度內掛 3 個，會伸長幾公分？', opts: ['2 公分', '4 公分', '6 公分', '8 公分'], a: 2, why: '每掛 1 個砝碼伸長 2 公分，掛 3 個就是 3 × 2 ＝ 6 公分。' },
      { lv: '理解', q: '什麼是「彈性限度」？', opts: ['彈簧的長度', '彈簧能承受的最大力量', '彈簧的顏色', '砝碼的重量'], a: 1, why: '超過彈性限度，彈簧就回不到原狀。' },
      { lv: '理解', q: '橡皮筋綁東西綁太久，變得鬆鬆的回不去，這叫做？', opts: ['彈性限度', '彈性疲乏', '摩擦力', '磁力'], a: 1, why: '受力時間太長，也會無法恢復原狀，叫彈性疲乏。' },
      { lv: '操作', q: '使用彈簧秤之前，第一步要做什麼？', opts: ['用力拉一下', '歸零', '掛最重的東西', '放進水裡'], a: 1, why: '先歸零，量出來的數字才準確。' },
      { lv: '操作', q: '讀彈簧秤刻度時，眼睛應該怎麼看？', opts: ['從上面往下看', '從下面往上看', '和指針平視', '閉一隻眼睛斜看'], a: 2, why: '眼睛要和指針保持水平，讀數才正確。' },
      { lv: '理解', q: '拔河時，兩隊的力量一樣大，繩子會怎麼樣？', opts: ['往左移', '往右移', '靜止不動', '斷掉'], a: 2, why: '兩個力大小相同、方向相反，物體保持靜止，叫力的平衡。' },
      { lv: '理解', q: '拔河時，紅隊的力比藍隊大，繩子會往哪邊移動？', opts: ['紅隊那邊', '藍隊那邊', '往上', '不會動'], a: 0, why: '物體會往力量大的那一方移動。' },
      { lv: '記憶', q: '下面哪一種力，「不用接觸」也能作用？', opts: ['推門的力', '踢球的力', '磁鐵吸迴紋針的力', '拉繩子的力'], a: 2, why: '磁力不用碰到就能作用，地球引力也是。' },
      { lv: '記憶', q: '物體的「重量」是什麼？', opts: ['物體的大小', '地球對物體的引力', '物體的顏色', '物體的溫度'], a: 1, why: '地球吸引物體的力，就是物體的重量。' },
      { lv: '生活', q: '下面哪一樣東西「沒有」利用彈簧？', opts: ['原子筆', '彈簧床', '釘書機', '鉛筆'], a: 3, why: '鉛筆裡沒有彈簧。' },
    ],
  };

  // ---------------- 四-2 摩擦力 ----------------
  const SURF = { glass: { name: '玻璃', color: '#cfe8f6', dist: 470, pull: 1 }, wood: { name: '木板', color: '#e3c49a', dist: 330, pull: 2 }, towel: { name: '毛巾', color: '#f2b8c6', dist: 170, pull: 4 } };
  let surf = 'wood';
  const fricSVG = `<svg viewBox="0 0 600 420" role="img" aria-label="玩具車從斜坡滑下">
    <rect width="600" height="420" fill="#f1eee6"/>
    <path d="M20 120 L180 300 L20 300Z" fill="var(--wood)" stroke="#8d6a43" stroke-width="3"/>
    <rect id="floor" x="180" y="300" width="400" height="20" fill="#e3c49a" stroke="var(--line)"/>
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${180 + i * 50}" y1="324" x2="${180 + i * 50}" y2="336" stroke="var(--ink)" stroke-width="2"/>`).join('')}
    <g id="car" transform="translate(40 120)"><g transform="rotate(48)"><rect x="-26" y="-34" width="52" height="24" rx="8" fill="var(--acid)"/><circle cx="-14" cy="-6" r="8" fill="var(--ink)"/><circle cx="14" cy="-6" r="8" fill="var(--ink)"/></g></g>
    <g id="fricArrow" opacity="0"><line x1="0" y1="0" x2="-60" y2="0" stroke="var(--base)" stroke-width="6"/><path d="M-60 0 l12 -8 v16Z" fill="var(--base)"/></g>
    ${hot('surface', 380, 310, '--wood', '接觸面', 400, 370)}
    ${hot('fric', 300, 250, '--base', '摩擦力', 330, 230)}
    ${hot('ramp', 90, 240, '--root', '斜坡', 40, 340)}
    ${hot('heat', 520, 120, '--acid', '摩擦生熱', 420, 90)}
    <g transform="translate(520 120)" class="nolabel"><path d="M-20 10 q10 -20 20 0 q10 20 20 0" stroke="var(--acid)" stroke-width="4" fill="none" opacity=".4"/></g>
  </svg>`;
  function runCar(api) {
    const s = SURF[surf], car = api.svg.querySelector('#car'), arrow = api.svg.querySelector('#fricArrow');
    api.svg.querySelector('#floor').setAttribute('fill', s.color);
    car.setAttribute('transform', 'translate(40 120)'); car.firstElementChild.setAttribute('transform', 'rotate(48)');
    arrow.setAttribute('opacity', '0');
    const end = 180 + s.dist * 0.82;
    car.animate([{ transform: 'translate(40px,120px)' }, { transform: 'translate(180px,290px)', offset: 0.35 }, { transform: `translate(${end}px,290px)` }], { duration: 2600, easing: 'ease-out', fill: 'forwards' });
    api.later(() => { car.firstElementChild.setAttribute('transform', 'rotate(0)'); }, 900);
    api.later(() => { arrow.setAttribute('transform', `translate(${end - 30} 270)`); arrow.setAttribute('opacity', '1'); }, 2600);
    const ro = document.querySelector('#fricRead');
    if (ro) ro.innerHTML = `在<b>${s.name}</b>上：車子滑了約 <b>${Math.round(s.dist / 10)}</b> 公分　用彈簧秤拉木塊約 <b>${s.pull}</b> 格<br>${surf === 'towel' ? '表面粗糙，摩擦力<b>大</b>，車子很快停下來' : surf === 'glass' ? '表面光滑，摩擦力<b>小</b>，車子滑最遠' : '摩擦力中等'}`;
  }
  window.LESSONS.u4b = {
    id: 'u4b', no: '2', title: '摩擦力', weeks: '18–19', clip: 'school',
    intro: '玩具車從斜坡滑下來，最後一定會停下來。是誰讓它停下來的？換不同的地面試試看。',
    svg: fricSVG,
    chips: ['surface', 'fric', 'ramp', 'heat'],
    widget(el, api) {
      el.innerHTML = `<b>選地面，再放車：</b><div class="ctrl" style="margin:8px 0">${Object.entries(SURF).map(([k, v]) => `<button class="seg ${k === surf ? 'on' : ''}" data-surf="${k}">${v.name}</button>`).join('')}<button class="seg" id="goCar" style="background:var(--sun)">🚗 放車！</button></div><div class="readout" id="fricRead">選一種地面，按「放車」。</div>`;
      el.querySelectorAll('[data-surf]').forEach((b) => b.onclick = () => { surf = b.dataset.surf; el.querySelectorAll('[data-surf]').forEach((x) => x.classList.toggle('on', x === b)); api.svg.querySelector('#floor').setAttribute('fill', SURF[surf].color); });
      el.querySelector('#goCar').onclick = () => { runCar(api); api.say(surf === 'towel' ? '毛巾表面粗糙，摩擦力大，車子很快就停下來了。' : surf === 'glass' ? '玻璃表面光滑，摩擦力小，車子滑得最遠。' : '木板的摩擦力在中間。'); };
    },
    actions: [],
    facts: [{ t: '摩擦力', d: '阻止物體運動的力，方向和運動方向相反', c: '--base' }, { t: '表面', d: '越粗糙，摩擦力越大', c: '--wood' }],
    parts: {
      surface: { name: '接觸面', kind: '摩擦力的大小', c: '--wood', say: '物體和接觸面之間會產生摩擦力。表面越粗糙，摩擦力越大；表面越光滑，摩擦力越小。同樣重的木塊，在毛巾上要用比較大的力才拉得動。', points: ['粗糙 → 摩擦力大', '光滑 → 摩擦力小', '同重量才能公平比較'],
        art: `<svg viewBox="0 0 320 200"><path d="M20 150 ${Array.from({ length: 28 }, (_, i) => `l5 ${i % 2 ? 8 : -8}`).join(' ')}" stroke="var(--wood)" stroke-width="4" fill="none"/><rect x="40" y="100" width="70" height="44" rx="6" fill="var(--root)"/><line x1="170" y1="150" x2="300" y2="150" stroke="var(--sky-dark)" stroke-width="4"/><rect x="200" y="106" width="70" height="44" rx="6" fill="var(--root)"/></svg>` },
      fric: { name: '摩擦力', kind: '阻止運動的力', c: '--base', say: '摩擦力是在物體和接觸面之間，阻止物體運動的力。它的方向和物體運動的方向相反，會讓車子慢慢停下來。', points: ['阻止物體運動的力', '方向和運動方向相反', '讓移動的東西慢下來、停下來'],
        art: `<svg viewBox="0 0 320 200"><line x1="20" y1="150" x2="300" y2="150" stroke="var(--wood)" stroke-width="6"/><rect x="120" y="100" width="80" height="48" rx="6" fill="var(--root)"/><path d="M210 124 h70 l-12 -8 M280 124 l-12 8" stroke="var(--acid)" stroke-width="5" fill="none"/><path d="M110 140 h-70 l12 -8 M40 140 l12 8" stroke="var(--base)" stroke-width="5" fill="none"/></svg>` },
      ramp: { name: '斜坡', kind: '公平的實驗', c: '--root', say: '讓玩具車從同一個斜坡、同一個高度滑下來，只改變地面的材質，才能公平比較哪一種地面摩擦力比較大。', points: ['同一個斜坡、同樣高度', '只改變地面材質', '比較車子滑多遠'],
        art: `<svg viewBox="0 0 320 200"><path d="M20 40 L160 170 L20 170Z" fill="var(--wood)"/><rect x="160" y="170" width="150" height="10" fill="#e3c49a"/><circle cx="60" cy="70" r="12" fill="var(--acid)"/></svg>` },
      heat: { name: '摩擦生熱', kind: '摩擦的作用', c: '--acid', say: '冬天兩手互相搓一搓，手會變暖，這是摩擦產生了熱。腳踏車煞車用久了，煞車皮也會變熱。', points: ['摩擦會產生熱', '搓手取暖', '煞車皮會變熱'],
        art: `<svg viewBox="0 0 320 200"><ellipse cx="130" cy="100" rx="40" ry="60" fill="#f5d0b5"/><ellipse cx="190" cy="100" rx="40" ry="60" fill="#f2c4a4"><animateTransform attributeName="transform" type="translate" values="0 -8;0 8;0 -8" dur=".4s" repeatCount="indefinite"/></ellipse><path d="M160 20 q10 -14 0 -18 M180 20 q10 -14 0 -18" stroke="var(--acid)" stroke-width="3" fill="none"/></svg>` },
      tire: { name: '輪胎和鞋底紋路', kind: '增加摩擦力', c: '--ink', say: '輪胎和運動鞋底有很多凹凸的紋路，可以增加摩擦力，讓車子和人不容易滑倒。', points: ['凹凸紋路增加摩擦力', '下雨天比較不會打滑', '讓我們走路、煞車更安全'],
        art: `<svg viewBox="0 0 160 110"><circle cx="80" cy="55" r="44" fill="#3a3f45"/><circle cx="80" cy="55" r="20" fill="var(--metal)"/>${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${80 + 36 * Math.cos(a)}" y1="${55 + 36 * Math.sin(a)}" x2="${80 + 44 * Math.cos(a)}" y2="${55 + 44 * Math.sin(a)}" stroke="#777" stroke-width="4"/>`; }).join('')}</svg>` },
      cap: { name: '瓶蓋的紋路', kind: '增加摩擦力', c: '--water', say: '寶特瓶蓋旁邊有一條條的紋路，可以增加摩擦力，手才抓得住，比較容易打開。雖然比較費力，但更方便。', points: ['紋路增加摩擦力', '手不會滑，容易轉開', '費力但方便'],
        art: `<svg viewBox="0 0 160 110"><rect x="40" y="30" width="80" height="50" rx="8" fill="var(--sky)"/>${Array.from({ length: 10 }, (_, i) => `<line x1="${46 + i * 7}" y1="32" x2="${46 + i * 7}" y2="78" stroke="var(--sky-dark)" stroke-width="2"/>`).join('')}</svg>` },
      cart: { name: '購物車輪子', kind: '減少摩擦力', c: '--metal', say: '購物車裝了輪子，滾動的摩擦力比較小，推起來就很省力。行李箱、椅子下面的輪子也是一樣的道理。', points: ['滾動比滑動省力', '輪子減少摩擦力', '例子：購物車、行李箱'],
        art: `<svg viewBox="0 0 160 110"><path d="M20 20 h20 l14 50 h80 l10 -36 h-98" fill="none" stroke="var(--metal)" stroke-width="5"/><circle cx="62" cy="88" r="10" fill="var(--ink)"/><circle cx="122" cy="88" r="10" fill="var(--ink)"/></svg>` },
      oil: { name: '潤滑油', kind: '減少摩擦力', c: '--fruit', say: '腳踏車鏈條加潤滑油，表面變得滑滑的，摩擦力變小，騎起來比較順，也比較不會磨損。', points: ['讓表面變滑', '減少摩擦力和磨損', '例子：腳踏車鏈條、門的鉸鏈'],
        art: `<svg viewBox="0 0 160 110"><path d="M40 70 q40 -50 80 0" fill="none" stroke="var(--ink)" stroke-width="8" stroke-dasharray="10 6"/><path d="M110 10 l20 -6 v20Z" fill="var(--fruit)"/><circle cx="112" cy="40" r="5" fill="var(--fruit)"/></svg>` },
    },
    drawers: [{ title: '生活中的摩擦力', desc: '有時候要增加摩擦力，有時候要減少它。', ids: ['tire', 'cap', 'cart', 'oil'] }],
    quiz: [
      { lv: '點圖', q: '在圖上點出「讓車子慢下來」的力。', tap: 'fric', why: '摩擦力和運動方向相反，會讓車子慢下來。' },
      { lv: '理解', q: '摩擦力的方向和物體運動的方向？', opts: ['相同', '相反', '垂直向上', '沒有方向'], a: 1, why: '摩擦力阻止運動，方向和運動方向相反。' },
      { lv: '實驗', q: '玩具車從同一斜坡滑下，在哪一種地面上滑得最遠？', opts: ['毛巾', '木板', '玻璃', '地毯'], a: 2, why: '玻璃最光滑，摩擦力最小，車子滑最遠。' },
      { lv: '實驗', q: '用彈簧秤拉同一個木塊，在哪一種表面上要用最大的力？', opts: ['玻璃', '毛巾', '光滑的桌面', '冰面'], a: 1, why: '毛巾表面最粗糙，摩擦力最大。' },
      { lv: '實驗設計', q: '比較不同地面的摩擦力時，哪一個條件「要改變」？', opts: ['車子', '斜坡高度', '地面材質', '放手的方法'], a: 2, why: '只改變要比較的地面材質，其他都要一樣。' },
      { lv: '生活', q: '輪胎上有很多凹凸紋路，目的是？', opts: ['比較好看', '增加摩擦力，不容易打滑', '減少摩擦力', '讓輪胎變輕'], a: 1, why: '紋路增加摩擦力，煞車和轉彎更安全。' },
      { lv: '生活', q: '購物車裝輪子，主要是為了？', opts: ['增加摩擦力', '減少摩擦力，推起來省力', '讓車子變重', '比較好看'], a: 1, why: '滾動的摩擦力小，推起來省力。' },
      { lv: '生活', q: '冬天搓手會覺得暖暖的，是因為？', opts: ['摩擦生熱', '太陽照到', '手變大了', '血流變慢'], a: 0, why: '摩擦會產生熱。' },
      { lv: '分類', q: '下面哪一個是「減少」摩擦力的例子？', opts: ['鞋底紋路', '瓶蓋紋路', '腳踏車鏈條上潤滑油', '浴室止滑墊'], a: 2, why: '潤滑油讓表面變滑，減少摩擦力。' },
      { lv: '理解', q: '寶特瓶蓋有紋路，轉開時？', opts: ['比較省力但容易滑', '比較費力但手不會滑，容易轉開', '完全沒有差別', '轉不開'], a: 1, why: '增加摩擦力雖然費力，但更方便使用。' },
    ],
  };

  // ---------------- 四-3 運動狀態的快慢 ----------------
  let carSpeed = 2;
  const speedSVG = `<svg viewBox="0 0 600 420" role="img" aria-label="小車撞積木，比較速度與動能">
    <rect width="600" height="420" fill="#f1eee6"/>
    <rect x="20" y="300" width="560" height="16" fill="var(--wood)"/>
    ${Array.from({ length: 11 }, (_, i) => `<line x1="${40 + i * 50}" y1="318" x2="${40 + i * 50}" y2="330" stroke="var(--ink)" stroke-width="2"/><text x="${40 + i * 50}" y="348" text-anchor="middle" font-size="13" fill="var(--muted)">${i * 10}</text>`).join('')}
    <text x="560" y="372" font-size="13" fill="var(--muted)">公尺</text>
    <g id="blocks">${[0, 1, 2].map((i) => `<rect x="${470 + i * 26}" y="250" width="22" height="50" rx="3" fill="var(--sky)" stroke="var(--sky-dark)" stroke-width="2"/>`).join('')}</g>
    <g id="kcar" transform="translate(60 0)"><rect x="-30" y="262" width="60" height="26" rx="8" fill="var(--acid)"/><rect x="-14" y="248" width="28" height="18" rx="5" fill="#f5c8bf"/><circle cx="-16" cy="292" r="9" fill="var(--ink)"/><circle cx="16" cy="292" r="9" fill="var(--ink)"/></g>
    <g transform="translate(70 70)" class="nolabel"><circle r="40" fill="var(--card)" stroke="var(--ink)" stroke-width="4"/><line x1="0" y1="0" x2="0" y2="-28" stroke="var(--ink)" stroke-width="4"/><line x1="0" y1="0" x2="18" y2="10" stroke="var(--acid)" stroke-width="3"/></g>
    ${hot('speed', 300, 200, '--acid', '速度', 320, 190)}
    ${hot('time', 70, 70, '--ink', '時間', 120, 60)}
    ${hot('distance', 260, 330, '--wood', '距離', 230, 400)}
    ${hot('kinetic', 500, 230, '--sky-dark', '動能', 470, 200)}
  </svg>`;
  function runK(api) {
    const car = api.svg.querySelector('#kcar'), blocks = [...api.svg.querySelectorAll('#blocks rect')];
    const dur = [0, 3000, 1800, 1000][carSpeed];
    car.getAnimations && car.getAnimations().forEach((a) => a.cancel());
    blocks.forEach((b) => b.getAnimations && b.getAnimations().forEach((a) => a.cancel()));
    car.animate([{ transform: 'translateX(60px)' }, { transform: 'translateX(436px)' }], { duration: dur, easing: 'linear', fill: 'forwards' });
    api.later(() => blocks.forEach((b, i) => b.animate([{ transform: 'none' }, { transform: `translate(${carSpeed * 30 + i * 12}px, 0) rotate(${carSpeed * 25}deg)` }], { duration: 600, fill: 'forwards', easing: 'ease-out' })), dur);
    const secs = [0, 15, 9, 5][carSpeed];
    const ro = document.querySelector('#kRead');
    if (ro) ro.innerHTML = `跑 75 公尺用了 <b>${secs}</b> 秒　速度 ＝ 75 ÷ ${secs} ≈ <b>${(75 / secs).toFixed(1)}</b> 公尺/秒<br>${carSpeed === 3 ? '速度最快，動能最大，積木被撞得最遠！' : carSpeed === 1 ? '速度慢，動能小，積木只被推一點點' : '速度中等'}`;
  }
  window.LESSONS.u4c = {
    id: 'u4c', no: '3', title: '運動狀態的快慢', weeks: '20–21', clip: 'family',
    intro: '誰跑得比較快？只看距離或只看時間都不夠。再看看，跑得越快的車子，撞積木的力量是不是越大？',
    svg: speedSVG,
    chips: ['speed', 'time', 'distance', 'kinetic'],
    widget(el, api) {
      el.innerHTML = `<b>選車速，再出發：</b><div class="ctrl" style="margin:8px 0">${['慢', '中', '快'].map((t, i) => `<button class="seg ${i + 1 === carSpeed ? 'on' : ''}" data-sp="${i + 1}">${t}</button>`).join('')}<button class="seg" id="goK" style="background:var(--sun)">🏁 出發！</button></div><div class="readout" id="kRead">選一個速度，按「出發」。</div>`;
      el.querySelectorAll('[data-sp]').forEach((b) => b.onclick = () => { carSpeed = +b.dataset.sp; el.querySelectorAll('[data-sp]').forEach((x) => x.classList.toggle('on', x === b)); });
      el.querySelector('#goK').onclick = () => { runK(api); api.say(carSpeed === 3 ? '車子跑得越快，動能越大，把積木撞得越遠。' : '速度越慢，動能越小。'); };
    },
    actions: [],
    facts: [{ t: '速度', d: '距離 ÷ 時間（例：公尺/秒）', c: '--acid' }, { t: '動能', d: '同一物體，速度越快，動能越大', c: '--sky-dark' }],
    parts: {
      speed: { name: '速度', kind: '運動的快慢', c: '--acid', say: '速度是用來比較快慢的。速度等於距離除以時間。例如 100 公尺跑了 20 秒，速度就是每秒 5 公尺。', points: ['速度 ＝ 距離 ÷ 時間', '單位：公尺/秒、公里/小時', '同樣時間，跑越遠越快'],
        art: `<svg viewBox="0 0 320 200"><text x="160" y="90" text-anchor="middle" font-size="34" font-weight="800" fill="var(--ink)">距離 ÷ 時間</text><text x="160" y="150" text-anchor="middle" font-size="30" font-weight="800" fill="var(--acid)">＝ 速度</text></svg>` },
      time: { name: '時間', kind: '比較快慢', c: '--ink', say: '跑同樣的距離，用的時間越少，速度越快。賽跑時大家跑一樣遠，誰先到終點、用的時間最少，誰就最快。', points: ['距離一樣：時間少的比較快', '用碼錶量時間', '賽跑就是比時間'],
        art: `<svg viewBox="0 0 320 200"><circle cx="160" cy="105" r="70" fill="var(--card)" stroke="var(--ink)" stroke-width="6"/><rect x="148" y="20" width="24" height="16" fill="var(--ink)"/><line x1="160" y1="105" x2="160" y2="50" stroke="var(--acid)" stroke-width="5"><animateTransform attributeName="transform" type="rotate" values="0 160 105;360 160 105" dur="3s" repeatCount="indefinite"/></line></svg>` },
      distance: { name: '距離', kind: '比較快慢', c: '--wood', say: '在同樣的時間裡，跑得越遠，速度越快。如果距離和時間都不一樣，就要算出速度才能比較。', points: ['時間一樣：跑越遠越快', '距離、時間都不同：算速度', '用捲尺量距離'],
        art: `<svg viewBox="0 0 320 200"><line x1="20" y1="140" x2="300" y2="140" stroke="var(--wood)" stroke-width="6"/><path d="M40 120 v40 M280 120 v40" stroke="var(--ink)" stroke-width="4"/><path d="M60 100 h200 l-12 -8 M260 100 l-12 8" stroke="var(--acid)" stroke-width="4" fill="none"/></svg>` },
      kinetic: { name: '動能', kind: '運動的能量', c: '--sky-dark', say: '運動中的物體具有能量，叫做動能。同一個物體，速度越快，動能就越大，撞到東西時的威力也越大。所以騎車不能騎太快。', points: ['運動的物體有動能', '同一物體：越快，動能越大', '撞擊力越大，騎車要慢慢騎'],
        art: `<svg viewBox="0 0 320 200"><rect x="40" y="110" width="70" height="34" rx="8" fill="var(--acid)"><animate attributeName="x" values="20;160;20" dur="2s" repeatCount="indefinite"/></rect><rect x="230" y="90" width="26" height="60" rx="3" fill="var(--sky)"/><rect x="262" y="90" width="26" height="60" rx="3" fill="var(--sky)"/></svg>` },
      coaster: { name: '雲霄飛車', kind: '能量轉換', c: '--acid', say: '雲霄飛車在高處時速度慢，往下衝的時候越來越快，動能越來越大；爬上坡時又慢下來。能量在不同形式之間轉換，但總能量不會改變。', points: ['往下衝：越來越快，動能變大', '往上爬：越來越慢', '能量會轉換，總能量不變'],
        art: `<svg viewBox="0 0 160 110"><path d="M5 30 C40 30 50 100 80 100 C110 100 120 50 155 50" fill="none" stroke="var(--root)" stroke-width="5"/><circle r="8" fill="var(--acid)"><animateMotion dur="3s" repeatCount="indefinite" path="M5 30 C40 30 50 100 80 100 C110 100 120 50 155 50"/></circle></svg>` },
      swing: { name: '盪鞦韆', kind: '能量轉換', c: '--fruit', say: '盪鞦韆時，在最低點速度最快，盪到最高點時會停一下。速度和高度一直在互相轉換。', points: ['最低點最快', '最高點最慢、停一下', '能量在高度和速度之間轉換'],
        art: `<svg viewBox="0 0 160 110"><line x1="20" y1="10" x2="140" y2="10" stroke="var(--wood)" stroke-width="5"/><g><line x1="80" y1="10" x2="80" y2="80" stroke="var(--ink)" stroke-width="2"/><rect x="66" y="80" width="28" height="8" fill="var(--fruit)"/><animateTransform attributeName="transform" type="rotate" values="-35 80 10;35 80 10;-35 80 10" dur="2.4s" repeatCount="indefinite"/></g></svg>` },
      wind: { name: '風力發電', kind: '能量轉換', c: '--sky-dark', say: '風吹動風車的葉片，風的動能讓葉片轉動，再轉換成電能。台灣的海邊有很多風力發電機。', points: ['風的動能 → 葉片轉動', '轉動 → 電能', '乾淨的能源'],
        art: `<svg viewBox="0 0 160 110"><line x1="80" y1="50" x2="80" y2="108" stroke="var(--metal)" stroke-width="5"/><g><path d="M80 50 L80 8 M80 50 L44 70 M80 50 L116 70" stroke="var(--card)" stroke-width="7" stroke-linecap="round"/><animateTransform attributeName="transform" type="rotate" values="0 80 50;360 80 50" dur="3s" repeatCount="indefinite"/></g><circle cx="80" cy="50" r="5" fill="var(--metal)"/></svg>` },
    },
    drawers: [{ title: '能量會轉換', desc: '動能可以變成別種能量，但總能量不會改變。', ids: ['coaster', 'swing', 'wind'] }],
    quiz: [
      { lv: '點圖', q: '在圖上點出「速度越快就越大」的東西。', tap: 'kinetic', why: '同一物體，速度越快，動能越大。' },
      { lv: '記憶', q: '速度要怎麼算？', opts: ['距離 × 時間', '距離 ÷ 時間', '時間 ÷ 距離', '距離 ＋ 時間'], a: 1, why: '速度 ＝ 距離 ÷ 時間。' },
      { lv: '計算', q: '小明跑 100 公尺用了 20 秒，他的速度是多少？', opts: ['每秒 2 公尺', '每秒 5 公尺', '每秒 20 公尺', '每秒 120 公尺'], a: 1, why: '100 ÷ 20 ＝ 5，每秒 5 公尺。' },
      { lv: '比較', q: '甲 10 秒跑 50 公尺，乙 10 秒跑 60 公尺，誰比較快？', opts: ['甲', '乙', '一樣快', '無法比較'], a: 1, why: '時間一樣，跑越遠的越快。' },
      { lv: '比較', q: '甲跑 60 公尺用 12 秒，乙跑 60 公尺用 10 秒，誰比較快？', opts: ['甲', '乙', '一樣快', '無法比較'], a: 1, why: '距離一樣，用的時間越少越快。' },
      { lv: '計算', q: '汽車 2 小時開了 120 公里，速度是多少？', opts: ['每小時 60 公里', '每小時 240 公里', '每小時 122 公里', '每小時 30 公里'], a: 0, why: '120 ÷ 2 ＝ 60，每小時 60 公里。' },
      { lv: '理解', q: '同一台腳踏車，什麼時候動能最大？', opts: ['停著不動', '慢慢騎', '騎得最快的時候', '牽著走'], a: 2, why: '速度越快，動能越大。' },
      { lv: '安全', q: '為什麼騎腳踏車下坡不能衝太快？', opts: ['會變冷', '速度快動能大，撞到會很危險', '輪子會掉', '會迷路'], a: 1, why: '速度越快，動能越大，撞擊的威力也越大。' },
      { lv: '理解', q: '雲霄飛車從高處往下衝時，速度會？', opts: ['越來越慢', '越來越快', '不變', '停下來'], a: 1, why: '往下衝時越來越快，動能越來越大。' },
      { lv: '理解', q: '能量在轉換的過程中，總能量會？', opts: ['越來越多', '越來越少', '保持不變', '消失'], a: 2, why: '能量會在不同形式之間轉換，但總能量不變。' },
      { lv: '生活', q: '風力發電是把風的什麼能量變成電能？', opts: ['動能', '光能', '聲能', '熱能'], a: 0, why: '風的動能讓葉片轉動，再轉換成電能。' },
    ],
  };
})();
