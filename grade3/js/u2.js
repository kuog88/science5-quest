/* 單元二 空氣和水 */
G.types.syringe = function (lv, area, api) {
  area.innerHTML = '<div class="panel sim"><div class="simrow">' +
    ['air', 'water'].map(function (w) {
      return '<div class="simbox" data-w="' + w + '"><h3>' + (w === 'air' ? '💨 裝空氣的針筒' : '💧 裝水的針筒') + '</h3>' +
        '<svg viewBox="0 0 320 100"></svg><button class="btn blue push" style="touch-action:none">👉 按住推推看</button><div class="msg"></div></div>';
    }).join('') + '</div><p style="text-align:center;color:var(--muted);font-weight:700">出口都用紅色塞子塞住了。兩支都要試試看喔！</p>' +
    '<div class="row"><button class="btn go" disabled>我觀察好了，下一步 ➜</button></div></div>';
  var tried = { air: false, water: false }, alive = true;
  var dots = []; for (var i = 0; i < 18; i++) dots.push([Math.random(), 0.15 + Math.random() * 0.7]);
  area.querySelectorAll('.simbox').forEach(function (box) {
    var w = box.dataset.w, svg = G.$('svg', box), btn = G.$('.push', box), msg = G.$('.msg', box);
    var px = 70, held = false, heldAt = 0, shake = 0;
    function draw() {
      var x0 = px + 8, x1 = 250, cw = x1 - x0;
      var content = w === 'air'
        ? '<rect x="' + x0 + '" y="31" width="' + cw + '" height="38" fill="#eef7ff"/>' + dots.map(function (d) {
          return '<circle cx="' + (x0 + 4 + d[0] * (cw - 8)).toFixed(1) + '" cy="' + (31 + d[1] * 38).toFixed(1) + '" r="2.6" fill="#8fb8dd"/>';
        }).join('')
        : '<rect x="' + x0 + '" y="31" width="' + cw + '" height="38" fill="#6ec6ff"/>';
      svg.innerHTML = content +
        '<rect x="50" y="30" width="200" height="40" rx="4" fill="none" stroke="#5a6b75" stroke-width="3"/>' +
        [90, 130, 170, 210].map(function (x) { return '<line x1="' + x + '" y1="30" x2="' + x + '" y2="38" stroke="#5a6b75" stroke-width="2"/>'; }).join('') +
        '<rect x="250" y="44" width="22" height="12" fill="#cfd8dc" stroke="#5a6b75" stroke-width="2"/><rect x="270" y="40" width="14" height="20" rx="3" fill="#ff5a4e"/>' +
        '<rect x="' + (px + shake) + '" y="31" width="8" height="38" fill="#455a64"/>' +
        '<rect x="12" y="46" width="' + (px - 12 + shake) + '" height="8" fill="#90a4ae"/><rect x="6" y="28" width="10" height="44" rx="3" fill="#455a64"/>' +
        (held ? '<text x="10" y="22" font-size="16">✋➡</text>' : '');
    }
    function loop() {
      if (!alive || !document.body.contains(svg)) { alive = false; return; }
      if (w === 'air') {
        var target = held ? 165 : 70; px += (target - px) * 0.12;
        if (held && px > 130) msg.innerHTML = '推得進去！空氣被<b>壓縮</b>了，手會覺得有東西頂著。';
        else if (!held && heldAt && px < 80) msg.innerHTML = '一放手，活塞被<b>彈回來</b>了！';
      } else {
        shake = held ? Math.sin(Date.now() / 30) * 1.5 : 0; px = 70 + (held ? 2 : 0);
        if (held) msg.innerHTML = '推不動！<b>水不能被壓縮</b>。';
      }
      if (held && Date.now() - heldAt > 500 && !tried[w]) {
        tried[w] = true; G.sfx.tick();
        if (tried.air && tried.water) { var g = G.$('.go', area); g.disabled = false; G.bump(g, 'pop'); }
      }
      draw(); requestAnimationFrame(loop);
    }
    function down(e) { e.preventDefault(); held = true; heldAt = Date.now(); }
    function up() { held = false; }
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointerleave', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    draw(); requestAnimationFrame(loop);
  });
  G.$('.go', area).onclick = function () {
    alive = false;
    G.types.quiz({ qs: lv.qs }, area, api);
  };
};

/* 風力卡：旗子揚起角度越大，風越強 */
G.flagSVG = function (rot, lines) {
  var w = '';
  for (var i = 0; i < lines; i++) w += '<path d="M' + (100 + i * 4) + ' ' + (40 + i * 18) + ' q14 -6 28 0 t28 0" stroke="#7fb3e6" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(-60 0)"/>';
  return '<svg viewBox="0 0 160 140"><rect x="0" y="128" width="160" height="12" fill="#a8d672"/>' + w +
    '<rect x="26" y="18" width="6" height="112" fill="#8d6e63"/>' +
    '<g transform="rotate(' + rot + ' 32 26)"><path d="M32 18 L120 22 L120 34 L32 38 Z" fill="#ff7043"/><path d="M60 19 L60 37 M90 20.5 L90 35.5" stroke="#fff" stroke-width="5"/></g></svg>';
};

G.units.push({
  id: 'u2', no: '二', name: '空氣和水', e: '💨', c: '#4aa8ff',
  sub: '空氣和水的特性・壓縮・流動的空氣',
  levels: [
    {
      name: '針筒推推看', kind: 'op', type: 'syringe', th: [0, 1],
      inst: '按住「推推看」按鈕，比一比裝空氣和裝水的針筒，哪一支推得進去？',
      recap: '密封的空氣<b>可以被壓縮</b>，放手後會彈回來；水<b>不能被壓縮</b>。',
      qs: [
        { q: '剛才的實驗中，哪一支針筒的活塞推得進去？', opts: ['裝空氣的針筒', '裝水的針筒', '兩支都推得進去', '兩支都推不動'], a: 0, why: '空氣可以被壓縮，所以裝空氣的針筒推得進去。' },
        { q: '推裝空氣的針筒，放手以後活塞會怎樣？', opts: ['被彈回來', '停在原地不動', '自己掉出來', '越推越進去'], a: 0, why: '被壓縮的空氣會把活塞推回去，所以放手會彈回來。' },
        { q: '為什麼裝水的針筒推不動？', opts: ['因為水不能被壓縮', '因為水太重了', '因為水會結冰', '因為針筒壞掉了'], a: 0, why: '出口塞住時，水沒有地方去，而水又不能被壓縮，所以推不動。' }
      ]
    },
    {
      name: '空氣和水大考驗', kind: 'idea', type: 'quiz', pick: 8, th: [1, 3],
      inst: '空氣和水都占有空間、有重量，形狀也很特別。選出正確答案吧！',
      recap: '石頭、空氣和水都<b>占有空間、有重量</b>；空氣和水<b>沒有固定形狀</b>；空氣和水都能<b>傳送動力</b>；空氣流動形成<b>風</b>。',
      qs: [
        { q: '把杯底塞著紙巾的杯子，杯口朝下直直壓進水裡，紙巾會怎樣？', big: '🥛⬇️🌊', opts: ['不會濕，因為杯子裡的空氣占有空間', '全部濕透', '紙巾會浮出來', '紙巾會變不見'], a: 0, why: '杯子裡有空氣占住空間，水進不去，所以紙巾不會濕。' },
        { q: '把石頭放進裝水的杯子裡，水面會怎樣？', big: '🪨💧', opts: ['升高', '降低', '不變', '消失'], a: 0, why: '石頭占有空間，把水擠開，所以水面升高。' },
        { q: '把同一顆籃球打入更多空氣後再秤重，會發現什麼？', big: '🏀⚖️', opts: ['變重了，因為空氣有重量', '變輕了', '一樣重', '秤不出來'], a: 0, why: '空氣有重量，打進更多空氣，球就變重一點。' },
        { q: '把一杯水分別倒進碗、瓶子和盤子，水的形狀會怎樣？', opts: ['跟著容器改變形狀', '一直是杯子的形狀', '變成圓球', '變成方塊'], a: 0, why: '水沒有固定的形狀，裝在什麼容器就變成什麼形狀。' },
        { q: '下面哪一個有<b>固定</b>的形狀？', opts: ['石頭', '水', '空氣', '果汁'], a: 0, why: '石頭有固定形狀；水、果汁和空氣都沒有固定形狀。' },
        { q: '用力擠壓空氣砲，遠處的紙片被吹倒了。這說明了什麼？', opts: ['空氣可以傳送動力', '空氣有顏色', '紙片會自己動', '空氣不會流動'], a: 0, why: '擠壓空氣砲，空氣把力量傳過去，所以空氣可以傳送動力。' },
        { q: '擠壓水槍，水會射出去打到目標。這說明了什麼？', big: '🔫💦', opts: ['水可以傳送動力', '水可以被壓縮', '水沒有重量', '水會變成空氣'], a: 0, why: '水可以傳送動力，所以擠壓水槍能把水射出去。' },
        { q: '「風」是怎麼形成的？', big: '🌬️', opts: ['空氣流動形成的', '樹木搖動造成的', '雲吹出來的', '太陽發出來的'], a: 0, why: '空氣流動就形成風；樹葉搖動是因為有風，不是風的原因。' },
        { q: '球鞋的氣墊踩下去軟軟的、會彈回來，是利用空氣的什麼特性？', big: '👟', opts: ['空氣可以被壓縮', '空氣沒有重量', '空氣有顏色', '空氣不占空間'], a: 0, why: '氣墊裡的空氣被壓縮後會彈回來，可以減少衝擊。' },
        { q: '打氣筒能把空氣打進腳踏車輪胎，是利用什麼？', big: '🚲', opts: ['空氣可以被壓縮，也能傳送動力', '水可以被壓縮', '輪胎會自己吸氣', '空氣有固定形狀'], a: 0, why: '打氣筒壓縮空氣，把空氣推進輪胎裡。' }
      ]
    },
    {
      name: '風力觀測員', kind: 'boss', type: 'combo', th: [0, 2],
      inst: '看看旗子和樹的擺動程度，判斷風力的強弱！最後還有應用挑戰。',
      recap: '物體<b>擺動得越厲害，風力越強</b>；可以用旗子、樹葉、風向袋來判斷風的強弱。',
      steps: [
        {
          type: 'order', rounds: [
            {
              prompt: '依照<b>風力由弱到強</b>，依序點選旗子。', why: '旗子揚得越高，表示風力越強！', items: [
                { t: '旗子垂下來', svg: G.flagSVG(84, 0) },
                { t: '旗子微微飄', svg: G.flagSVG(58, 1) },
                { t: '旗子斜斜飛', svg: G.flagSVG(30, 2) },
                { t: '旗子拉得很直', svg: G.flagSVG(3, 3) }
              ]
            },
            {
              prompt: '依照<b>風力由弱到強</b>，依序點選樹的樣子。', why: '從樹葉靜止到大樹搖擺，風力越來越強。', items: [
                { t: '樹葉靜止不動', e: '🌳' },
                { t: '樹葉輕輕沙沙響', e: '🌳🍃' },
                { t: '小樹枝搖來搖去', e: '🌳🍃🍃' },
                { t: '大樹枝搖擺、呼呼作響', e: '🌳🌬️🌬️' }
              ]
            }
          ]
        },
        {
          type: 'quiz', qs: [
            { q: '想做一個能被風吹得很遠的紙風車或帆船，帆要怎麼設計比較好？', big: '⛵', opts: ['帆大一點、迎著風', '帆越小越好', '不要帆', '帆背對著風收起來'], a: 0, why: '帆比較大、迎著風，就能接收更多流動的空氣（風）的力量。' },
            { q: '小明想知道操場上現在風大不大，最好的方法是？', opts: ['觀察旗子或樹葉擺動的程度', '看天上有沒有太陽', '摸摸地上的石頭', '聽聽鳥叫聲'], a: 0, why: '物體擺動程度可以用來判斷風力的強弱。' }
          ]
        }
      ]
    }
  ]
});
