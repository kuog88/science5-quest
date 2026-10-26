/* 四年級下學期・森林遊俠營地：本學期新增題型（畫力的箭頭、組裝昆蟲、虹吸換水） */

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

/* ---------- 題型：組裝昆蟲 build ---------- */
/* lv.parts: [{t, e, k:'head'|'thorax'|'abdomen'|'none', g:對應的 SVG 部件 id, why}] */
G.BUG_PARTS = {
  ant: '<path d="M118 128 Q86 70 52 58 M118 172 Q86 230 52 242" stroke="#4a2a12" stroke-width="5" fill="none" stroke-linecap="round"/>',
  eye: '<circle cx="146" cy="124" r="11" fill="#3a2614"/><circle cx="146" cy="176" r="11" fill="#3a2614"/><circle cx="142" cy="120" r="3" fill="#fff"/><circle cx="142" cy="172" r="3" fill="#fff"/>',
  mouth: '<path d="M112 142 L94 146 M112 158 L94 154" stroke="#4a2a12" stroke-width="5" stroke-linecap="round"/>',
  leg: '<g stroke="#4a2a12" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M222 118 L200 70 L176 52"/><path d="M250 112 L252 52 L240 26"/><path d="M278 118 L312 64 L330 40"/>' +
    '<path d="M222 182 L200 230 L176 248"/><path d="M250 188 L252 248 L240 274"/><path d="M278 182 L312 236 L330 260"/></g>',
  wing: '<ellipse cx="350" cy="104" rx="112" ry="34" fill="#cfe9ff" stroke="#6f9cc0" stroke-width="3" opacity=".5" transform="rotate(-10 350 104)"/>' +
    '<ellipse cx="350" cy="196" rx="112" ry="34" fill="#cfe9ff" stroke="#6f9cc0" stroke-width="3" opacity=".5" transform="rotate(10 350 196)"/>',
  seg: '<g stroke="#8a5530" stroke-width="3" fill="none"><path d="M340 100 Q350 150 340 200"/><path d="M380 96 Q392 150 380 204"/><path d="M420 100 Q432 150 420 200"/><path d="M455 110 Q465 150 455 190"/></g>' +
    '<g fill="#4a2a12"><circle cx="360" cy="110" r="4"/><circle cx="400" cy="106" r="4"/><circle cx="438" cy="112" r="4"/><circle cx="360" cy="190" r="4"/><circle cx="400" cy="194" r="4"/><circle cx="438" cy="188" r="4"/></g>'
};
G.types.build = function (lv, area, api) {
  var items = G.shuffle(lv.parts), left = items.length;
  area.innerHTML = '<div class="panel"><div class="bar"><span>還剩 <b class="left">' + left + '</b> 個零件</span><span>💡 拖曳零件到身體的部位，或點零件再點部位</span></div>' +
    '<svg class="bugsvg" viewBox="0 0 640 300" role="img" aria-label="昆蟲身體">' +
    '<g class="parts"></g>' +
    '<g class="zone" data-k="head"><circle cx="150" cy="150" r="40" fill="#c98a3c" stroke="#6b3f1f" stroke-width="3"/><text x="150" y="157" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">頭</text></g>' +
    '<g class="zone" data-k="thorax"><ellipse cx="250" cy="150" rx="58" ry="44" fill="#b8742e" stroke="#6b3f1f" stroke-width="3"/><text x="250" y="157" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">胸</text></g>' +
    '<g class="zone" data-k="abdomen"><ellipse cx="400" cy="150" rx="96" ry="56" fill="#a5652a" stroke="#6b3f1f" stroke-width="3"/><text x="400" y="157" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">腹</text></g>' +
    '<g class="zone" data-k="none"><rect x="530" y="200" width="100" height="90" rx="12" fill="#fde4e0" stroke="#d2453a" stroke-width="3" stroke-dasharray="6 5"/><text x="580" y="238" text-anchor="middle" font-size="26">🗑️</text><text x="580" y="270" text-anchor="middle" font-size="14" font-weight="900" fill="#962a20">昆蟲沒有</text></g>' +
    '<g class="parts-top" pointer-events="none"></g></svg><div class="pool partpool"></div></div>';
  /* 長在身體裡面或蓋在身體上的部件（複眼、腹節、翅膀）要畫在上層，否則會被身體擋住 */
  var TOP = { eye: 1, seg: 1, wing: 1 };
  var pool = G.$('.pool', area);
  area.querySelectorAll('.zone').forEach(G.makeDrop);
  items.forEach(function (it) {
    var c = document.createElement('div'); c.className = 'chip'; c.innerHTML = G.chipHTML(it); pool.appendChild(c);
    G.makeDrag(c, function (chip, zone) {
      if (zone.getAttribute('data-k') === it.k) {
        G.sfx.ok(); chip.remove(); left--; G.$('.left', area).textContent = left;
        if (it.g) G.$(TOP[it.g] ? '.parts-top' : '.parts', area).insertAdjacentHTML('beforeend', G.BUG_PARTS[it.g]);
        G.toast('✅ ' + (it.why || '放對了！'), 2200);
        if (!left) setTimeout(api.finish, 900);
      } else {
        G.sfx.bad(); api.miss(); G.bump(chip, 'shake');
        G.toast('再想想看！' + (it.hint ? '💡 ' + it.hint : ''));
      }
    });
  });
};

/* ---------- 題型：虹吸換水 siphon ---------- */
/* lv.rounds: [{goal, target:null|水位線 y, mark, why}]；水族箱水面 y=80，入水口 y=186 */
G.types.siphon = function (lv, area, api) {
  var r = 0, TOP = 80, INLET = 186, TB = 200;
  function show() {
    var R = lv.rounds[r], filled = false, outY = 120, waterY = TOP, busy = false, solved = false;
    area.innerHTML = '<div class="panel"><div class="bar"><span>第 ' + (r + 1) + ' / ' + lv.rounds.length + ' 次換水</span><span>🐠 幫營地的大水族箱換水</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀">🔈</button><div class="q">' + R.goal + '</div></div>' +
      '<svg class="tanksvg" viewBox="0 0 640 380" role="img" aria-label="水族箱與水桶">' +
      '<rect x="10" y="200" width="300" height="14" fill="#8a5530"/><rect x="30" y="214" width="14" height="146" fill="#8a5530"/><rect x="276" y="214" width="14" height="146" fill="#8a5530"/>' +
      '<line x1="0" y1="362" x2="640" y2="362" stroke="#6b3f1f" stroke-width="4"/>' +
      '<rect class="water tw" x="42" y="' + TOP + '" width="216" height="' + (TB - TOP) + '"/>' +
      '<rect x="40" y="56" width="220" height="144" fill="none" stroke="#4a6b80" stroke-width="5"/>' +
      '<text x="80" y="170" font-size="28">🐟</text><text x="170" y="140" font-size="24">🐠</text>' +
      (R.target ? '<line x1="30" y1="' + R.target + '" x2="270" y2="' + R.target + '" stroke="#d2453a" stroke-width="3" stroke-dasharray="8 6"/><text x="272" y="' + (R.target + 5) + '" font-size="14" font-weight="900" fill="#d2453a">' + (R.mark || '紅線') + '</text>' : '') +
      '<rect class="water bw" x="452" y="358" width="116" height="0"/>' +
      '<path d="M446 290 L452 360 L568 360 L574 290" fill="none" stroke="#6b3f1f" stroke-width="5"/><text x="510" y="285" text-anchor="middle" font-size="14" font-weight="900" fill="#6b3f1f">水桶</text>' +
      '<line class="guide" x1="40" x2="520" stroke="#f29f2e" stroke-width="2" stroke-dasharray="4 6"/>' +
      '<path class="hose" fill="none" stroke="#7aa35a" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path class="hosew" fill="none" stroke="#6fc3e8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>' +
      '<line class="drip" x1="510" x2="510" stroke="#6fc3e8" stroke-width="6" opacity="0"/>' +
      '</svg>' +
      '<div class="ctrl"><button class="btn alt fill">💧 先把水管裝滿水</button>' +
      '<div class="grp">出水口高度 <span>高</span><input class="slide" type="range" min="60" max="340" step="5" value="' + outY + '"><span>低</span></div></div>' +
      '<div class="row"><button class="btn ok go">▶️ 放開出水口</button></div>' +
      '<div class="why" hidden></div><div class="row nxrow" hidden><button class="btn nx">' + (r === lv.rounds.length - 1 ? '完成！' : '下一次 ➜') + '</button></div></div>';
    var hose = G.$('.hose', area), hosew = G.$('.hosew', area), guide = G.$('.guide', area), drip = G.$('.drip', area);
    function draw() {
      var d = 'M200 ' + INLET + ' L200 40 L330 40 Q510 40 510 ' + (Math.min(outY, 100) - 40) + ' L510 ' + outY;
      if (outY < 100) d = 'M200 ' + INLET + ' L200 40 L330 40 Q510 40 510 ' + outY;
      hose.setAttribute('d', d); hosew.setAttribute('d', d);
      hosew.setAttribute('opacity', filled ? '1' : '0');
      guide.setAttribute('y1', outY); guide.setAttribute('y2', outY);
      G.$('.tw', area).setAttribute('y', waterY); G.$('.tw', area).setAttribute('height', TB - waterY);
    }
    G.$('.say', area).onclick = function () { G.speak(R.goal.replace(/<[^>]+>/g, '')); };
    G.$('.fill', area).onclick = function () { if (busy || solved) return; filled = true; G.sfx.tick(); G.$('.fill', area).textContent = '💧 水管已裝滿水'; G.$('.fill', area).disabled = true; draw(); };
    G.$('.slide', area).oninput = function () { if (busy || solved) return; outY = +this.value; draw(); };
    function refill() { waterY = TOP; G.$('.bw', area).setAttribute('height', 0); G.$('.bw', area).setAttribute('y', 358); drip.setAttribute('opacity', 0); hosew.classList.remove('flowing'); busy = false; draw(); }
    G.$('.go', area).onclick = function () {
      if (busy || solved) return;
      if (!filled) { G.sfx.bad(); api.miss(); G.toast('水管裡都是空氣，水流不過來……要先把水管裝滿水喔！'); return; }
      if (outY <= waterY) { G.sfx.bad(); api.miss(); G.toast('出水口比水族箱的水面還高，水流不出來！把出水口放低一點。'); return; }
      var stop = Math.min(outY, INLET), ok = R.target ? Math.abs(stop - R.target) <= 3 : true;
      busy = true; hosew.classList.add('flowing');
      drip.setAttribute('y1', outY); drip.setAttribute('y2', 356); drip.setAttribute('opacity', outY < 350 ? 1 : 0);
      var timer = setInterval(function () {
        waterY = Math.min(stop, waterY + 2);
        var got = (waterY - TOP) * 0.55;
        G.$('.bw', area).setAttribute('y', 358 - got); G.$('.bw', area).setAttribute('height', got);
        draw();
        if (waterY >= stop) {
          clearInterval(timer); hosew.classList.remove('flowing'); drip.setAttribute('opacity', 0);
          if (ok) {
            solved = true; G.sfx.ok(); G.$('.go', area).disabled = true;
            var w = G.$('.why', area); w.innerHTML = '✅ ' + R.why; w.hidden = false; G.$('.nxrow', area).hidden = false;
          } else {
            G.sfx.bad(); api.miss();
            G.toast(stop < R.target ? '水面降到和出水口一樣高就停了，還沒到' + (R.mark || '紅線') + '，出水口要再放低一點！' : '水面降過頭了！出水口要和' + (R.mark || '紅線') + '一樣高。重新裝滿水再試一次。', 3400);
            setTimeout(refill, 1800);
          }
        }
      }, 40);
    };
    G.$('.nx', area).onclick = function () { r++; if (r < lv.rounds.length) show(); else api.finish(); };
    draw();
  }
  show();
};
