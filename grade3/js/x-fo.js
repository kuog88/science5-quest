/* 三版本補充單元：生活中的力（康軒三上「生活中的力」活動 1、3；南一、翰林放在四下）
   三關由四下「生活中有趣的力」搬來，改成三上探險島的畫面，並補上原子筆彈簧、水車傳送動力兩題 */

/* ---------- 題型：畫出力的箭頭 arrow ---------- */
/* lv.rounds: [{story, obj, pt:'L'|'R'|'T'|'B', dir:'→'|'←'|'↑'|'↓', len:格數, why}]；lv.unit 每格代表多少 */
G.types.arrow = function (lv, area, api) {
  var rounds = G.shuffle(lv.rounds).slice(0, lv.pick || lv.rounds.length), r = 0;
  var CELL = 40, BX = 260, BY = 210, BW = 120, BH = 80;
  var PTS = { L: [BX, BY + BH / 2, '左側'], R: [BX + BW, BY + BH / 2, '右側'], T: [BX + BW / 2, BY, '上面'], B: [BX + BW / 2, BY + BH, '下面'] };
  var DV = { '→': [1, 0], '←': [-1, 0], '↑': [0, -1], '↓': [0, 1] };
  function show() {
    var R = rounds[r], pt = null, dir = null, len = 1, solved = false;
    var grid = '';
    for (var x = 20; x <= 620; x += CELL) for (var y = 10; y <= 410; y += CELL) grid += '<circle cx="' + x + '" cy="' + y + '" r="2" fill="#d9c49c"/>';
    area.innerHTML = '<div class="panel"><div class="bar"><span>第 ' + (r + 1) + ' / ' + rounds.length + ' 題</span><span>📏 方格紙上 1 格代表 ' + lv.unit + '</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀">🔈</button><div class="q">' + R.story + '<br><small>① 點選<b>作用點</b>（白色圓點）② 選<b>方向</b> ③ 調整箭頭<b>長度</b>（大小）</small></div></div>' +
      '<svg class="arrowsvg" viewBox="0 0 640 420" role="img" aria-label="方格紙">' + grid +
      '<line x1="0" y1="' + (BY + BH) + '" x2="640" y2="' + (BY + BH) + '" stroke="#8a5530" stroke-width="4"/>' +
      '<rect x="' + BX + '" y="' + BY + '" width="' + BW + '" height="' + BH + '" rx="8" fill="#e8b46a" stroke="#6b3f1f" stroke-width="3"/>' +
      '<text x="' + (BX + BW / 2) + '" y="' + (BY + BH / 2 + 14) + '" text-anchor="middle" font-size="40">' + (R.obj || '📦') + '</text>' +
      '<g class="arr"></g>' +
      Object.keys(PTS).map(function (k) { var p = PTS[k]; return '<g class="pt" data-p="' + k + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="12"/></g>'; }).join('') +
      '</svg>' +
      '<div class="ctrl"><div class="grp">方向 ' + Object.keys(DV).map(function (d) { return '<button class="opt db" data-d="' + d + '">' + d + '</button>'; }).join('') + '</div>' +
      '<div class="grp">長度 <button class="opt minus">➖</button><span class="lenv">1 格</span><button class="opt plus">➕</button></div></div>' +
      '<div class="row"><button class="btn ok go">✅ 確認這個力</button></div>' +
      '<div class="why" hidden></div><div class="row nxrow" hidden><button class="btn nx">' + (r === rounds.length - 1 ? '完成！' : '下一題 ➜') + '</button></div></div>';
    var g = G.$('.arr', area);
    function draw() {
      G.$('.lenv', area).textContent = len + ' 格';
      if (!pt || !dir) { g.innerHTML = ''; return; }
      var p = PTS[pt], v = DV[dir], x2 = p[0] + v[0] * len * CELL, y2 = p[1] + v[1] * len * CELL;
      var hx = -v[0] * 16, hy = -v[1] * 16, nx = -v[1] * 10, ny = v[0] * 10;
      g.innerHTML = '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + (x2 + hx * .6) + '" y2="' + (y2 + hy * .6) + '" stroke="#d2453a" stroke-width="7" stroke-linecap="round"/>' +
        '<polygon points="' + x2 + ',' + y2 + ' ' + (x2 + hx + nx) + ',' + (y2 + hy + ny) + ' ' + (x2 + hx - nx) + ',' + (y2 + hy - ny) + '" fill="#d2453a"/>';
    }
    G.$('.say', area).onclick = function () { G.speak(R.story); };
    area.querySelectorAll('.pt').forEach(function (el) {
      el.addEventListener('click', function () {
        if (solved) return;
        area.querySelectorAll('.pt').forEach(function (x) { x.classList.remove('sel'); });
        el.classList.add('sel'); pt = el.getAttribute('data-p'); G.sfx.tick(); draw();
      });
    });
    area.querySelectorAll('.db').forEach(function (b) {
      b.onclick = function () {
        if (solved) return;
        area.querySelectorAll('.db').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel'); dir = b.dataset.d; G.sfx.tick(); draw();
      };
    });
    G.$('.plus', area).onclick = function () { if (!solved && len < 5) { len++; G.sfx.tick(); draw(); } };
    G.$('.minus', area).onclick = function () { if (!solved && len > 1) { len--; G.sfx.tick(); draw(); } };
    G.$('.go', area).onclick = function () {
      if (solved) return;
      if (!pt) { G.toast('先點一個白色圓點當作用點！'); return; }
      if (!dir) { G.toast('再選一個方向喔！'); return; }
      G.rep(pt === R.pt && dir === R.dir && len === R.len, '畫出力的箭頭（1 格代表 ' + lv.unit + '）：' + R.story, '作用點在' + PTS[pt][2] + '、方向 ' + dir + '、長度 ' + len + ' 格', '作用點在' + PTS[R.pt][2] + '、方向 ' + R.dir + '、長度 ' + R.len + ' 格');
      if (pt === R.pt && dir === R.dir && len === R.len) {
        solved = true; G.sfx.ok(); G.$('.go', area).disabled = true;
        var w = G.$('.why', area);
        w.innerHTML = '✅ 作用點在物體<b>' + PTS[R.pt][2] + '</b>，方向<b>' + R.dir + '</b>，長度 <b>' + R.len + ' 格</b>。' + (R.why || '');
        w.hidden = false; G.$('.nxrow', area).hidden = false;
      } else {
        G.sfx.bad(); api.miss();
        G.toast(pt !== R.pt ? '作用點不對喔：手（或繩子）碰到物體的是哪一邊？' : dir !== R.dir ? '方向不對喔：力是往哪邊推（拉）？' : '長度不對喔：力的大小要換算成幾格？');
      }
    };
    G.$('.nx', area).onclick = function () { r++; if (r < rounds.length) show(); else api.finish(); };
    draw();
  }
  show();
};

(function () {
  /* 彈簧秤吊著物體：air 在空氣中 / 放入水中 */
  function scale(read, inWater) {
    return '<svg viewBox="0 0 160 200" style="width:130px;display:inline-block;margin:0 6px"><rect x="70" y="0" width="20" height="90" rx="6" fill="#fffaf0" stroke="#6b3f1f" stroke-width="3"/>' +
      '<text x="100" y="52" font-size="16" font-weight="900" fill="#d2453a">' + read + '</text>' +
      '<line x1="80" y1="90" x2="80" y2="120" stroke="#6b3f1f" stroke-width="3"/><rect x="62" y="120" width="36" height="30" rx="6" fill="#8a8f96"/>' +
      (inWater ? '<rect x="20" y="104" width="120" height="90" fill="#6fc3e8" opacity=".55" stroke="#4a6b80" stroke-width="3"/>' : '') + '</svg>';
  }

  G.units.push({
    id: 'fo', no: '', name: '生活中的力', e: '💪', c: '#e8603c',
    sub: '受力後的變化・力的三要素・彈力和浮力・水傳送動力',
    levels: [
      {
        name: '受力會怎樣？', kind: 'idea', type: 'combo', th: [1, 3],
        inst: '物體受到力，形狀或運動情形可能會改變。先把物品分一分：放開手以後，能不能恢復原狀？',
        recap: '力可以讓物體<b>改變形狀</b>，也可以讓物體<b>改變運動情形</b>（開始動、停下來、變快變慢、轉彎）。有些物體受力變形後<b>可以恢復原狀</b>（橡皮筋、彈簧、海綿），有些<b>不能恢復</b>（黏土、揉皺的紙）。生活中有推力、拉力、磁力、彈力、地球引力（重力）等不同形式的力。',
        steps: [
          {
            type: 'sort',
            bins: [
              { k: 'back', t: '放手後可以恢復原狀', e: '🔄', c: '#5f8a2c' },
              { k: 'stay', t: '不能恢復原狀', e: '🚫', c: '#d2453a' }
            ],
            items: [
              { t: '拉長的橡皮筋', e: '➰', k: 'back', why: '橡皮筋放手後會縮回原來的樣子。' },
              { t: '壓扁的海綿', e: '🧽', k: 'back' },
              { t: '壓下去的彈簧', e: '🌀', k: 'back', why: '彈簧有彈性，放手就彈回來。' },
              { t: '輕輕捏一下的氣球', e: '🎈', k: 'back' },
              { t: '捏成碗的黏土', e: '🏺', k: 'stay', why: '黏土受力變形後，會保持新的形狀。' },
              { t: '揉皺的紙', e: '📄', k: 'stay', hint: '揉過的紙攤開還會有皺摺嗎？' },
              { t: '踩扁的鋁罐', e: '🥫', k: 'stay' },
              { t: '折斷的竹筷', e: '🥢', k: 'stay', hint: '斷掉的筷子還接得回去嗎？' }
            ]
          },
          {
            type: 'quiz', pick: 4, qs: [
              { q: '踢一下靜止的足球，球開始滾動。力讓球的什麼改變了？', big: '⚽', opts: ['運動情形', '形狀', '顏色', '重量'], a: 0, why: '球從不動變成滾動，是運動情形改變。' },
              { q: '守門員用手接住飛來的球，球停了下來。這是力讓球的？', big: '🧤', opts: ['運動情形改變（停下來）', '形狀改變', '變得更輕', '沒有任何改變'], a: 0, why: '力也可以讓運動中的物體變慢或停下來。' },
              { q: '磁鐵還沒碰到迴紋針，就把迴紋針吸過去。這是哪一種力？', big: '🧲', opts: ['磁力', '推力', '摩擦力', '浮力'], a: 0, why: '磁力不用接觸也能作用。' },
              { q: '放開手，蘋果會往下掉到地上，是因為受到什麼力？', big: '🍎', opts: ['地球引力（重力）', '磁力', '浮力', '彈力'], a: 0, why: '地球會把物體往下拉，這就是地球引力。' },
              { q: '拉開彈弓的橡皮筋再放手，小紙團被彈出去，主要是利用？', big: '🎯', opts: ['彈力', '磁力', '浮力', '地球引力'], a: 0, why: '橡皮筋被拉長後想恢復原狀，產生彈力。' },
              { q: '打開抽屜時，我們對抽屜用的是什麼力？', big: '🗄️', opts: ['拉力', '推力', '磁力', '浮力'], a: 0, why: '把抽屜往自己的方向拉出來，是拉力。' },
              { q: '按一下原子筆，筆心伸出來；再按一下又縮回去。筆裡的什麼幫了忙？', big: '🖊️', opts: ['彈簧的彈力', '磁鐵的磁力', '水的浮力', '空氣的重量'], a: 0, why: '原子筆裡的彈簧被壓縮後會彈回來，利用的是彈力。' },
              { q: '流動的水推動水車一直轉動，這說明了什麼？', big: '💧🎡', opts: ['水可以推動物體、傳送動力', '水沒有重量', '水車會自己轉', '水只能往上流'], a: 0, why: '水流推動水車的葉片，把力量傳了過去。' },
              { q: '用力壓氣球，氣球凹下去了。這是力讓氣球的？', big: '🎈', opts: ['形狀改變', '運動變快', '顏色改變', '變重了'], a: 0, why: '受力後凹下去，是形狀改變。' }
            ]
          }
        ]
      },
      {
        name: '探險隊搬運工：畫出力的箭頭', kind: 'op', type: 'arrow', th: [0, 2], pick: 4, unit: '1 單位的力',
        inst: '力有三要素：<b>作用點</b>、<b>方向</b>、<b>大小</b>。用箭頭來表示力：箭頭從作用點畫出，箭頭指向力的方向，箭頭越長代表力越大。',
        recap: '力的三要素：<b>作用點</b>（力作用在物體的哪裡）、<b>方向</b>（往哪裡推或拉）、<b>大小</b>（用多少力）。畫力的箭頭時，<b>起點在作用點</b>，<b>箭頭指向力的方向</b>，<b>長度代表力的大小</b>。',
        rounds: [
          { story: '用 <b>3 單位</b>的力，從木箱的<b>左邊</b>把木箱<b>往右推</b>。', obj: '📦', pt: 'L', dir: '→', len: 3, why: '推的時候，手碰到箱子左邊，力往右。' },
          { story: '繩子綁在木箱的<b>右邊</b>，用 <b>2 單位</b>的力把木箱<b>往右拉</b>。', obj: '📦', pt: 'R', dir: '→', len: 2, why: '拉的時候，作用點在綁繩子的右邊。' },
          { story: '從背包的<b>右邊</b>，用 <b>4 單位</b>的力把背包<b>往左推</b>。', obj: '🎒', pt: 'R', dir: '←', len: 4, why: '從右邊推，力的方向往左。' },
          { story: '提把在水桶<b>上面</b>，用 <b>5 單位</b>的力把水桶<b>往上提</b>。', obj: '🪣', pt: 'T', dir: '↑', len: 5, why: '提起東西，作用點在上面的提把，方向往上。' },
          { story: '從海綿<b>上面</b>，用 <b>1 單位</b>的力<b>往下壓</b>。', obj: '🧽', pt: 'T', dir: '↓', len: 1, why: '往下壓，作用點在上面，方向往下，力很小所以箭頭很短。' },
          { story: '繩子綁在雪橇的<b>左邊</b>，用 <b>4 單位</b>的力把雪橇<b>往左拉</b>。', obj: '🛷', pt: 'L', dir: '←', len: 4, why: '往左拉，作用點在左邊綁繩子的地方。' }
        ]
      },
      {
        name: '小溪浮力大考驗', kind: 'boss', type: 'combo', th: [1, 3],
        inst: '在探險島的小溪邊做實驗：哪些東西會浮、哪些會沉？沉下去的東西有沒有受到浮力呢？',
        recap: '浮在水面的是<b>浮體</b>，沉到水底的是<b>沉體</b>。不論浮體或沉體，在水中都會受到<b>向上的浮力</b>。用彈簧秤吊著石頭放進水裡，讀數會<b>變小</b>，變小的量就是浮力的大小。救生衣、游泳圈、浮球都是浮力的應用。',
        steps: [
          {
            type: 'sort',
            bins: [
              { k: 'up', t: '浮體（浮在水面）', e: '🛟', c: '#3b8fc4' },
              { k: 'down', t: '沉體（沉到水底）', e: '⚓', c: '#6b3f1f' }
            ],
            items: [
              { t: '木塊', e: '🪵', k: 'up' },
              { t: '乒乓球', e: '🏓', k: 'up' },
              { t: '保麗龍', e: '⬜', k: 'up' },
              { t: '落葉', e: '🍂', k: 'up' },
              { t: '鐵釘', e: '📌', k: 'down' },
              { t: '石頭', e: '🪨', k: 'down' },
              { t: '玻璃彈珠', e: '🔮', k: 'down' },
              { t: '十元硬幣', e: '🪙', k: 'down' }
            ]
          },
          {
            type: 'quiz', pick: 4, qs: [
              { q: '用彈簧秤吊著石頭：在空氣中是 200 公克重，放進水裡變成 150 公克重。這表示？', big: scale('200', false) + scale('150', true), opts: ['石頭在水中受到向上的浮力', '石頭在水裡變輕了一半', '沉下去的東西沒有浮力', '彈簧秤壞掉了'], a: 0, why: '讀數變小，是因為水給石頭一個向上的浮力（約 50 公克重）。' },
              { q: '水給物體的浮力，方向是？', opts: ['向上', '向下', '向左', '沒有方向'], a: 0, why: '浮力是向上托住物體的力。' },
              { q: '下面哪一句話是<b>正確</b>的？', opts: ['浮體和沉體在水中都會受到浮力', '只有浮在水面的東西才有浮力', '沉到水底的東西完全沒有受力', '物體越重，浮力一定越大'], a: 0, why: '沉體也受到浮力，只是浮力不夠大，所以還是沉下去。' },
              { q: '下面哪一個<b>不是</b>利用浮力的例子？', opts: ['用磁鐵吸住鐵門', '穿救生衣游泳', '用浮球釣魚', '用游泳圈玩水'], a: 0, why: '磁鐵吸鐵門是磁力，不是浮力。' },
              { q: '一團黏土丟進水裡會沉，怎樣做可能讓它浮起來？', big: '🟤', opts: ['捏成中間凹下去的小船形狀', '捏得更緊更圓', '把它切成兩半', '放到冰箱冰一下'], a: 0, why: '捏成船形，可以排開更多水，得到更大的浮力。' }
            ]
          }
        ]
      }
    ]
  });
})();
