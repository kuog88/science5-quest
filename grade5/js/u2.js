// 單元二 植物世界
(function () {
  const { hot, petals } = window.H;

  // ---------------- 二-1 植物根莖葉的功能 ----------------
  const plantSVG = `<svg id="plant" viewBox="0 0 600 640" role="img" aria-label="一株植物">
    <g opacity=".9"><circle cx="70" cy="70" r="34" fill="var(--sunc)"/><g stroke="var(--sunc)" stroke-width="5" stroke-linecap="round"><path d="M70 20v-12M70 132v-12M20 70H8M132 70h-12M35 35l-8-8M105 105l8 8M105 35l8-8M35 105l-8 8"/></g></g>
    <rect x="0" y="410" width="600" height="230" fill="var(--soil)"/>
    <path d="M0 410 Q150 398 300 410 T600 408" fill="none" stroke="var(--soil-deep)" stroke-width="4"/>
    <g fill="var(--soil-deep)" opacity=".5"><circle cx="60" cy="470" r="5"/><circle cx="520" cy="520" r="6"/><circle cx="140" cy="590" r="4"/><circle cx="460" cy="610" r="5"/></g>
    <g fill="none" stroke="var(--root)" stroke-linecap="round">
      <path d="M300 410 C302 470 296 530 300 610" stroke-width="10"/>
      <path d="M300 450 C260 470 230 490 190 540" stroke-width="6"/><path d="M300 460 C345 480 380 500 420 555" stroke-width="6"/>
      <path d="M299 520 C270 535 255 560 240 600" stroke-width="5"/><path d="M301 530 C330 545 350 570 365 605" stroke-width="5"/>
      <path d="M215 515 l-18 4 M205 528 l-14 10 M400 530 l18 2 M410 545 l12 12 M250 585 l-14 6 M358 590 l14 6 M300 600 l-10 14 M300 600 l10 14" stroke-width="2"/>
    </g>
    <path d="M300 412 C298 340 304 260 300 120" fill="none" stroke="var(--stem)" stroke-width="16" stroke-linecap="round"/>
    <g fill="var(--leaf)" stroke="var(--stem)" stroke-width="2">
      <path d="M300 330 C350 290 420 280 470 300 C430 340 360 350 300 330Z"/><path d="M300 300 C250 262 180 255 132 278 C175 318 245 322 300 300Z"/>
      <path d="M300 230 C345 196 405 190 448 208 C412 244 350 252 300 230Z"/><path d="M300 205 C262 176 210 172 172 190 C206 222 262 226 300 205Z"/>
    </g>
    <path d="M300 250 C270 240 250 236 232 226" stroke="var(--stem)" stroke-width="5" fill="none"/>
    <ellipse cx="222" cy="236" rx="18" ry="30" transform="rotate(30 222 236)" fill="var(--fruit)" stroke="var(--root)" stroke-width="2"/>
    <g transform="translate(300 100)">${petals(0, 0, 26, 'var(--flower)')}<circle r="12" fill="var(--sunc)"/></g>
    <path id="waterPath" d="M195 545 C230 490 270 470 300 455 C303 380 297 330 300 300 C350 285 400 280 440 292 C470 260 480 220 500 170" fill="none"/>
    <g id="fxLayer"></g>
    <g id="photoLayer" opacity="0" class="nolabel">
      <g stroke="var(--sunc)" stroke-width="5" stroke-dasharray="10 10"><path d="M100 100 L400 290"/><path d="M110 85 L420 210"/></g>
      <g class="lbl"><text x="400" y="372">二氧化碳 ↗</text><text x="430" y="150" style="fill:var(--good-ink)">氧氣 ↑</text><text x="90" y="372" style="fill:var(--root)">養分 ↓</text></g>
    </g>
    ${hot('root', 300, 520, '--root', '根', 330, 528)}
    ${hot('stem', 300, 370, '--stem', '莖', 326, 378)}
    ${hot('leaf', 420, 302, '--leaf', '葉', 446, 292)}
    ${hot('flower', 300, 100, '--flower', '花', 344, 80)}
    ${hot('fruit', 222, 236, '--fruit', '果實', 104, 244)}
  </svg>`;

  const art = {
    root: `<svg viewBox="0 0 320 200"><rect y="70" width="320" height="130" fill="var(--soil)"/><path d="M160 70 V190" stroke="var(--root)" stroke-width="10" stroke-linecap="round"/><path d="M160 100 L100 160 M160 110 L225 170" stroke="var(--root)" stroke-width="6" stroke-linecap="round"/><g fill="var(--water)"><circle cx="85" cy="160" r="6"><animate attributeName="cx" values="70;100" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite"/></circle><circle cx="240" cy="172" r="6"><animate attributeName="cx" values="255;225" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite"/></circle></g><path d="M160 70 V20" stroke="var(--stem)" stroke-width="10"/></svg>`,
    stem: `<svg viewBox="0 0 320 200"><rect x="130" y="0" width="60" height="200" rx="20" fill="var(--stem)"/><rect x="146" width="10" height="200" fill="var(--card)" opacity=".5"/><rect x="164" width="10" height="200" fill="var(--card)" opacity=".5"/><g fill="var(--water)">${[0, 1, 2, 3].map((i) => `<circle cx="151" r="5"><animate attributeName="cy" values="210;-10" dur="2s" begin="${i * 0.5}s" repeatCount="indefinite"/></circle>`).join('')}</g><g fill="var(--sunc)">${[0, 1, 2].map((i) => `<circle cx="169" r="5"><animate attributeName="cy" values="-10;210" dur="2.4s" begin="${i * 0.8}s" repeatCount="indefinite"/></circle>`).join('')}</g></svg>`,
    leaf: `<svg viewBox="0 0 320 200"><circle cx="40" cy="40" r="24" fill="var(--sunc)"/><path d="M60 170 C120 60 250 50 290 80 C250 160 150 190 60 170Z" fill="var(--leaf)"/><path d="M60 170 Q180 110 290 80" stroke="var(--stem)" stroke-width="3" fill="none"/><g fill="none" stroke="var(--card)" stroke-width="3">${[0, 1, 2].map((i) => `<circle cx="${170 + i * 35}" r="7"><animate attributeName="cy" values="110;10" dur="2.2s" begin="${i * 0.6}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2.2s" begin="${i * 0.6}s" repeatCount="indefinite"/></circle>`).join('')}</g><path d="M60 60 L150 120" stroke="var(--sunc)" stroke-width="4" stroke-dasharray="8 8"><animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/></path></svg>`,
    flower: `<svg viewBox="0 0 320 200"><path d="M160 200 V110" stroke="var(--stem)" stroke-width="8"/><g transform="translate(160 90)">${petals(0, 0, 34, 'var(--flower)')}<circle r="16" fill="var(--sunc)"/></g><g><ellipse rx="12" ry="8" fill="var(--sunc)"/><path d="M-4 -6 l-10 -12 M4 -6 l10 -12" stroke="var(--ink)" stroke-width="2"/><animateTransform attributeName="transform" type="translate" values="250 60;180 80;250 60" dur="3s" repeatCount="indefinite"/></g></svg>`,
    fruit: `<svg viewBox="0 0 320 200"><ellipse cx="120" cy="100" rx="60" ry="80" fill="var(--fruit)"/><g fill="var(--root)"><ellipse cx="110" cy="80" rx="8" ry="12"/><ellipse cx="135" cy="110" rx="8" ry="12"/><ellipse cx="105" cy="130" rx="8" ry="12"/></g><rect y="170" width="320" height="30" fill="var(--soil)"/><ellipse cx="240" cy="168" rx="9" ry="12" fill="var(--root)"/><path d="M240 160 q0 -30 -14 -40 M240 160 q4 -30 18 -36" stroke="var(--leaf)" stroke-width="4" fill="none"><animate attributeName="opacity" values="0;1;1" dur="3s" repeatCount="indefinite"/></path></svg>`,
    levels: `<svg viewBox="0 0 320 200"><g fill="none" stroke="var(--leaf)" stroke-width="2">${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${14 + c * 22}" y="${70 + r * 22}" width="20" height="20" rx="4"/>`).join('')).join('')}</g><path d="M90 102 h20 M220 102 h20" stroke="var(--muted)" stroke-width="3"/><path d="M118 120 C140 60 210 50 226 70 C200 110 150 130 118 120Z" fill="var(--leaf)"/><path d="M280 180 V60" stroke="var(--stem)" stroke-width="6"/><path d="M280 120 c20 -20 30 -20 34 -18 c-10 18 -20 22 -34 18Z M280 100 c-20 -20 -30 -20 -34 -18 c10 18 20 22 34 18Z" fill="var(--leaf)"/><circle cx="280" cy="52" r="10" fill="var(--flower)"/><path d="M280 180 l-12 14 M280 180 l12 14" stroke="var(--root)" stroke-width="4"/></svg>`,
  };
  const sp = (o) => o; // 只是讓下面的資料好讀

  window.LESSONS.u2a = {
    id: 'u2a', no: '1', title: '植物根莖葉的功能', weeks: '5–7', clip: 'jungle',
    intro: '植物的身體分成好幾個部位，每個部位都有自己的工作。點點看，水是怎麼從根跑到葉子的？',
    svg: plantSVG,
    chips: ['root', 'stem', 'leaf', 'flower', 'fruit'],
    parts: {
      root: { name: '根', kind: '營養器官', c: '--root', art: art.root, say: '根長在土裡，像吸管一樣吸收水分，還能把植物牢牢抓在土裡。根上細細的根毛，讓吸水的地方變得更多。', points: ['吸收土裡的水分', '把植物固定在土裡', '根毛很細很多，吸水面積變大'] },
      stem: { name: '莖', kind: '營養器官', c: '--stem', art: art.stem, say: '莖是植物的運輸高速公路，把根吸上來的水往上送到葉子，也把葉子做好的養分送到全身，同時撐起整株植物。', points: ['往上運送水分（根 → 葉）', '把葉子做的養分送到全身', '支撐植物，讓葉子照得到陽光'] },
      leaf: { name: '葉', kind: '營養器官', c: '--leaf', art: art.leaf, say: '葉子是植物的食物工廠。葉子用陽光、水和二氧化碳製造養分，同時放出氧氣。葉子上的氣孔會讓水變成水蒸氣散出去，這叫做蒸散作用。', points: ['光合作用：用陽光、水、二氧化碳做養分', '做養分的同時放出氧氣', '氣孔讓水蒸氣散出去，叫蒸散作用'] },
      flower: { name: '花', kind: '繁殖器官', c: '--flower', art: art.flower, say: '花是繁殖器官。蜜蜂、蝴蝶來採花蜜時會幫忙傳花粉，傳粉以後，花就會慢慢長成果實。', points: ['吸引昆蟲來幫忙傳花粉', '傳粉之後，會長出果實和種子'] },
      fruit: { name: '果實和種子', kind: '繁殖器官', c: '--fruit', art: art.fruit, say: '果實把種子包起來保護好。種子掉到適合的地方，吸了水就會發芽，長成一株新的植物。', points: ['果實保護裡面的種子', '種子遇到合適的環境會發芽', '種子長成新植物'] },
      levels: { name: '植物身體的層次', kind: '由小到大', c: '--moss-dark', art: art.levels, say: '植物是由很多很小的細胞組成的，細胞是最小的單位。很多細胞組成根、莖、葉、花、果實、種子這些器官，器官再組成一整株植物。', points: ['細胞：組成植物的最小單位', '器官：根、莖、葉、花、果實、種子', '個體：所有器官合起來的一整株植物'] },
      sweetpotato: sp({ name: '塊根', kind: '特化的根・番薯', c: '--root', say: '番薯是根變胖了，裡面存了很多養分，所以叫做塊根。', points: ['根變得又粗又胖', '用來儲存養分', '例子：番薯'],
        art: `<svg viewBox="0 0 160 110"><rect y="38" width="160" height="72" fill="var(--soil)"/><path d="M80 38 V10 M80 22 l-16 -10 M80 18 l16 -10" stroke="var(--leaf)" stroke-width="4"/><path d="M80 38 V56" stroke="var(--root)" stroke-width="4"/><ellipse cx="62" cy="76" rx="16" ry="26" transform="rotate(25 62 76)" fill="var(--flower)"/><ellipse cx="102" cy="78" rx="14" ry="24" transform="rotate(-25 102 78)" fill="var(--flower)"/></svg>` }),
      buttress: sp({ name: '板根', kind: '特化的根・熱帶大樹', c: '--root', say: '有些熱帶大樹的根長得像一片片木板，叫做板根，可以幫又高又大的樹站得更穩。', points: ['樹幹底部像木板一樣張開', '幫大樹站穩', '例子：銀葉樹'],
        art: `<svg viewBox="0 0 160 110"><rect y="92" width="160" height="18" fill="var(--soil)"/><rect x="68" y="0" width="24" height="96" fill="var(--root)"/><path d="M68 50 L20 94 L68 94Z M92 50 L140 94 L92 94Z" fill="var(--soil-deep)" stroke="var(--root)" stroke-width="3"/></svg>` }),
      mangrove: sp({ name: '呼吸根', kind: '特化的根・紅樹林', c: '--root', say: '紅樹林長在泥灘裡，泥裡空氣很少。海茄苳的呼吸根從泥裡往上冒出來，幫助根呼吸。', points: ['根從泥裡往上冒出來', '幫助根得到空氣', '例子：紅樹林的海茄苳'],
        art: `<svg viewBox="0 0 160 110"><rect y="70" width="160" height="40" fill="var(--soil-deep)"/><rect y="62" width="160" height="10" fill="var(--water)" opacity=".5"/>${[16, 34, 52, 108, 126, 144].map((x) => `<rect x="${x}" y="48" width="5" height="26" rx="2" fill="var(--root)"/>`).join('')}<rect x="74" y="10" width="12" height="62" fill="var(--root)"/><circle cx="80" cy="14" r="24" fill="var(--leaf)"/></svg>` }),
      banyan: sp({ name: '氣生根', kind: '特化的根・榕樹', c: '--root', say: '榕樹的樹枝上會垂下很多鬚鬚，那是氣生根。氣生根碰到地面後會越長越粗，變成柱子撐住樹枝。', points: ['從樹枝上往下長', '碰到地面會變粗，撐住樹枝', '例子：榕樹'],
        art: `<svg viewBox="0 0 160 110"><rect y="96" width="160" height="14" fill="var(--soil)"/><rect x="70" y="30" width="20" height="70" fill="var(--root)"/><ellipse cx="80" cy="26" rx="70" ry="22" fill="var(--leaf)"/><g stroke="var(--root)" stroke-width="2">${[24, 38, 52, 108].map((x) => `<path d="M${x} 40 V80"/>`).join('')}</g><rect x="122" y="40" width="7" height="58" fill="var(--root)"/></svg>` }),
      potato: sp({ name: '塊莖', kind: '特化的莖・馬鈴薯', c: '--stem', say: '馬鈴薯雖然長在土裡，但它表面有芽眼，可以長出新芽，所以它是莖，叫做塊莖。', points: ['長在土裡的莖變胖', '表面有芽眼，會長出新芽', '例子：馬鈴薯'],
        art: `<svg viewBox="0 0 160 110"><ellipse cx="80" cy="62" rx="56" ry="38" fill="var(--soil)"/><g fill="var(--soil-deep)"><circle cx="58" cy="50" r="4"/><circle cx="96" cy="72" r="4"/><circle cx="104" cy="44" r="4"/></g><path d="M104 44 q8 -20 22 -26" stroke="var(--leaf)" stroke-width="4" fill="none"/></svg>` }),
      strawberry: sp({ name: '走莖', kind: '特化的莖・草莓', c: '--stem', say: '草莓會長出細長的走莖，貼著地面往外爬，碰到土就長出根，變成一株新的草莓。', points: ['莖貼著地面往外長', '碰到土就長出根和新葉', '例子：草莓'],
        art: `<svg viewBox="0 0 160 110"><rect y="84" width="160" height="26" fill="var(--soil)"/><path d="M36 84 C70 70 100 70 128 84" stroke="var(--stem)" stroke-width="3" fill="none"/><g fill="var(--leaf)"><ellipse cx="28" cy="64" rx="12" ry="18"/><ellipse cx="44" cy="62" rx="12" ry="18"/><ellipse cx="128" cy="72" rx="8" ry="12"/></g><circle cx="22" cy="86" r="7" fill="var(--acid)"/><path d="M128 84 l-6 10 M128 84 l6 10" stroke="var(--root)" stroke-width="2"/></svg>` }),
      morningglory: sp({ name: '纏繞莖', kind: '特化的莖・牽牛花', c: '--stem', say: '牽牛花的莖很細，自己站不起來，就一圈一圈纏著竹竿往上爬，爭取更多陽光，叫做纏繞莖。', points: ['莖一圈圈纏著支撐物', '往上爬，照到更多陽光', '例子：牽牛花'],
        art: `<svg viewBox="0 0 160 110"><rect x="76" y="4" width="8" height="106" fill="var(--soil-deep)"/><path d="M80 108 C60 98 100 88 80 78 C60 68 100 58 80 48 C60 38 100 28 80 18" stroke="var(--stem)" stroke-width="4" fill="none"/><path d="M80 18 l-16 -8 l6 16Z" fill="var(--neutral)"/><ellipse cx="100" cy="60" rx="10" ry="7" fill="var(--leaf)"/></svg>` }),
      lotus: sp({ name: '地下莖', kind: '特化的莖・蓮藕', c: '--stem', say: '蓮藕長在水底的泥裡，它其實是莖，一節一節的，切開有很多孔洞，可以讓空氣通過。', points: ['長在泥裡的莖，一節一節', '切開有孔洞，讓空氣通過', '例子：蓮藕、薑'],
        art: `<svg viewBox="0 0 160 110"><g fill="var(--soil)" stroke="var(--root)" stroke-width="2"><rect x="10" y="40" width="64" height="34" rx="16"/><rect x="78" y="40" width="70" height="34" rx="16"/></g><g fill="var(--soil-deep)"><circle cx="113" cy="57" r="5"/><circle cx="99" cy="51" r="3"/><circle cx="127" cy="51" r="3"/><circle cx="99" cy="64" r="3"/><circle cx="127" cy="64" r="3"/></g></svg>` }),
    },
    actions: [
      { label: '💧 水的旅程', sub: '看水從根走到葉子', c: '#3a86d0', run(api) {
        const fx = api.svg.querySelector('#fxLayer'); fx.innerHTML = '';
        api.svg.querySelector('#photoLayer').setAttribute('opacity', '0');
        for (let i = 0; i < 6; i++) window.H.mover(api, fx, '<circle r="9" fill="var(--water)" stroke="#fff" stroke-width="2"/>', 'waterPath', 5, i * 600);
        api.say('水的旅程開始了！根從土裡把水吸進來，莖把水往上送，水到了葉子，多的水從氣孔變成水蒸氣，飄到空氣裡。所以水在植物身體裡，是由下往上走的。', 'media/water.mp3');
      } },
      { label: '☀️ 光合作用', sub: '葉子怎麼做養分', c: '#c08a1e', run(api) {
        api.svg.querySelector('#fxLayer').innerHTML = '';
        api.svg.querySelector('#photoLayer').setAttribute('opacity', '1');
        api.say('陽光照在葉子上，葉子吸進二氧化碳，加上根送來的水，做出養分，再放出氧氣。植物的養分不是從土裡吃來的，是用陽光自己做出來的喔。', 'media/photo.mp3');
      } },
      { label: '🔬 植物身體的層次', sub: '細胞 → 器官 → 一整株植物', c: '#6b8f5e', wide: true, run(api) { api.svg.dispatchEvent(new CustomEvent('noop')); document.querySelector('[data-part="levels"]').click(); } },
    ],
    facts: [{ t: '營養器官', d: '根、莖、葉：讓植物活下去、長大', c: '--leaf' }, { t: '繁殖器官', d: '花、果實、種子：生出下一代', c: '--flower' }],
    drawers: [
      { title: '植物身體的層次', desc: '從最小的細胞，到一整株植物。', ids: ['levels'] },
      { title: '長得不一樣的根和莖', desc: '有些植物的根或莖變了形狀，是為了在它住的地方活得更好。', ids: ['sweetpotato', 'buttress', 'mangrove', 'banyan', 'potato', 'strawberry', 'morningglory', 'lotus'] },
    ],
    quiz: [
      { lv: '點圖', q: '在圖上點出「負責吸收水分」的部位。', tap: 'root', why: '根長在土裡，用根毛吸收水分。' },
      { lv: '點圖', q: '在圖上點出「把水往上送到葉子」的部位。', tap: 'stem', why: '莖像高速公路，把根吸上來的水往上送。' },
      { lv: '點圖', q: '在圖上點出「用陽光製造養分」的部位。', tap: 'leaf', why: '葉子進行光合作用，用陽光、水和二氧化碳做養分。' },
      { lv: '實驗', q: '把芹菜插在紅色的水裡一天，再把莖橫切開來，會看到什麼？', opts: ['整個切面都變紅', '切面上出現一個個紅色小點', '完全沒有變色', '只有外皮變紅'], a: 1, why: '紅色小點就是莖裡運送水分的管子。' },
      { lv: '排序', q: '水在植物身體裡走的順序，哪一個是對的？', opts: ['葉 → 莖 → 根', '根 → 葉 → 莖', '根 → 莖 → 葉', '莖 → 根 → 葉'], a: 2, why: '根吸水，莖運水，最後送到葉子。' },
      { lv: '迷思', q: '「植物長大需要的養分，是從土壤裡吃進去的。」這句話對嗎？', opts: ['對', '不對'], a: 1, why: '養分是葉子用陽光、水和二氧化碳，透過光合作用自己做出來的。' },
      { lv: '記憶', q: '葉子進行光合作用，需要用到哪些東西？', opts: ['陽光、水、二氧化碳', '陽光、土壤、氧氣', '月光、水、氧氣', '肥料、空氣、雨水'], a: 0, why: '陽光、水、二氧化碳是做養分的材料，做完會放出氧氣。' },
      { lv: '分類', q: '下面哪一組「全部」都是營養器官？', opts: ['花、果實、種子', '根、莖、葉', '根、花、種子', '葉、果實、莖'], a: 1, why: '根、莖、葉是營養器官；花、果實、種子是繁殖器官。' },
      { lv: '生活', q: '晚餐吃的番薯，是植物的哪一個部位？', opts: ['根', '莖', '葉', '果實'], a: 0, why: '番薯是根變胖、儲存養分，叫做塊根。' },
      { lv: '推理', q: '馬鈴薯長在土裡，為什麼說它是「莖」不是「根」？', opts: ['因為它很大顆', '因為它表面有芽眼，可以長出新芽', '因為它是黃色的', '因為它可以吃'], a: 1, why: '芽眼會長出新芽，這是莖的特徵，所以馬鈴薯是塊莖。' },
      { lv: '環境', q: '紅樹林的泥灘上，有很多根從泥裡往上冒出來，它們主要的功能是什麼？', opts: ['吸收陽光', '幫助根呼吸', '抓螃蟹', '儲存養分'], a: 1, why: '泥裡空氣很少，呼吸根冒出泥面，幫助根得到空氣。' },
      { lv: '實驗設計', q: '想知道「葉子會不會讓水散失」，哪個實驗最好？', opts: ['只看一株有葉子的植物', '一株有葉、一株摘掉葉子，都套塑膠袋，其他條件都一樣', '一株放室內、一株放室外', '兩株都摘掉葉子'], a: 1, why: '只改變「有沒有葉子」，其他都一樣，才能比較。' },
      { lv: '排序', q: '植物身體的層次，由小到大是哪一個？', opts: ['器官 → 細胞 → 個體', '個體 → 器官 → 細胞', '細胞 → 器官 → 個體', '細胞 → 個體 → 器官'], a: 2, why: '細胞組成器官，器官組成一整株植物。' },
      { lv: '生活', q: '牽牛花的莖一圈圈纏著竹竿往上長，這樣有什麼好處？', opts: ['比較好吃', '可以照到更多陽光', '可以吸更多水', '不會被蟲吃'], a: 1, why: '纏繞莖往上爬，葉子就能照到更多陽光。' },
    ],
  };
  // 「植物身體的層次」按鈕直接打開那張卡片
  window.LESSONS.u2a.actions[2].run = function () { const b = document.querySelector('.drawer[data-part="levels"]'); if (b) b.click(); };

  // ---------------- 二-2 植物的繁殖、二-3 植物與人類生活 ----------------
  const flowerSVG = `<svg id="flowerSvg" viewBox="0 0 600 560" role="img" aria-label="花朵剖面圖">
    <style>
      #flowerSvg .fade{transition:opacity .8s}
      #flowerSvg.fruiting .fade{opacity:0}
      #ovaryShape{transition:transform 1.2s ease,fill 1.2s ease;transform-box:fill-box;transform-origin:center bottom}
      #flowerSvg.fruiting #ovaryShape{transform:scale(1.9);fill:var(--fruit)}
      #flowerSvg .ovule{transition:fill 1.2s,transform 1.2s;transform-box:fill-box;transform-origin:center}
      #flowerSvg.fruiting .ovule{fill:var(--root);transform:scale(1.3)}
      #tube{stroke-dasharray:200;stroke-dashoffset:200}
      #flowerSvg.tubing #tube{transition:stroke-dashoffset 2.4s linear;stroke-dashoffset:0}
    </style>
    <path d="M300 560 V430" stroke="var(--stem)" stroke-width="18" stroke-linecap="round"/>
    <path d="M300 440 C250 440 205 420 180 380 C230 392 270 405 300 420Z M300 440 C350 440 395 420 420 380 C370 392 330 405 300 420Z" fill="var(--stem)" class="fade"/>
    <g class="fade" fill="var(--flower)" opacity=".92">
      <path d="M300 420 C210 410 120 330 110 200 C170 230 240 300 300 400Z"/><path d="M300 420 C390 410 480 330 490 200 C430 230 360 300 300 400Z"/>
      <path d="M300 410 C250 330 240 220 270 140 C300 190 320 290 300 410Z" opacity=".75"/>
    </g>
    <path d="M240 425 Q300 455 360 425 L345 410 Q300 430 255 410Z" fill="var(--stem)"/>
    <path id="ovaryShape" d="M262 418 C252 360 270 330 300 330 C330 330 348 360 338 418Z" fill="var(--leaf)" stroke="var(--stem)" stroke-width="3"/>
    <g fill="var(--card)" stroke="var(--stem)" stroke-width="2"><ellipse class="ovule" cx="288" cy="372" rx="8" ry="11"/><ellipse class="ovule" cx="312" cy="372" rx="8" ry="11"/><ellipse class="ovule" cx="300" cy="398" rx="8" ry="11"/></g>
    <g class="fade"><path d="M300 332 V200" stroke="var(--leaf)" stroke-width="12" stroke-linecap="round"/><path d="M276 196 Q300 170 324 196 Q300 210 276 196Z" fill="var(--fruit)" stroke="var(--root)" stroke-width="2"/></g>
    <path id="tube" class="fade" d="M300 196 V360" stroke="var(--sunc)" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g class="fade">
      <path d="M268 412 C240 360 215 300 200 250 M332 412 C360 360 385 300 400 250" stroke="var(--sunc)" stroke-width="5" fill="none"/>
      <ellipse cx="198" cy="240" rx="14" ry="22" transform="rotate(-20 198 240)" fill="var(--root)"/><ellipse cx="402" cy="240" rx="14" ry="22" transform="rotate(20 402 240)" fill="var(--root)"/>
      <g fill="var(--sunc)"><circle cx="186" cy="222" r="4"/><circle cx="208" cy="218" r="3"/><circle cx="414" cy="222" r="4"/><circle cx="392" cy="218" r="3"/></g>
    </g>
    <path id="beePath" d="M560 80 C480 60 300 120 220 210 C260 140 330 130 300 182" fill="none"/>
    <g id="beeLayer"></g>
    ${hot('petal', 140, 250, '--flower', '花瓣', 40, 300)}
    ${hot('sepal', 410, 395, '--stem', '萼片', 440, 404)}
    ${hot('stamen', 402, 240, '--root', '雄蕊', 430, 248)}
    ${hot('stigma', 300, 190, '--fruit', '柱頭', 244, 150)}
    ${hot('ovary', 300, 372, '--leaf', '子房', 160, 470)}
  </svg>`;

  window.LESSONS.u2b = {
    id: 'u2b', no: '2–3', title: '植物的繁殖與人類生活', weeks: '8–9', clip: 'fruit',
    intro: '花是植物生寶寶的地方。看蜜蜂怎麼幫花傳花粉，花又怎麼變成果實、種子怎麼去旅行；再看看人怎麼利用植物、向植物學點子。',
    svg: flowerSVG,
    chips: ['petal', 'sepal', 'stamen', 'stigma', 'ovary'],
    parts: {
      petal: { name: '花瓣', kind: '花的構造', c: '--flower', say: '花瓣通常顏色鮮豔，有的還有香味和花蜜，用來吸引蜜蜂、蝴蝶這些昆蟲飛過來，幫忙傳花粉。', points: ['顏色鮮豔，很顯眼', '有香味或花蜜，吸引昆蟲', '昆蟲來了，就能幫忙傳花粉'],
        art: `<svg viewBox="0 0 320 200"><g transform="translate(160 100)">${petals(0, 0, 46, 'var(--flower)')}<circle r="18" fill="var(--sunc)"/></g><g><ellipse rx="14" ry="9" fill="var(--sunc)"/><path d="M-4 -7 l-10 -12 M4 -7 l10 -12" stroke="var(--ink)" stroke-width="2"/><animateTransform attributeName="transform" type="translate" values="260 50;190 80;260 50" dur="3s" repeatCount="indefinite"/></g></svg>` },
      sepal: { name: '萼片', kind: '花的構造', c: '--stem', say: '萼片是花最外面綠色的小葉片。花還是花苞的時候，萼片把花包起來保護它。', points: ['在花的最外面，通常是綠色', '花苞時期把花包起來保護', '花開了以後，還托在花的下面'],
        art: `<svg viewBox="0 0 320 200"><path d="M160 200 V120" stroke="var(--stem)" stroke-width="8"/><path d="M160 130 C120 120 110 70 160 30 C210 70 200 120 160 130Z" fill="var(--flower)" opacity=".8"/><path d="M160 132 C125 130 112 95 128 60 C140 90 150 110 160 120Z M160 132 C195 130 208 95 192 60 C180 90 170 110 160 120Z" fill="var(--stem)"/></svg>` },
      stamen: { name: '雄蕊', kind: '花的構造', c: '--root', say: '雄蕊由花藥和花絲組成。花藥裡面裝著很多黃色的花粉，花粉要送到雌蕊的柱頭上，才能結出果實。', points: ['雄蕊 = 花藥 + 花絲', '花藥會產生花粉', '花粉要送到柱頭上'],
        art: `<svg viewBox="0 0 320 200"><path d="M160 200 C150 150 140 110 130 70" stroke="var(--sunc)" stroke-width="6" fill="none"/><ellipse cx="128" cy="56" rx="22" ry="34" transform="rotate(-12 128 56)" fill="var(--root)"/><g fill="var(--sunc)">${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${140 + i * 12}" cy="40" r="4"><animate attributeName="cy" values="40;10" dur="2s" begin="${i * 0.3}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2s" begin="${i * 0.3}s" repeatCount="indefinite"/></circle>`).join('')}</g></svg>` },
      stigma: { name: '雌蕊・柱頭', kind: '花的構造', c: '--fruit', say: '雌蕊由柱頭、花柱和子房組成。柱頭在最上面，常常黏黏的，可以把花粉黏住。花粉落到柱頭上，就叫做授粉。', points: ['雌蕊 = 柱頭 + 花柱 + 子房', '柱頭黏黏的，用來接住花粉', '花粉落到柱頭上，叫做授粉'],
        art: `<svg viewBox="0 0 320 200"><path d="M130 196 C120 160 135 140 160 140 C185 140 200 160 190 196Z" fill="var(--leaf)"/><path d="M160 142 V50" stroke="var(--leaf)" stroke-width="12"/><path d="M134 48 Q160 20 186 48 Q160 62 134 48Z" fill="var(--fruit)"/><g fill="var(--sunc)">${[0, 1, 2].map((i) => `<circle cx="${150 + i * 10}" r="5"><animate attributeName="cy" values="0;44" dur="1.5s" begin="${i * 0.4}s" repeatCount="indefinite"/></circle>`).join('')}</g></svg>` },
      ovary: { name: '子房・胚珠', kind: '花的構造', c: '--leaf', say: '子房在雌蕊最下面，裡面有胚珠。授粉以後，子房會慢慢長大變成果實，胚珠會變成種子。', points: ['子房在雌蕊的最下面', '子房 → 長大變成果實', '胚珠 → 變成種子'],
        art: `<svg viewBox="0 0 320 200"><path d="M40 170 C30 120 50 90 80 90 C110 90 130 120 120 170Z" fill="var(--leaf)"/><ellipse cx="80" cy="140" rx="8" ry="11" fill="var(--card)"/><path d="M140 130 h40 M170 120 l12 10 l-12 10" stroke="var(--muted)" stroke-width="4" fill="none"/><ellipse cx="250" cy="125" rx="56" ry="64" fill="var(--fruit)"/><g fill="var(--root)"><ellipse cx="236" cy="115" rx="8" ry="12"/><ellipse cx="264" cy="115" rx="8" ry="12"/><ellipse cx="250" cy="145" rx="8" ry="12"/></g></svg>` },
      insect: { name: '昆蟲傳粉', kind: '傳粉幫手・蜜蜂、蝴蝶', c: '--flower', say: '蜜蜂和蝴蝶來吸花蜜時，身上會沾到花粉，飛到下一朵花時就把花粉帶到柱頭上。靠昆蟲傳粉的花，通常顏色鮮豔、有香味、有花蜜。', points: ['花顏色鮮豔、有香味、有花蜜', '昆蟲身上沾了花粉帶到別朵花', '例子：油菜花、向日葵'],
        art: `<svg viewBox="0 0 160 110"><g transform="translate(60 62)">${petals(0, 0, 22, 'var(--flower)')}<circle r="9" fill="var(--sunc)"/></g><g transform="translate(118 36)"><ellipse rx="12" ry="8" fill="var(--sunc)"/><path d="M0 -8 v8 M5 -8 v8" stroke="var(--ink)" stroke-width="2"/><ellipse cx="-3" cy="-10" rx="7" ry="5" fill="var(--card)"/></g></svg>` },
      wind: { name: '風力傳粉', kind: '傳粉幫手・玉米、稻子', c: '--stem', say: '玉米和稻子的花很小，不鮮豔也沒有香味，但是會產生很多又輕又小的花粉，讓風把花粉吹到別的花上。', points: ['花小、不鮮豔、沒有香味', '花粉又多又輕', '例子：玉米、稻子、芒草'],
        art: `<svg viewBox="0 0 160 110"><path d="M60 110 V30" stroke="var(--stem)" stroke-width="5"/><path d="M60 30 l-14 -18 M60 30 l0 -22 M60 30 l14 -18" stroke="var(--fruit)" stroke-width="3"/><path d="M60 70 C40 60 30 50 24 36 M60 80 C80 70 90 60 100 48" stroke="var(--leaf)" stroke-width="4" fill="none"/><g fill="var(--sunc)">${[0, 1, 2, 3].map((i) => `<circle cx="${80 + i * 18}" cy="${20 + i * 6}" r="3"/>`).join('')}</g><path d="M90 40 q20 -10 40 0 M96 54 q20 -10 40 0" stroke="var(--muted)" stroke-width="2" fill="none"/></svg>` },
      bird: { name: '鳥類傳粉', kind: '傳粉幫手・綠繡眼', c: '--leaf', say: '有些鳥像綠繡眼，會把頭伸進花裡吸花蜜，頭上的羽毛沾到花粉，就幫花傳粉了。', points: ['鳥吸花蜜時頭上沾到花粉', '飛到別朵花時把花粉帶過去', '例子：綠繡眼吸木棉的花蜜'],
        art: `<svg viewBox="0 0 160 110"><g transform="translate(46 60)">${petals(0, 0, 20, 'var(--acid)')}<circle r="8" fill="var(--sunc)"/></g><g transform="translate(110 56)"><ellipse rx="24" ry="16" fill="var(--leaf)"/><circle cx="-18" cy="-8" r="11" fill="var(--leaf)"/><circle cx="-21" cy="-10" r="4" fill="var(--card)"/><circle cx="-21" cy="-10" r="2" fill="var(--ink)"/><path d="M-28 -8 l-14 2" stroke="var(--ink)" stroke-width="3"/></g></svg>` },
      hand: { name: '人工授粉', kind: '傳粉幫手・果農', c: '--root', say: '有些果樹沒有足夠的昆蟲來幫忙，果農就用毛筆沾花粉，一朵一朵刷到柱頭上，這叫做人工授粉，可以讓果樹結更多果實。', points: ['人用毛筆把花粉刷到柱頭上', '讓果樹結出更多果實', '例子：梨子、火龍果'],
        art: `<svg viewBox="0 0 160 110"><g transform="translate(56 64)">${petals(0, 0, 20, 'var(--card)')}<circle r="8" fill="var(--sunc)"/></g><path d="M140 10 L76 56" stroke="var(--root)" stroke-width="6" stroke-linecap="round"/><path d="M80 52 L66 64" stroke="var(--ink)" stroke-width="8" stroke-linecap="round"/></svg>` },
      orchid: { name: '蝴蝶蘭', kind: '品種保存・組織培養', c: '--flower', say: '台灣的蝴蝶蘭很有名，會外銷到很多國家。人們挑出漂亮的品種，用組織培養的方法，在實驗室裡一次培育出很多一模一樣的小苗。', points: ['挑出漂亮、好照顧的品種', '組織培養：一次培育很多一樣的小苗', '台灣蝴蝶蘭外銷世界各國'],
        art: `<svg viewBox="0 0 160 110"><path d="M40 108 C40 60 70 30 110 20" stroke="var(--stem)" stroke-width="3" fill="none"/>${[[66, 44], [92, 30], [118, 24]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse cx="-9" rx="10" ry="8" fill="var(--flower)"/><ellipse cx="9" rx="10" ry="8" fill="var(--flower)"/><ellipse cy="7" rx="5" ry="6" fill="var(--acid)"/></g>`).join('')}<path d="M30 108 c-10 -10 -14 -20 -6 -26 c10 6 10 16 6 26Z M48 108 c10 -10 14 -20 6 -26 c-10 6 -10 16 -6 26Z" fill="var(--leaf)"/></svg>` },
      atemoya: { name: '鳳梨釋迦', kind: '品種改良・雜交', c: '--leaf', say: '鳳梨釋迦不是鳳梨和釋迦合起來的！它是釋迦和另一種叫冷子番荔枝的植物雜交，培育出來的新品種，吃起來有一點鳳梨的香味，所以叫鳳梨釋迦。', points: ['釋迦 × 冷子番荔枝 雜交而來', '果肉比較好剝、比較耐放', '名字有鳳梨，是因為味道像鳳梨'],
        art: `<svg viewBox="0 0 160 110"><ellipse cx="80" cy="62" rx="40" ry="44" fill="var(--leaf)"/><g fill="none" stroke="var(--stem)" stroke-width="2">${[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => `<path d="M${52 + c * 16} ${30 + r * 16} q8 6 16 0"/>`).join('')).join('')}</g><path d="M80 18 v-12" stroke="var(--root)" stroke-width="4"/></svg>` },
      mango: { name: '芒果', kind: '品種保存・嫁接', c: '--fruit', say: '果農把好吃芒果品種的枝條，接到另一棵長得強壯的芒果樹上，這叫嫁接。這樣長出的芒果，會保持原來好吃的品質。', points: ['嫁接：把好品種的枝條接到強壯的樹上', '長出的果實保持好品質', '例子：愛文芒果、金煌芒果'],
        art: `<svg viewBox="0 0 160 110"><path d="M80 108 V50" stroke="var(--root)" stroke-width="8"/><rect x="72" y="56" width="16" height="10" fill="var(--sunc)"/><path d="M80 50 C60 30 50 20 40 18 M80 50 C100 30 110 22 124 20" stroke="var(--root)" stroke-width="4" fill="none"/><ellipse cx="44" cy="34" rx="10" ry="14" fill="var(--fruit)" transform="rotate(-20 44 34)"/><ellipse cx="118" cy="36" rx="10" ry="14" fill="var(--acid)" transform="rotate(20 118 36)"/></svg>` },
      tea: { name: '茶樹', kind: '品種保存・扦插', c: '--stem', say: '茶農會剪下好品種茶樹的枝條，插進土裡長成新的茶樹，這叫扦插。用扦插種出來的茶樹，和原來那棵一樣好，茶葉的品質就會很穩定。', points: ['扦插：剪下枝條插進土裡長成新樹', '新茶樹和原來那棵一樣', '用種子種，長出來可能不一樣'],
        art: `<svg viewBox="0 0 160 110"><rect y="80" width="160" height="30" fill="var(--soil)"/><path d="M80 98 V40" stroke="var(--root)" stroke-width="4"/>${[[70, 46, -30], [90, 54, 30], [70, 62, -30], [90, 70, 30]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="6" fill="var(--leaf)" transform="rotate(${r} ${x} ${y})"/>`).join('')}<path d="M80 98 l-10 10 M80 98 l10 10" stroke="var(--root)" stroke-width="2"/></svg>` },
      velcro: { name: '魔鬼氈', kind: '向植物學點子・大花咸豐草', c: '--root', say: '大花咸豐草的果實上有很多細小的倒鉤刺，會鉤在動物的毛或我們的褲子上，被帶到遠方。人們模仿這個構造，發明了魔鬼氈。', points: ['果實上有細小的倒鉤刺', '會鉤住動物的毛，被帶到遠方', '人模仿它，做出魔鬼氈'],
        art: `<svg viewBox="0 0 160 110"><g stroke="var(--root)" stroke-width="3" stroke-linecap="round">${[0, 1, 2, 3, 4].map((i) => `<path d="M${40 + i * 10} 90 L${30 + i * 14} 30 M${30 + i * 14} 30 l-4 -6 M${30 + i * 14} 30 l4 -6"/>`).join('')}</g><g stroke="var(--muted)" stroke-width="2" fill="none">${[0, 1, 2, 3].map((i) => `<path d="M${110 + i * 10} 90 v-14 a4 4 0 0 1 8 0"/>`).join('')}</g></svg>` },
      lotusleaf: { name: '防水材料', kind: '向植物學點子・荷葉', c: '--water', say: '下雨後，荷葉上的水會變成一顆顆水珠滾下去，順便把灰塵帶走，因為荷葉表面有很多非常細小的突起。人們學它，做出防水又不容易髒的材料。', points: ['荷葉表面有很細小的突起', '水變成水珠滾走，帶走灰塵', '人學它做出防水、防髒的材料'],
        art: `<svg viewBox="0 0 160 110"><ellipse cx="80" cy="70" rx="70" ry="26" fill="var(--leaf)"/><path d="M80 70 L80 108" stroke="var(--stem)" stroke-width="4"/><g fill="var(--water)" opacity=".85"><circle cx="60" cy="58" r="7"><animate attributeName="cx" values="60;140" dur="3s" repeatCount="indefinite"/></circle><circle cx="96" cy="62" r="5"/><circle cx="40" cy="66" r="4"/></g></svg>` },
      burst: { name: '彈力傳播', kind: '種子去旅行・鳳仙花、綠豆', c: '--fruit', say: '鳳仙花和綠豆的果實成熟乾掉以後，會突然裂開，把種子彈到旁邊比較遠的地方。', points: ['果實成熟後突然裂開', '靠自己的彈力把種子彈出去', '例子：鳳仙花、綠豆、豌豆'],
        art: `<svg viewBox="0 0 160 110"><path d="M80 108 V60" stroke="var(--stem)" stroke-width="4"/><path d="M80 60 C60 50 52 30 62 14 M80 60 C100 50 108 30 98 14" stroke="var(--leaf)" stroke-width="7" fill="none" stroke-linecap="round"/><g fill="var(--root)">${[[40, 30], [124, 24], [30, 60], [134, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g><path d="M50 30 h-4 M114 24 h4 M40 60 h-4 M124 58 h4" stroke="var(--muted)" stroke-width="2"/></svg>` },
      windseed: { name: '風力傳播', kind: '種子去旅行・蒲公英、青楓', c: '--sky-dark', say: '蒲公英的種子上有像降落傘一樣的白色冠毛，青楓的果實有翅膀，風一吹就能飄到很遠的地方。', points: ['種子又小又輕', '有冠毛或翅膀，可以被風吹走', '例子：蒲公英、青楓、昭和草'],
        art: `<svg viewBox="0 0 160 110"><path d="M40 108 V50" stroke="var(--stem)" stroke-width="3"/><circle cx="40" cy="40" r="16" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="3 3"/>${[[90, 40], [120, 22], [140, 52]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 v14" stroke="var(--root)" stroke-width="2"/>${[-40, -20, 0, 20, 40].map((r) => `<path d="M0 0 l0 -10" stroke="var(--muted)" stroke-width="1.5" transform="rotate(${r})"/>`).join('')}</g>`).join('')}<path d="M60 70 q20 -8 40 0 M70 86 q20 -8 40 0" stroke="var(--muted)" stroke-width="2" fill="none"/></svg>` },
      waterseed: { name: '水力傳播', kind: '種子去旅行・椰子、棋盤腳', c: '--water', say: '椰子的果實外面有很厚、很輕的纖維，可以浮在海上漂流，漂到別的海岸再發芽長大。', points: ['果實很輕、可以浮在水上', '跟著海水或河水漂到遠方', '例子：椰子、棋盤腳、蓮蓬'],
        art: `<svg viewBox="0 0 160 110"><rect y="64" width="160" height="46" fill="var(--water)" opacity=".5"/><path d="M0 64 q20 -8 40 0 t40 0 t40 0 t40 0" stroke="var(--water)" stroke-width="3" fill="none"/><ellipse cx="80" cy="62" rx="24" ry="18" fill="var(--root)"/><ellipse cx="74" cy="56" rx="6" ry="4" fill="var(--card)" opacity=".5"/><path d="M110 50 h24 l-6 -6 M134 50 l-6 6" stroke="var(--muted)" stroke-width="2" fill="none"/></svg>` },
      animalseed: { name: '動物傳播', kind: '種子去旅行・大花咸豐草、榕樹', c: '--root', say: '大花咸豐草的果實有倒鉤刺，會鉤在動物的毛上被帶走；鳥吃了榕樹的果實，種子會跟著糞便排出，掉在別的地方發芽。', points: ['果實有鉤刺，黏在動物身上', '果實被動物吃掉，種子隨糞便排出', '例子：大花咸豐草、榕樹、蒼耳'],
        art: `<svg viewBox="0 0 160 110"><ellipse cx="96" cy="66" rx="50" ry="30" fill="var(--wood)"/><circle cx="46" cy="52" r="18" fill="var(--wood)"/><circle cx="40" cy="48" r="3" fill="var(--ink)"/><g stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round">${[[86, 40], [104, 38], [120, 44]].map(([x, y]) => `<path d="M${x} ${y + 8} L${x} ${y - 10} M${x} ${y - 10} l-4 -5 M${x} ${y - 10} l4 -5"/>`).join('')}</g></svg>` },
      stemprop: { name: '用莖繁殖', kind: '不用種子也能繁殖・吊蘭、馬鈴薯', c: '--stem', say: '吊蘭會長出走莖，末端長出小吊蘭；馬鈴薯的芽眼會發芽；剪一段黃金葛或萬年青的莖插在水裡，也會長根變成新植物。', points: ['用莖長出新的植物', '例子：吊蘭、馬鈴薯', '例子：黃金葛、萬年青（剪莖插水或插土）'],
        art: `<svg viewBox="0 0 160 110"><rect x="20" y="40" width="40" height="66" rx="6" fill="var(--water)" opacity=".45" stroke="var(--muted)" stroke-width="2"/><path d="M40 106 V20" stroke="var(--stem)" stroke-width="4"/><ellipse cx="54" cy="24" rx="14" ry="8" fill="var(--leaf)" transform="rotate(-20 54 24)"/><path d="M40 98 l-8 8 M40 98 l8 8 M40 92 l-10 4" stroke="var(--root)" stroke-width="2"/><ellipse cx="116" cy="74" rx="30" ry="22" fill="var(--sunc)" opacity=".85"/><circle cx="104" cy="66" r="3" fill="var(--root)"/><path d="M104 66 q-2 -14 6 -22" stroke="var(--leaf)" stroke-width="3" fill="none"/></svg>` },
      leafprop: { name: '用葉繁殖', kind: '不用種子也能繁殖・落地生根、石蓮', c: '--leaf', say: '落地生根的葉子邊緣會長出小芽和小根，葉子掉到土上就能長成新植物。石蓮的葉子放在土上，也會長出新的小植株。', points: ['用葉子長出新的植物', '落地生根：葉緣長出小芽', '石蓮：葉子放在土上會長根發芽'],
        art: `<svg viewBox="0 0 160 110"><rect y="86" width="160" height="24" fill="var(--soil)"/><path d="M20 80 C50 50 110 50 140 80 C110 92 50 92 20 80Z" fill="var(--leaf)"/>${[40, 62, 84, 106, 126].map((x) => `<g transform="translate(${x} ${x === 40 || x === 126 ? 76 : 62})"><path d="M0 0 q-5 -10 0 -16 q5 6 0 16" fill="var(--stem)"/><path d="M0 2 v8" stroke="var(--root)" stroke-width="1.5"/></g>`).join('')}</svg>` },
      rootprop: { name: '用根繁殖', kind: '不用種子也能繁殖・番薯', c: '--root', say: '番薯是塊根，把番薯放在潮濕的地方，它會長出新芽和葉子，切下來種就能長成新的番薯藤。', points: ['用根長出新的植物', '番薯（塊根）會長出新芽', '剪下番薯藤種下去也能繁殖'],
        art: `<svg viewBox="0 0 160 110"><ellipse cx="80" cy="74" rx="50" ry="24" fill="var(--flower)" transform="rotate(-8 80 74)"/><path d="M70 54 q-6 -20 4 -38 M92 52 q6 -18 -2 -34" stroke="var(--stem)" stroke-width="3" fill="none"/><ellipse cx="74" cy="16" rx="10" ry="6" fill="var(--leaf)"/><ellipse cx="90" cy="18" rx="10" ry="6" fill="var(--leaf)"/><path d="M40 88 l-10 14 M120 80 l12 14" stroke="var(--root)" stroke-width="2"/></svg>` },
    },
    actions: [
      { label: '🐝 蜜蜂來授粉', sub: '花粉從雄蕊送到柱頭', c: '#c06a8e', run(api) {
        const svg = api.svg.querySelector('svg'); svg.classList.remove('fruiting', 'tubing');
        const layer = svg.querySelector('#beeLayer'); layer.innerHTML = '';
        const bee = window.H.mover(api, layer, '<ellipse rx="18" ry="12" fill="var(--sunc)"/><path d="M-4 -11 v22 M5 -11 v22" stroke="var(--ink)" stroke-width="3"/><ellipse cx="-4" cy="-16" rx="10" ry="7" fill="#fff" opacity=".9"/><ellipse cx="8" cy="-15" rx="9" ry="6" fill="#fff" opacity=".9"/><g class="pol" fill="var(--sunc)" stroke="var(--root)" opacity="0"><circle cx="-8" cy="10" r="4"/><circle cx="6" cy="12" r="4"/></g>', 'beePath', 4.5, 0);
        api.later(() => { const p = bee.querySelector('.pol'); if (p) p.setAttribute('opacity', '1'); }, 2300);
        api.later(() => svg.classList.add('tubing'), 4600);
        api.say('蜜蜂飛來吸花蜜，身上沾到了雄蕊的花粉。牠再飛到柱頭上，花粉就黏在柱頭上，這就是授粉。接著花粉會長出一條管子，往下通到子房裡的胚珠。', 'media/pollinate.mp3');
      } },
      { label: '🍐 花變成果實', sub: '子房長大、胚珠變種子', c: '#c08a1e', run(api) {
        const svg = api.svg.querySelector('svg'); svg.querySelector('#beeLayer').innerHTML = ''; svg.classList.remove('tubing');
        svg.classList.toggle('fruiting');
        if (svg.classList.contains('fruiting')) api.say('授粉以後，花瓣、雄蕊慢慢枯掉掉落，子房一天一天長大變成果實，裡面的胚珠就變成了種子。再按一次可以變回花朵。', 'media/tofruit.mp3');
        else api.say('變回花朵了。');
      } },
    ],
    facts: [{ t: '雄蕊', d: '花藥 + 花絲，花藥裡有花粉', c: '--root' }, { t: '雌蕊', d: '柱頭 + 花柱 + 子房，子房裡有胚珠', c: '--leaf' }],
    drawers: [
      { title: '誰來幫忙傳花粉？', desc: '花自己不會走路，要靠別人幫忙把花粉送到柱頭上。', ids: ['insect', 'wind', 'bird', 'hand'] },
      { title: '種子怎麼去旅行？', desc: '不同外形的果實和種子，靠彈力、風、水或動物傳播到遠方。', ids: ['burst', 'windseed', 'waterseed', 'animalseed'] },
      { title: '不用種子也能繁殖', desc: '有些植物可以用根、莖、葉長出新的植物。', ids: ['stemprop', 'leafprop', 'rootprop'] },
      { title: '植物與人類生活', desc: '人會保存好品種、改良出新品種，還會向植物學點子做出新發明。', ids: ['orchid', 'atemoya', 'mango', 'tea', 'velcro', 'lotusleaf'] },
    ],
    quiz: [
      { lv: '點圖', q: '在花朵圖上，點出「會產生花粉」的部位。', tap: 'stamen', why: '雄蕊的花藥裡面有花粉。' },
      { lv: '點圖', q: '在花朵圖上，點出「用來接住花粉」的部位。', tap: 'stigma', why: '柱頭黏黏的，可以把花粉黏住。' },
      { lv: '點圖', q: '在花朵圖上，點出「授粉後會長大變成果實」的部位。', tap: 'ovary', why: '子房授粉後會長大變成果實。' },
      { lv: '點圖', q: '在花朵圖上，點出「花苞時期保護花」的部位。', tap: 'sepal', why: '萼片在最外面，花苞時把花包起來。' },
      { lv: '理解', q: '子房裡的「胚珠」，以後會變成什麼？', opts: ['果皮', '種子', '花瓣', '葉子'], a: 1, why: '子房變果實，胚珠變種子。' },
      { lv: '理解', q: '什麼叫做「授粉」？', opts: ['蜜蜂吃花蜜', '花瓣掉下來', '花粉落到雌蕊的柱頭上', '種子掉到土裡'], a: 2, why: '花粉從雄蕊被送到雌蕊的柱頭上，就叫授粉。' },
      { lv: '是非', q: '「花瓣鮮豔、有香味，主要是為了吸引昆蟲來幫忙傳粉。」這句話對嗎？', opts: ['對', '不對'], a: 0, why: '靠昆蟲傳粉的花，會用顏色、香味和花蜜吸引昆蟲。' },
      { lv: '推理', q: '玉米的花小小的、不鮮豔，但花粉又多又輕。它最可能靠什麼傳粉？', opts: ['蜜蜂', '風', '鳥', '人'], a: 1, why: '靠風傳粉的花不需要吸引昆蟲，但要有很多又輕的花粉。' },
      { lv: '生活', q: '果農拿毛筆在花上刷來刷去，是在做什麼？', opts: ['幫花洗澡', '趕走蟲子', '人工授粉', '幫花上色'], a: 2, why: '用毛筆把花粉刷到柱頭上，就是人工授粉。' },
      { lv: '生活', q: '茶農想讓新茶樹的品質和原來的一樣好，最常用哪種方法？', opts: ['撒種子', '扦插（剪枝條插進土裡）', '移到室內', '多澆水'], a: 1, why: '扦插長出的茶樹和原來那棵一樣；種子長出來的可能不一樣。' },
      { lv: '仿生', q: '魔鬼氈是模仿哪一種植物的構造發明出來的？', opts: ['荷葉', '大花咸豐草的果實', '蒲公英', '仙人掌'], a: 1, why: '大花咸豐草果實上有細小的倒鉤刺，人們學它做出魔鬼氈。' },
      { lv: '迷思', q: '關於「鳳梨釋迦」，下面哪一句是對的？', opts: ['它是鳳梨和釋迦接在一起長的', '它是釋迦和冷子番荔枝雜交培育出的新品種', '它是釋迦泡過鳳梨汁', '它是野外自然長出來的'], a: 1, why: '鳳梨釋迦是雜交改良的新品種，名字有鳳梨是因為味道像鳳梨。' },
      { lv: '生活', q: '芒果農把好品種的枝條接到強壯的樹上，這種方法叫什麼？', opts: ['扦插', '嫁接', '播種', '組織培養'], a: 1, why: '嫁接可以讓長出的芒果保持原本好吃的品質。' },
    ],
  };
})();
