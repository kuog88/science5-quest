/* 簡單機械（南一「巧妙的施力工具」、康軒、翰林「簡單機械」，三版都是第 1 單元）：槓桿、輪軸、滑輪、齒輪與鏈條 */

/* 槓桿平衡實驗：lv.rounds:[{L:[砝碼數, 格數], fixW?, fixD?, prompt}]，右邊調整砝碼數和格數，左右「砝碼數×格數」相等就平衡 */
G.types.lever = function (lv, area, api) {
  var r = 0;
  function show() {
    var R = lv.rounds[r], w = R.fixW || 1, d = R.fixD || 1, solved = false, tilt = 0, released = false;
    area.innerHTML = '<div class="panel lever"><div class="bar"><span>第 ' + (r + 1) + ' / ' + lv.rounds.length + ' 回</span><span>⚖️ 左右「砝碼數 × 格數」相等就會平衡</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀">🔈</button><div class="q">' + R.prompt + '</div></div>' +
      '<svg viewBox="0 0 400 230"></svg>' +
      '<div class="pick">' + (R.fixW ? '' : '<span>右邊砝碼</span><button class="btn alt mw">－</button><b class="w"></b><button class="btn alt pw">＋</button><span>個</span>') +
      (R.fixD ? '' : '<span>掛在第</span><button class="btn alt md">－</button><b class="d"></b><button class="btn alt pd">＋</button><span>格</span>') + '</div>' +
      '<div class="row"><button class="btn go">🖐️ 放手看看</button></div>' +
      '<div class="why" hidden></div><div class="row nxrow" hidden><button class="btn nx">' + (r === lv.rounds.length - 1 ? '完成！' : '下一回 ➜') + '</button></div></div>';
    var svg = G.$('svg', area);
    function stack(x, n, col) {
      var s = '<line x1="' + x + '" y1="112" x2="' + x + '" y2="126" stroke="#4f5d6b" stroke-width="2"/>';
      for (var k = 0; k < n; k++) s += '<rect x="' + (x - 11) + '" y="' + (126 + k * 15) + '" width="22" height="13" rx="3" fill="' + col + '" stroke="#3a2e22"/>';
      return s;
    }
    function draw() {
      var holes = '', k;
      for (k = 1; k <= 5; k++) {
        holes += '<circle cx="' + (200 - k * 32) + '" cy="106" r="3" fill="#3a2e22"/><circle cx="' + (200 + k * 32) + '" cy="106" r="3" fill="#3a2e22"/>' +
          '<text x="' + (200 - k * 32) + '" y="98" font-size="11" text-anchor="middle" fill="#7b6a55">' + k + '</text><text x="' + (200 + k * 32) + '" y="98" font-size="11" text-anchor="middle" fill="#7b6a55">' + k + '</text>';
      }
      svg.innerHTML = '<rect width="400" height="230" rx="14" fill="#fffaf0"/>' +
        '<polygon points="200,112 180,206 220,206" fill="#b5862a" stroke="#6b4f16" stroke-width="2"/><rect x="150" y="206" width="100" height="10" rx="4" fill="#6b4f16"/>' +
        '<text x="200" y="196" font-size="12" text-anchor="middle" fill="#fff">支點</text>' +
        (released ? '' : '<rect x="44" y="114" width="14" height="92" fill="#cfc3ad"/><rect x="342" y="114" width="14" height="92" fill="#cfc3ad"/>') +
        '<g transform="rotate(' + tilt + ' 200 106)"><rect x="34" y="100" width="332" height="12" rx="5" fill="#8a5a1c"/>' + holes +
        stack(200 - R.L[1] * 32, R.L[0], '#4f5d6b') + stack(200 + d * 32, w, '#d9622b') + '</g>';
      var wb = G.$('.w', area), db = G.$('.d', area);
      if (wb) wb.textContent = w; if (db) db.textContent = d;
    }
    function set(dw, dd) { if (solved) return; released = false; tilt = 0; w = Math.max(1, Math.min(6, w + dw)); d = Math.max(1, Math.min(5, d + dd)); G.sfx.tick(); draw(); }
    ['mw', -1, 0, 'pw', 1, 0, 'md', 0, -1, 'pd', 0, 1].forEach(function (_, k, a) { if (k % 3) return; var b = G.$('.' + a[k], area); if (b) b.onclick = function () { set(a[k + 1], a[k + 2]); }; });
    G.$('.say', area).onclick = function () { G.speak(R.prompt.replace(/<[^>]+>/g, '')); };
    G.$('.go', area).onclick = function () {
      if (solved) return;
      var lt = R.L[0] * R.L[1], rt = w * d, ok = lt === rt;
      released = true; tilt = ok ? 0 : Math.max(-14, Math.min(14, (rt - lt) * 2)); draw();
      G.rep(ok, '槓桿平衡：左邊 ' + R.L[0] + ' 個砝碼掛在第 ' + R.L[1] + ' 格。' + R.prompt.replace(/<[^>]+>/g, ''), '右邊 ' + w + ' 個掛第 ' + d + ' 格', '右邊「砝碼數×格數」＝' + lt);
      if (ok) {
        solved = true; G.sfx.ok();
        var why = G.$('.why', area); why.innerHTML = '✅ 平衡了！左邊 ' + R.L[0] + '×' + R.L[1] + '＝' + lt + '，右邊 ' + w + '×' + d + '＝' + rt + '，兩邊相等。'; why.hidden = false;
        G.$('.nxrow', area).hidden = false; G.$('.go', area).disabled = true;
      } else { G.sfx.bad(); api.miss(); G.toast(rt > lt ? '右邊往下沉了，右邊太重或掛得太遠！' : '左邊往下沉了，右邊要再重一點或掛遠一點！'); }
    };
    G.$('.nx', area).onclick = function () { r++; if (r < lv.rounds.length) show(); else api.finish(); };
    draw();
  }
  show();
};

G.units.push({
  id: 'mc', no: '一', name: '簡單機械', e: '⚙️', c: '#b5862a', room: '齒輪機械室',
  sub: '槓桿・輪軸與滑輪・齒輪、鏈條與皮帶',
  levels: [
    {
      name: '槓桿平衡實驗台', kind: 'op', type: 'combo',
      inst: '槓桿有<b>支點</b>、<b>施力點</b>、<b>抗力點</b>。在右邊掛砝碼，讓槓桿平衡！左右兩邊「砝碼數 × 離支點的格數」相等時，槓桿就會平衡。',
      recap: '槓桿平衡時：<b>左邊（砝碼數×格數）＝右邊（砝碼數×格數）</b>。施力點離支點越遠（施力臂越長），越<b>省力</b>；抗力點離支點越近，也越省力。',
      steps: [
        { type: 'lever', rounds: [
          { L: [2, 3], fixW: 3, prompt: '左邊 2 個砝碼掛在第 3 格。右邊有 <b>3 個</b>砝碼，要掛在第幾格？' },
          { L: [4, 2], fixW: 2, prompt: '左邊 4 個砝碼掛在第 2 格。右邊有 <b>2 個</b>砝碼，要掛在第幾格？' },
          { L: [3, 4], fixD: 3, prompt: '左邊 3 個砝碼掛在第 4 格。右邊固定掛在<b>第 3 格</b>，要掛幾個砝碼？' },
          { L: [6, 1], prompt: '左邊 6 個砝碼掛在第 1 格。右邊的砝碼數和位置都由你決定！' },
          { L: [2, 4], fixW: 4, prompt: '左邊 2 個砝碼掛在第 4 格。右邊有 <b>4 個</b>砝碼，要掛在第幾格？' }
        ] },
        { type: 'quiz', pick: 4, qs: [
          { q: '槓桿上固定不動、讓槓桿繞著轉的那一點叫做什麼？', opts: ['支點', '施力點', '抗力點', '重點'], a: 0, why: '槓桿繞著支點轉動。' },
          { q: '用槓桿抬重物時，施力點離支點越遠，會怎樣？', opts: ['越省力', '越費力', '一樣', '槓桿會斷'], a: 0, why: '施力臂越長越省力。' },
          { q: '左邊 3 個砝碼掛第 2 格，右邊 1 個砝碼要掛第幾格才平衡？', opts: ['第 6 格', '第 2 格', '第 3 格', '第 5 格'], a: 0, why: '3×2＝6，1×6＝6。' },
          { q: '翹翹板上，體重比較重的人怎麼坐才能和輕的人平衡？', big: '🛝', opts: ['坐得離支點近一點', '坐得離支點遠一點', '坐在最末端', '站起來'], a: 0, why: '重的人離支點近，「重量×距離」才會相等。' },
          { q: '用槓桿把重物抬起，抗力點是哪裡？', opts: ['重物所在的位置', '手出力的位置', '槓桿下面的支撐點', '槓桿的正中間'], a: 0, why: '物體的重量作用在抗力點。' }
        ] }
      ]
    },
    {
      name: '生活工具大分類', kind: 'idea', type: 'sort',
      inst: '生活中很多工具都是槓桿。想一想使用時施力臂和抗力臂哪個長，把工具分到「省力」「費力」或「不省力也不費力」！',
      recap: '<b>施力臂比抗力臂長 → 省力</b>（開瓶器、拔釘子的鐵鎚、指甲剪的把手、獨輪手推車）。<b>施力臂比抗力臂短 → 費力</b>，但動作靈巧、省時（筷子、鑷子、食物夾、釣竿）。<b>一樣長 → 不省力也不費力</b>（等臂天平）。',
      bins: [{ k: 'save', t: '省力', e: '💪', c: '#2a9d8f' }, { k: 'cost', t: '費力（但方便、靈巧）', e: '🥢', c: '#d9622b' }, { k: 'eq', t: '不省力也不費力', e: '⚖️', c: '#7d5ba6' }],
      items: [
        { t: '開瓶器打開瓶蓋', e: '🍾', k: 'save' }, { t: '用鐵鎚拔釘子', e: '🔨', k: 'save' }, { t: '獨輪手推車', e: '🛒', k: 'save', why: '輪子是支點，重物在中間，手在最遠的把手。' }, { t: '指甲剪的把手', e: '💅', k: 'save' },
        { t: '筷子夾菜', e: '🥢', k: 'cost' }, { t: '鑷子夾小東西', e: '🔬', k: 'cost' }, { t: '食物夾', e: '🍤', k: 'cost' }, { t: '釣竿', e: '🎣', k: 'cost', why: '手在支點附近施力，魚在很遠的竿尖。' },
        { t: '支點在正中間的等臂天平', e: '⚖️', k: 'eq' }
      ]
    },
    {
      name: '輪軸與滑輪工作站', kind: 'idea', type: 'quiz', pick: 7,
      inst: '工坊裡有很多會轉的工具：門把、螺絲起子、旗桿上的滑輪……它們怎麼幫我們做事？',
      recap: '<b>輪軸</b>：大輪和小軸一起轉。施力在<b>輪</b>上比較<b>省力</b>（門把、螺絲起子、水龍頭、方向盤）。<b>定滑輪</b>：固定不動，<b>不省力</b>但能<b>改變施力方向</b>（升旗）。<b>動滑輪</b>：跟著物體移動，<b>省力</b>但要拉比較長的繩子，不能改變方向。',
      qs: [
        { q: '轉動門把開門比直接轉中間的細軸容易，因為門把是什麼簡單機械？', big: '🚪', opts: ['輪軸（施力在輪上省力）', '定滑輪', '齒輪', '斜面'], a: 0, why: '門把是輪，裡面的細桿是軸。' },
        { q: '升旗時往下拉繩子，旗子卻往上升，這是利用旗桿頂端的什麼？', big: '🚩', opts: ['定滑輪', '動滑輪', '槓桿', '齒輪'], a: 0, why: '定滑輪可以改變施力方向。' },
        { q: '定滑輪有什麼作用？', opts: ['改變施力方向，但不省力', '很省力而且不改變方向', '讓物體變輕', '讓繩子變短'], a: 0, why: '定滑輪只改變方向。' },
        { q: '動滑輪有什麼作用？', opts: ['省力，但要拉比較長的繩子', '改變施力方向但不省力', '讓物體變重', '完全沒作用'], a: 0, why: '動滑輪省力但費距離。' },
        { q: '下面哪一個工具「不是」輪軸？', opts: ['筷子', '螺絲起子', '水龍頭', '汽車方向盤'], a: 0, why: '筷子是費力的槓桿。' },
        { q: '用螺絲起子轉螺絲時，手握的把手比螺絲起子的桿子粗，有什麼好處？', big: '🪛', opts: ['施力在大輪上，比較省力', '比較好看', '讓螺絲變長', '讓桿子變輕'], a: 0, why: '把手是輪，桿子是軸。' },
        { q: '工地用很多滑輪組合起來吊重物，主要目的是什麼？', big: '🏗️', opts: ['省力並且方便改變方向', '讓重物變輕', '讓繩子不會斷', '比較好看'], a: 0, why: '定滑輪和動滑輪組合起來，可以省力又改變方向。' },
        { q: '水井上的轆轤（轉動把手把水桶拉上來）是利用什麼？', opts: ['輪軸', '動滑輪', '齒輪', '鏈條'], a: 0, why: '轉把手是在輪上施力。' }
      ]
    },
    {
      name: '齒輪鏈條大挑戰', kind: 'boss', type: 'combo',
      inst: '齒輪、鏈條和皮帶可以把動力從一個地方傳到另一個地方。先排出腳踏車的動力怎麼傳，再挑戰問題！',
      recap: '兩個<b>齒輪直接咬合</b>，轉動方向<b>相反</b>；用<b>鏈條或皮帶</b>連接，轉動方向<b>相同</b>。大齒輪帶動小齒輪，小齒輪轉得比較<b>快</b>（圈數多）。腳踏車：踩踏板→前齒輪→鏈條→後齒輪→後輪。',
      steps: [
        { type: 'order', rounds: [
          { prompt: '騎腳踏車時，動力是怎麼傳到後輪的？依照順序點一點！', why: '鏈條把前齒輪的轉動傳到後齒輪。', items: [{ t: '腳踩踏板', e: '🦶' }, { t: '前齒輪轉動', e: '⚙️' }, { t: '鏈條帶動', e: '⛓️' }, { t: '後齒輪轉動', e: '🔩' }, { t: '後輪前進', e: '🚲' }] }
        ] },
        { type: 'quiz', pick: 6, qs: [
          { q: '兩個齒輪直接咬合，左邊的順時針轉，右邊的會怎麼轉？', opts: ['逆時針', '順時針', '不會轉', '忽左忽右'], a: 0, why: '直接咬合的齒輪轉向相反。' },
          { q: '腳踏車前後兩個齒輪用鏈條連接，它們的轉動方向怎樣？', big: '🚲', opts: ['相同', '相反', '前面轉後面不轉', '不一定'], a: 0, why: '用鏈條或皮帶連接，方向相同。' },
          { q: '大齒輪有 40 齒，帶動 20 齒的小齒輪。大齒輪轉 1 圈，小齒輪轉幾圈？', opts: ['2 圈', '1 圈', '半圈', '4 圈'], a: 0, why: '40÷20＝2。' },
          { q: '大齒輪有 36 齒，帶動 12 齒的小齒輪。大齒輪轉 2 圈，小齒輪轉幾圈？', opts: ['6 圈', '3 圈', '2 圈', '24 圈'], a: 0, why: '36×2＝72 齒，72÷12＝6 圈。' },
          { q: '三個齒輪排成一排依序咬合，第一個順時針轉，第三個怎麼轉？', opts: ['順時針', '逆時針', '不轉', '無法判斷'], a: 0, why: '第二個逆時針，第三個又變回順時針。' },
          { q: '下面哪一個是用「皮帶」傳送動力？', opts: ['洗衣機馬達帶動洗衣槽', '筷子夾菜', '升旗', '開瓶器'], a: 0, why: '許多洗衣機用皮帶連接馬達和洗衣槽。' },
          { q: '騎腳踏車上坡時，換成比較大的後齒輪，有什麼好處？', opts: ['踩起來比較輕鬆（省力）', '速度一定變快', '鏈條會變短', '輪胎會變大'], a: 0, why: '後齒輪大，踩一圈後輪轉得少，比較省力。' }
        ] }
      ]
    }
  ]
});
