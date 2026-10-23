/* 單元一 認識植物 */
G.types.plantLabel = function (lv, area, api) {
  /* 每個部位：名稱、標籤框位置（svg 座標，左/右側）、指向點 */
  var parts = [
    { t: '花', side: 'R', y: 70, px: 212, py: 88 },
    { t: '果實', side: 'R', y: 175, px: 280, py: 178 },
    { t: '種子', side: 'R', y: 290, px: 282, py: 296 },
    { t: '葉', side: 'L', y: 150, px: 150, py: 165 },
    { t: '莖', side: 'L', y: 225, px: 197, py: 222 },
    { t: '根', side: 'L', y: 395, px: 185, py: 392 }
  ];
  var lines = parts.map(function (p) {
    var x = p.side === 'L' ? 100 : 300;
    return '<line x1="' + x + '" y1="' + p.y + '" x2="' + p.px + '" y2="' + p.py + '" stroke="#ff9a4d" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="' + p.px + '" cy="' + p.py + '" r="4" fill="#ff9a4d"/>';
  }).join('');
  var svg = '<svg viewBox="0 0 400 440" aria-label="植物的身體">' +
    '<rect x="0" y="330" width="400" height="110" fill="#d8b48a"/><rect x="0" y="330" width="400" height="8" fill="#a8d672"/>' +
    '<g stroke="#8d5a2b" stroke-width="5" fill="none" stroke-linecap="round">' +
    '<path d="M200 335 L200 380 M200 350 Q175 370 160 410 M200 360 Q230 380 245 420 M200 380 Q190 400 185 430 M175 380 Q150 385 135 400 M222 378 Q250 382 268 395"/></g>' +
    '<path d="M200 335 L200 95" stroke="#3f9b3a" stroke-width="10" stroke-linecap="round"/>' +
    '<path d="M200 205 Q230 190 258 172" stroke="#3f9b3a" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<g fill="#5cc24f" stroke="#2f8a35" stroke-width="2">' +
    '<ellipse cx="160" cy="268" rx="40" ry="16" transform="rotate(-25 160 268)"/>' +
    '<ellipse cx="240" cy="250" rx="40" ry="16" transform="rotate(22 240 250)"/>' +
    '<ellipse cx="163" cy="165" rx="36" ry="14" transform="rotate(-30 163 165)"/></g>' +
    '<g stroke="#2f8a35" stroke-width="1.5"><line x1="126" y1="284" x2="194" y2="252"/><line x1="203" y1="234" x2="277" y2="266"/><line x1="133" y1="183" x2="194" y2="147"/></g>' +
    '<g fill="#ff8fb8">' + [0, 72, 144, 216, 288].map(function (a) {
      var r = a * Math.PI / 180; return '<circle cx="' + (200 + 20 * Math.cos(r)).toFixed(1) + '" cy="' + (78 + 20 * Math.sin(r)).toFixed(1) + '" r="15"/>';
    }).join('') + '</g><circle cx="200" cy="78" r="11" fill="#ffd23c"/>' +
    '<circle cx="268" cy="180" r="17" fill="#ff5a4e"/><path d="M262 166 q6 -8 12 -2" stroke="#3f9b3a" stroke-width="3" fill="none"/>' +
    '<circle cx="282" cy="296" r="22" fill="#ffe2b0" stroke="#ff5a4e" stroke-width="5"/>' +
    '<g fill="#6b3d1a"><ellipse cx="275" cy="290" rx="3.5" ry="5"/><ellipse cx="289" cy="290" rx="3.5" ry="5"/><ellipse cx="275" cy="304" rx="3.5" ry="5"/><ellipse cx="289" cy="304" rx="3.5" ry="5"/><ellipse cx="282" cy="297" rx="3.5" ry="5"/></g>' +
    '<text x="282" y="333" font-size="12" text-anchor="middle" fill="#6b3d1a" font-weight="700">切開的果實</text>' +
    lines + '</svg>';
  var boxes = parts.map(function (p, k) {
    var left = p.side === 'L' ? 1 : 75;
    var top = ((p.y - 23) / 440 * 100).toFixed(2);
    return '<div class="drop" data-k="' + k + '" style="left:' + left + '%;top:' + top + '%">？</div>';
  }).join('');
  area.innerHTML = '<div class="panel"><div class="bar"><span>還剩 <b class="left">6</b> 個名稱</span><span>💡 拖曳名稱，或點名稱再點框框</span></div>' +
    '<div class="labelwrap">' + svg + boxes + '</div><div class="pool"></div></div>';
  var left = parts.length, pool = G.$('.pool', area);
  area.querySelectorAll('.drop').forEach(G.makeDrop);
  G.shuffle(parts.map(function (p, k) { return k; })).forEach(function (k) {
    var c = document.createElement('div'); c.className = 'chip'; c.innerHTML = '<span>' + parts[k].t + '</span>'; pool.appendChild(c);
    G.makeDrag(c, function (chip, box) {
      if (box.classList.contains('done')) return;
      if (+box.dataset.k === k) {
        G.sfx.ok(); box.textContent = parts[k].t; box.classList.add('done'); G.bump(box, 'pop'); chip.remove();
        left--; G.$('.left', area).textContent = left;
        if (!left) setTimeout(api.finish, 700);
      } else { G.sfx.bad(); api.miss(); G.bump(box, 'shake'); }
    });
  });
};

G.units.push({
  id: 'u1', no: '一', name: '認識植物', e: '🌱', c: '#4caf50',
  sub: '植物與環境・植物的身體・植物與生活',
  levels: [
    {
      name: '植物身體大拼圖', kind: 'op', type: 'plantLabel', th: [0, 2],
      inst: '植物的身體可以分成根、莖、葉、花、果實和種子。把名稱拖到正確的框框裡！',
      recap: '植物的身體可以分成<b>根、莖、葉、花、果實、種子</b>六個部位。'
    },
    {
      name: '植物小博士', kind: 'idea', type: 'quiz', pick: 8, th: [1, 3],
      inst: '想一想植物需要什麼、各部位有什麼用，選出正確答案。',
      recap: '植物生長需要<b>陽光、空氣、水和土壤</b>；根吸水固定、莖支撐運送、葉多半是綠色有葉脈、花會變成果實、種子能長成新植物。',
      qs: [
        { q: '植物要長得好，<b>不需要</b>下面哪一樣？', opts: ['糖果', '陽光', '水', '空氣'], a: 0, why: '植物生長需要陽光、空氣、水和土壤，不需要糖果。' },
        { q: '植物的哪個部位通常長在土裡，可以吸收水分、抓住土壤？', big: '🌱', opts: ['根', '莖', '葉', '花'], a: 0, why: '根長在土裡，能吸收水分，也能把植物固定住。' },
        { q: '把芹菜插在紅色的水裡，過一陣子莖變紅了。這表示莖可以做什麼？', opts: ['把水運送到植物的其他部位', '幫植物曬太陽', '讓植物開花', '把水變紅'], a: 0, why: '莖能支撐植物，也能把根吸收的水運送到葉子和花。' },
        { q: '葉子上一條一條的紋路叫做什麼？', big: '🍃', opts: ['葉脈', '葉柄', '樹皮', '花瓣'], a: 0, why: '葉子上的紋路叫做葉脈，不同植物的葉脈形狀不一樣。' },
        { q: '植物的花謝了以後，常常會長出什麼？', big: '🌸 ➜ ❓', opts: ['果實', '根', '更多的莖', '泥土'], a: 0, why: '花謝了以後，常會長出果實，果實裡面有種子。' },
        { q: '把種子種到土裡，澆水照顧，會發生什麼事？', big: '🫘', opts: ['長出新的植物', '變成石頭', '變成果汁', '什麼都不會發生'], a: 0, why: '種子能長成新的植物，所以種子可以幫助植物繁殖。' },
        { q: '仙人掌住在很乾的沙漠，它的莖胖胖的，有什麼好處？', big: '🌵', opts: ['可以儲存很多水', '可以開更多花', '可以長得更快', '可以讓動物來吃'], a: 0, why: '仙人掌的莖可以儲存水分，葉子變成刺，能減少水分散失，適應乾燥的環境。' },
        { q: '睡蓮長在水裡，它的葉子浮在水面上。這說明了什麼？', big: '🪷', opts: ['植物的樣子和生長環境有關', '睡蓮不需要陽光', '所有植物都長在水裡', '睡蓮沒有根'], a: 0, why: '植物的樣子和生長環境有密切關係，睡蓮的葉子浮在水面，比較容易照到陽光。' },
        { q: '我們穿的棉T恤，是用哪一種植物做的？', big: '👕', opts: ['棉花', '竹子', '玫瑰', '稻子'], a: 0, why: '棉花的種子上有白白的棉絮，可以紡成棉線，做成衣服。' },
        { q: '魔鬼氈的設計，是科學家學習哪一種植物的果實？', opts: ['會黏在衣服上的蒼耳', '光滑的蘋果', '很大的西瓜', '黃色的香蕉'], a: 0, why: '蒼耳的果實上有很多小鉤子，會鉤在衣服上，科學家學它做出了魔鬼氈。' },
        { q: '荷葉上的水會變成小水珠滾下去，人們學這個特性做出了什麼？', big: '💧', opts: ['不容易弄濕弄髒的防水材料', '吸水的毛巾', '會發光的燈', '跑很快的鞋子'], a: 0, why: '荷葉表面不容易沾水，人們學習它，做出防水、不易髒的材料。' },
        { q: '下面哪一個<b>不是</b>用植物做成的？', opts: ['鐵釘', '木頭桌子', '紙張', '白米飯'], a: 0, why: '鐵釘是金屬做的；桌子用木材、紙用木漿、米來自稻子，都來自植物。' }
      ]
    },
    {
      name: '餐桌上的植物', kind: 'boss', type: 'sort', th: [1, 3],
      inst: '我們吃的蔬菜水果，是植物的哪一個部位？把食物放進正確的籃子！',
      recap: '地瓜、紅蘿蔔吃<b>根</b>；甘蔗、竹筍、馬鈴薯吃<b>莖</b>；高麗菜、菠菜吃<b>葉</b>；花椰菜、金針吃<b>花</b>；蘋果、番茄吃<b>果實</b>；花生、綠豆、米吃<b>種子</b>。',
      bins: [
        { k: 'root', t: '根', e: '🟤', c: '#a0703f' },
        { k: 'stem', t: '莖', e: '🟩', c: '#3f9b3a' },
        { k: 'leaf', t: '葉', e: '🍃', c: '#5cc24f' },
        { k: 'flower', t: '花', e: '🌼', c: '#ff8fb8' },
        { k: 'fruit', t: '果實', e: '🍎', c: '#ff5a4e' },
        { k: 'seed', t: '種子', e: '🫘', c: '#b07a3a' }
      ],
      items: [
        { t: '地瓜', e: '🍠', k: 'root', hint: '地瓜長在土裡，是胖胖的根。' },
        { t: '紅蘿蔔', e: '🥕', k: 'root', hint: '紅蘿蔔是長在土裡的根。' },
        { t: '甘蔗', e: '🎋', k: 'stem', hint: '甘蔗甜甜的那一節一節，是它的莖。' },
        { t: '竹筍', e: '🎍', k: 'stem', hint: '竹筍是竹子剛長出來的嫩莖。' },
        { t: '馬鈴薯', e: '🥔', k: 'stem', hint: '馬鈴薯雖然長在土裡，但它上面有「芽眼」，是變胖的莖喔！' },
        { t: '高麗菜', e: '🥬', k: 'leaf', hint: '高麗菜是一片一片的葉子包起來的。' },
        { t: '菠菜', e: '🌿', k: 'leaf', hint: '菠菜主要吃它綠綠的葉子。' },
        { t: '花椰菜', e: '🥦', k: 'flower', hint: '花椰菜一粒一粒的是還沒開的花。' },
        { t: '金針', e: '🌼', k: 'flower', hint: '金針是金針花的花苞。' },
        { t: '蘋果', e: '🍎', k: 'fruit', hint: '蘋果是花謝後長出來的果實。' },
        { t: '番茄', e: '🍅', k: 'fruit', hint: '番茄裡面有種子，是果實。' },
        { t: '花生', e: '🥜', k: 'seed', hint: '花生仁是種在土裡會發芽的種子。' },
        { t: '綠豆', e: '🫛', k: 'seed', hint: '綠豆泡水會發芽，是種子。' },
        { t: '白米', e: '🍚', k: 'seed', hint: '米是稻子的種子去殼後得到的。' }
      ]
    }
  ]
});
