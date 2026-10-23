/* 單元三 光和能源 */

/* 光線追蹤：從手電筒出發，遇到鏡子轉彎，遇到牆停下 */
G.traceBeam = function (P, mir) {
  var x = -1, y = P.sy, dx = 1, dy = 0, pts = [[x, y]], hit = false;
  for (var n = 0; n < 80; n++) {
    x += dx; y += dy;
    if (x < 0 || y < 0 || x >= P.w || y >= P.h) { pts.push([x - dx / 2, y - dy / 2]); break; }
    var key = x + ',' + y;
    if (P.walls.indexOf(key) >= 0) { pts.push([x - dx / 2, y - dy / 2]); break; }
    if (P.tx === x && P.ty === y) { pts.push([x, y]); hit = true; break; }
    var m = mir[key];
    if (m) { pts.push([x, y]); var t = dx; if (m === '/') { dx = -dy; dy = -t; } else { dx = dy; dy = t; } }
  }
  return { pts: pts, hit: hit };
};

/* 鏡子反射迷宮：點鏡子轉方向，按「開燈」讓光照到星星 */
G.types.mirror = function (lv, area, api) {
  var r = 0, S = 60;
  function show() {
    var P = lv.puzzles[r], mir = {}, busy = false;
    P.mirrors.forEach(function (m) { mir[m[0] + ',' + m[1]] = m[2]; });
    area.innerHTML = '<div class="panel sim"><div class="bar"><span>第 ' + (r + 1) + ' / ' + lv.puzzles.length + ' 關</span><span>💡 點鏡子可以轉方向</span></div>' +
      '<svg class="maze" viewBox="0 0 ' + (P.w + 1) * S + ' ' + P.h * S + '"></svg><div class="msg"></div>' +
      '<div class="row"><button class="btn blue fire">🔦 開燈！</button><button class="btn nx" hidden>' + (r === lv.puzzles.length - 1 ? '完成！' : '下一關 ➜') + '</button></div></div>';
    var svg = G.$('svg', area), msg = G.$('.msg', area);
    function cx(x) { return (x + 1) * S + S / 2; }
    function cy(y) { return y * S + S / 2; }
    function draw(beam) {
      var h = '<rect x="' + S + '" y="0" width="' + P.w * S + '" height="' + P.h * S + '" rx="10" fill="#263238"/>';
      for (var i = 0; i <= P.w; i++) h += '<line x1="' + (S + i * S) + '" y1="0" x2="' + (S + i * S) + '" y2="' + P.h * S + '" stroke="#37474f"/>';
      for (var j = 0; j <= P.h; j++) h += '<line x1="' + S + '" y1="' + j * S + '" x2="' + (P.w + 1) * S + '" y2="' + j * S + '" stroke="#37474f"/>';
      P.walls.forEach(function (k) { var a = k.split(','); h += '<text x="' + cx(+a[0]) + '" y="' + (cy(+a[1]) + 14) + '" font-size="38" text-anchor="middle">🧱</text>'; });
      h += '<text x="' + cx(P.tx) + '" y="' + (cy(P.ty) + 14) + '" font-size="38" text-anchor="middle">' + (beam && beam.hit ? '🌟' : '⭐') + '</text>';
      h += '<text x="' + (S / 2) + '" y="' + (cy(P.sy) + 14) + '" font-size="38" text-anchor="middle" transform="rotate(45 ' + (S / 2) + ' ' + cy(P.sy) + ')">🔦</text>';
      if (beam) h += '<polyline points="' + beam.pts.map(function (p) { return (p[0] < 0 ? S * 0.85 : cx(p[0])) + ',' + cy(p[1]); }).join(' ') +
        '" fill="none" stroke="#fff176" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>';
      Object.keys(mir).forEach(function (k) {
        var a = k.split(','), X = cx(+a[0]), Y = cy(+a[1]), d = S * 0.34, s = mir[k] === '/' ? -1 : 1;
        h += '<g class="mir" data-k="' + k + '"><rect x="' + (X - S / 2 + 3) + '" y="' + (Y - S / 2 + 3) + '" width="' + (S - 6) + '" height="' + (S - 6) + '" rx="8" fill="#455a64"/>' +
          '<line x1="' + (X - d) + '" y1="' + (Y - s * d) + '" x2="' + (X + d) + '" y2="' + (Y + s * d) + '" stroke="#b3e5fc" stroke-width="8" stroke-linecap="round"/></g>';
      });
      svg.innerHTML = h;
      svg.querySelectorAll('.mir').forEach(function (g) {
        g.addEventListener('click', function () {
          if (busy) return;
          mir[g.dataset.k] = mir[g.dataset.k] === '/' ? '\\' : '/'; G.sfx.tick(); draw();
        });
      });
    }
    draw();
    G.$('.fire', area).onclick = function () {
      if (busy) return;
      var b = G.traceBeam(P, mir); draw(b);
      if (b.hit) {
        busy = true; G.sfx.ok(); msg.innerHTML = '✅ 照到星星了！光走直線，碰到鏡子就會<b>反射</b>轉彎。';
        G.$('.fire', area).hidden = true; G.$('.nx', area).hidden = false;
      } else {
        G.sfx.bad(); api.miss(); msg.innerHTML = '光沒有照到星星，轉轉鏡子再試一次！';
        busy = true; setTimeout(function () { busy = false; if (document.body.contains(svg)) { draw(); msg.innerHTML = ''; } }, 1400);
      }
    };
    G.$('.nx', area).onclick = function () { r++; if (r < lv.puzzles.length) show(); else api.finish(); };
  }
  show();
};

G.units.push({
  id: 'u3', no: '三', name: '光和能源', e: '💡', c: '#ffa000',
  sub: '光的行進方向・能量和能源轉換・節能減碳',
  levels: [
    {
      name: '鏡子反射迷宮', kind: 'op', type: 'mirror', th: [0, 2],
      inst: '手電筒的光會直直前進，碰到鏡子會反射。點鏡子轉方向，再按「開燈」，讓光照到星星！',
      recap: '光是<b>直線前進</b>的；光照到鏡子會<b>反射</b>；改變鏡子或光源的位置，反射的方向也會跟著改變。',
      puzzles: [
        { w: 5, h: 4, sy: 1, tx: 3, ty: 3, walls: [], mirrors: [[3, 1, '/']] },
        { w: 6, h: 5, sy: 0, tx: 1, ty: 1, walls: ['5,0', '0,3'], mirrors: [[4, 0, '/'], [4, 3, '\\'], [1, 3, '/'], [2, 2, '/']] },
        { w: 7, h: 5, sy: 4, tx: 6, ty: 0, walls: ['3,4', '6,1', '2,0'], mirrors: [[2, 4, '\\'], [2, 1, '\\'], [5, 1, '\\'], [5, 0, '\\'], [4, 3, '/'], [1, 1, '/']] }
      ]
    },
    {
      name: '光的祕密', kind: 'idea', type: 'quiz', pick: 8, th: [1, 3],
      inst: '光是怎麼前進的？影子是怎麼來的？鏡子有什麼用？選出正確答案吧！',
      recap: '會自己發光的叫<b>光源</b>；光<b>直線前進</b>，被物體擋住就形成<b>影子</b>；光照到鏡子會<b>反射</b>，生活中的照後鏡、潛望鏡都用到反射。',
      qs: [
        { q: '下面哪一個是<b>光源</b>（自己會發光）？', opts: ['點亮的燈泡', '月亮', '鏡子', '白色的牆'], a: 0, why: '燈泡、太陽、螢火蟲會自己發光，是光源；月亮和鏡子只是反射光。' },
        { q: '把三張中間打洞的卡片排好，要怎樣才能從洞裡看到後面的燭光？', big: '🕯️', opts: ['三個洞排成一直線', '三個洞左右錯開', '卡片疊在一起', '把卡片轉過來'], a: 0, why: '光是直線前進的，洞要排成一直線光才能通過。' },
        { q: '影子是怎麼形成的？', big: '🔦🧸', opts: ['光被物體擋住，後面照不到光', '物體會吐出黑色的東西', '光變成黑色', '物體太冷了'], a: 0, why: '光直線前進，被物體擋住，後面光照不到的地方就是影子。' },
        { q: '手電筒從玩偶的<b>左邊</b>照過來，影子會出現在玩偶的哪一邊？', opts: ['右邊', '左邊', '上面', '不會有影子'], a: 0, why: '影子會出現在光源的相反方向。' },
        { q: '手電筒越靠近玩偶，牆上的影子會怎樣？', opts: ['變大', '變小', '不變', '消失'], a: 0, why: '光源越靠近物體，擋住的光越多，影子就越大。' },
        { q: '用手電筒照鏡子，牆上出現一個亮點，這是因為什麼？', big: '🪞', opts: ['光照到鏡子反射出去', '鏡子自己會發光', '牆會發光', '光穿過了鏡子'], a: 0, why: '光照到鏡子會反射，反射的光照到牆上形成亮點。' },
        { q: '移動手電筒的位置照向同一面鏡子，牆上的亮點會怎樣？', opts: ['亮點的位置跟著改變', '亮點永遠不動', '亮點消失', '亮點變成彩色'], a: 0, why: '改變光源的位置，反射光的方向也會改變。' },
        { q: '山路轉彎處的反射鏡，是利用光的什麼特性幫助駕駛看到對面來車？', big: '🚗🪞', opts: ['反射', '光會轉彎繞過山', '光會變熱', '光會發出聲音'], a: 0, why: '反射鏡把對面的光反射到駕駛眼中。' },
        { q: '潛水艇的潛望鏡裡面放了什麼，讓人在水下看到水面上的東西？', opts: ['兩面鏡子', '一個燈泡', '一塊磁鐵', '一張白紙'], a: 0, why: '潛望鏡用兩面鏡子讓光反射兩次轉彎。' },
        { q: '在不透光的紙箱裡什麼都看不到，打開箱子才看得到玩具，這是因為？', opts: ['要有光照到物體再進入眼睛', '眼睛會發光', '玩具會發光', '紙箱會變透明'], a: 0, why: '光照到物體，再反射進入我們的眼睛，我們才看得見。' }
      ]
    },
    {
      name: '能源大挑戰', kind: 'boss', type: 'combo', th: [0, 2],
      inst: '能提供能量的來源叫做「能源」。先分一分哪些可以再生，再挑戰能量轉換和節能減碳！',
      recap: '太陽的光和熱是地球最主要的能量來源；<b>可再生能源</b>：太陽能、風力、水力、地熱；<b>不可再生能源</b>：煤、石油、天然氣。<b>節能減碳</b>才能讓能源永續、汙染減少。',
      steps: [
        {
          type: 'sort',
          bins: [
            { k: 're', t: '可再生能源', e: '♻️', c: '#43a047' },
            { k: 'no', t: '不可再生能源', e: '⛔', c: '#e53935' }
          ],
          items: [
            { t: '太陽能', e: '☀️', k: 're' },
            { t: '風力', e: '🌬️', k: 're' },
            { t: '水力', e: '💧', k: 're' },
            { t: '地熱', e: '♨️', k: 're', hint: '地熱來自地球內部的熱，可以一直使用。' },
            { t: '煤', e: '⚫', k: 'no', why: '煤是古代植物埋在地底很久形成的，用完就沒了。' },
            { t: '石油', e: '🛢️', k: 'no', why: '石油要經過幾百萬年才形成，用完就沒有了。' },
            { t: '天然氣', e: '🔥', k: 'no', hint: '天然氣和石油一樣，是埋在地底很久才形成的。' }
          ]
        },
        {
          type: 'quiz', qs: [
            { q: '太陽能板照到陽光就能發電，是把什麼能量轉換成電能？', big: '☀️🔋', opts: ['光能', '聲能', '風能', '食物的能量'], a: 0, why: '太陽能板把光能轉換成電能。' },
            { q: '風力發電機是利用什麼來發電？', big: '🌬️', opts: ['風吹動扇葉轉動', '燃燒木頭', '陽光的熱', '海水的鹽'], a: 0, why: '風推動扇葉轉動，帶動發電機產生電。' },
            { q: '燃燒煤、石油來發電，容易造成什麼問題？', big: '🏭', opts: ['空氣汙染、排放很多二氧化碳', '空氣變乾淨', '讓能源變更多', '沒有任何問題'], a: 0, why: '燃燒燃料會產生廢氣，造成空氣汙染。' },
            { q: '下面哪一個是<b>節能減碳</b>的好習慣？', opts: ['離開教室隨手關燈、關冷氣', '冷氣開到很冷再蓋棉被', '電視開著去睡覺', '近距離也請家人開車接送'], a: 0, why: '隨手關燈、走路或騎腳踏車、冷氣溫度不要太低，都能節省能源。' }
          ]
        }
      ]
    }
  ]
});
