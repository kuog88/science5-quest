/* 五年級下學期・藍海探索號：本學期新增題型（拳頭量高度角、氣體實驗室、聽音辨高低） */

/* ---------- 題型：方位與高度角 sky ---------- */
/* lv.rounds: [{name, dir:'東南', fists:4, why?}]；一個拳頭約 10 度 */
G.DIRS = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
G.types.sky = function (lv, area, api) {
  var rounds = G.shuffle(lv.rounds).slice(0, lv.pick || lv.rounds.length), r = 0;
  var W = 640, HZ = 300, STEP = 26;
  function xOf(dir) { return 40 + G.DIRS.indexOf(dir) * 80; }
  function show() {
    var R = rounds[r], fists = 0, dirPick = null, solved = false;
    var sx = xOf(R.dir), sy = HZ - R.fists * STEP;
    var labels = G.DIRS.concat(['北']).map(function (d, k) {
      return '<text x="' + (40 + k * 80) + '" y="' + (HZ + 28) + '" text-anchor="middle" class="sk-lb">' + d + '</text>' +
        '<line x1="' + (40 + k * 80) + '" y1="' + HZ + '" x2="' + (40 + k * 80) + '" y2="' + (HZ + 8) + '" class="sk-tk"/>';
    }).join('');
    area.innerHTML = '<div class="panel"><div class="bar"><span>第 ' + (r + 1) + ' / ' + rounds.length + ' 顆星</span><span>一個拳頭 ≈ 10 度</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀">🔈</button><div class="q">請量出<b>' + R.name + '</b>的位置：先點它在哪個方位，再從地平線一個一個疊拳頭，疊到剛好碰到星星。</div></div>' +
      '<svg class="skysvg" viewBox="0 0 ' + (W + 40) + ' 340" role="img" aria-label="星空全景圖">' +
      '<rect x="0" y="0" width="' + (W + 40) + '" height="' + HZ + '" class="sk-sky" rx="14"/>' +
      '<rect x="0" y="' + HZ + '" width="' + (W + 40) + '" height="40" class="sk-ground"/>' +
      '<line x1="0" y1="' + HZ + '" x2="' + (W + 40) + '" y2="' + HZ + '" class="sk-hz"/>' + labels +
      '<g class="fists"></g>' +
      '<text x="' + sx + '" y="' + (sy + 9) + '" text-anchor="middle" font-size="28">⭐</text>' +
      '<text x="' + (sx + 18) + '" y="' + (sy - 12) + '" class="sk-name">' + R.name + '</text>' +
      '</svg>' +
      '<div class="dirs">' + G.DIRS.map(function (d) { return '<button class="opt dirb" data-d="' + d + '">' + d + '</button>'; }).join('') + '</div>' +
      '<div class="row"><button class="btn alt minus">➖ 收一個拳頭</button><span class="fcount">拳頭：<b>0</b> 個（約 0 度）</span><button class="btn alt plus">✊ 疊一個拳頭</button></div>' +
      '<div class="row"><button class="btn ok">📏 回報位置</button></div>' +
      '<div class="why" hidden></div><div class="row nxrow" hidden><button class="btn nx">' + (r === rounds.length - 1 ? '完成！' : '下一顆星 ➜') + '</button></div></div>';
    var g = G.$('.fists', area);
    function draw() {
      var x = dirPick ? xOf(dirPick) : null, h = '';
      if (x != null) for (var k = 0; k < fists; k++) h += '<text x="' + x + '" y="' + (HZ - k * STEP - 3) + '" text-anchor="middle" font-size="24">✊</text>';
      g.innerHTML = h;
      G.$('.fcount b', area).textContent = fists;
      G.$('.fcount', area).lastChild.textContent = ' 個（約 ' + fists * 10 + ' 度）';
    }
    G.$('.say', area).onclick = function () { G.speak('請量出' + R.name + '的方位和高度角'); };
    area.querySelectorAll('.dirb').forEach(function (b) {
      b.onclick = function () {
        if (solved) return;
        area.querySelectorAll('.dirb').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel'); dirPick = b.dataset.d; G.sfx.tick(); draw();
      };
    });
    G.$('.plus', area).onclick = function () { if (solved) return; if (!dirPick) { G.toast('先點星星在哪個方位喔！'); return; } if (fists < 9) { fists++; G.sfx.tick(); draw(); } };
    G.$('.minus', area).onclick = function () { if (solved) return; if (fists > 0) { fists--; draw(); } };
    G.$('.ok', area).onclick = function () {
      if (solved) return;
      if (!dirPick) { G.toast('先點星星在哪個方位喔！'); return; }
      var w = G.$('.why', area);
      if (dirPick === R.dir && fists === R.fists) {
        solved = true; G.sfx.ok();
        w.innerHTML = '✅ ' + R.name + '在<b>' + R.dir + '方</b>，高度角約 <b>' + R.fists * 10 + ' 度</b>。' + (R.why || '');
        w.hidden = false; G.$('.nxrow', area).hidden = false; G.$('.ok', area).disabled = true;
      } else {
        G.sfx.bad(); api.miss();
        G.toast(dirPick !== R.dir ? '方位不對喔，看看星星正下方的地平線寫什麼？' : (fists < R.fists ? '拳頭還不夠高，再疊一個試試！' : '拳頭疊太高了，收回一個看看！'));
      }
    };
    G.$('.nx', area).onclick = function () { r++; if (r < rounds.length) show(); else api.finish(); };
  }
  show();
};

/* ---------- 題型：氣體實驗室 lab ---------- */
/* lv.rounds: [{goal, mats:[{t,e}], ans:[i,j], gas, tests:[{t,e,res}], test:正確索引, why}] */
G.types.lab = function (lv, area, api) {
  var r = 0;
  function show() {
    var R = lv.rounds[r], sel = [], phase = 1;
    area.innerHTML = '<div class="panel"><div class="bar"><span>第 ' + (r + 1) + ' / ' + lv.rounds.length + ' 個實驗</span><span>🧪 船上實驗室</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀">🔈</button><div class="q">任務：<b>' + R.goal + '</b><br>步驟 1：選出<b>兩種</b>要放進錐形瓶的材料。</div></div>' +
      '<div class="labwrap"><div class="mats">' + R.mats.map(function (m, k) { return '<button class="mat" data-k="' + k + '"><span class="e">' + m.e + '</span>' + m.t + '</button>'; }).join('') + '</div>' +
      '<div class="flask"><div class="liquid"></div><div class="bubbles"></div><div class="flabel">錐形瓶</div></div></div>' +
      '<div class="row"><button class="btn ok go">⚗️ 開始反應</button></div>' +
      '<div class="tests" hidden></div>' +
      '<div class="why" hidden></div><div class="row nxrow" hidden><button class="btn nx">' + (r === lv.rounds.length - 1 ? '完成！' : '下一個實驗 ➜') + '</button></div></div>';
    G.$('.say', area).onclick = function () { G.speak('任務：' + R.goal + '。選出兩種材料。'); };
    area.querySelectorAll('.mat').forEach(function (b) {
      b.onclick = function () {
        if (phase !== 1) return;
        var k = +b.dataset.k, at = sel.indexOf(k);
        if (at >= 0) { sel.splice(at, 1); b.classList.remove('sel'); }
        else if (sel.length < 2) { sel.push(k); b.classList.add('sel'); }
        else G.toast('最多選兩種，先點一下取消其中一種');
        G.sfx.tick();
      };
    });
    G.$('.go', area).onclick = function () {
      if (phase !== 1) return;
      if (sel.length < 2) { G.toast('要選兩種材料喔！'); return; }
      var ok = sel.indexOf(R.ans[0]) >= 0 && sel.indexOf(R.ans[1]) >= 0;
      if (!ok) { G.sfx.bad(); api.miss(); G.toast('瓶子裡沒有冒泡泡……換一組材料試試！'); return; }
      phase = 2; G.sfx.ok();
      var f = G.$('.flask', area); f.classList.add('react');
      var bb = G.$('.bubbles', f); for (var n = 0; n < 12; n++) { var i = document.createElement('i'); i.style.left = (10 + Math.random() * 75) + '%'; i.style.animationDelay = (Math.random() * 1.5).toFixed(2) + 's'; bb.appendChild(i); }
      G.$('.go', area).disabled = true;
      var t = G.$('.tests', area); t.hidden = false;
      t.innerHTML = '<div class="inst"><div class="q">冒出好多氣泡！用排水集氣法收集到一瓶<b>' + R.gas + '</b>。<br>步驟 2：要用哪一種方法檢驗它？</div></div>' +
        '<div class="opts">' + R.tests.map(function (x, k) { return '<button class="opt tb" data-k="' + k + '">' + x.e + ' ' + x.t + '</button>'; }).join('') + '</div>';
      t.querySelectorAll('.tb').forEach(function (b) {
        b.onclick = function () {
          var k = +b.dataset.k, x = R.tests[k];
          if (k === R.test) {
            G.sfx.ok(); b.classList.add('right'); t.querySelectorAll('.tb').forEach(function (y) { y.disabled = true; });
            var w = G.$('.why', area); w.innerHTML = '✅ ' + x.res + '<br>' + R.why; w.hidden = false; G.$('.nxrow', area).hidden = false;
          } else { G.sfx.bad(); api.miss(); b.classList.add('wrong'); b.disabled = true; G.toast(x.res, 3200); }
        };
      });
    };
    G.$('.nx', area).onclick = function () { r++; if (r < lv.rounds.length) show(); else api.finish(); };
  }
  show();
};

/* ---------- 題型：聽音辨高低 tune ---------- */
/* lv.rounds: [{prompt, want:'high'|'low', items:[{t, svg, f}], why}]；點卡片會發出聲音，再按「就是它」 */
G.playNote = function (f, wave) {
  var was = G.soundOn; G.soundOn = true;
  G.tone(f, .5, wave || 'triangle'); G.tone(f * 2, .35, 'sine');
  G.soundOn = was;
};
G.types.tune = function (lv, area, api) {
  var r = 0;
  function show() {
    var R = lv.rounds[r], pick = -1, solved = false;
    var fs = R.items.map(function (x) { return x.f; });
    var target = R.want === 'high' ? Math.max.apply(null, fs) : Math.min.apply(null, fs);
    var order = G.shuffle(R.items.map(function (_, k) { return k; }));
    area.innerHTML = '<div class="panel"><div class="bar"><span>第 ' + (r + 1) + ' / ' + lv.rounds.length + ' 回</span><span>🎧 點一下就會發出聲音</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀">🔈</button><div class="q">' + R.prompt + '</div></div>' +
      '<div class="cards">' + order.map(function (k) { return '<button class="ocard tcard" data-k="' + k + '">' + R.items[k].svg + '<div>' + R.items[k].t + '</div></button>'; }).join('') + '</div>' +
      '<div class="row"><button class="btn ok sure">🎯 就是它！</button></div>' +
      '<div class="why" hidden></div><div class="row nxrow" hidden><button class="btn nx">' + (r === lv.rounds.length - 1 ? '完成！' : '下一回 ➜') + '</button></div></div>';
    G.$('.say', area).onclick = function () { G.speak(R.prompt.replace(/<[^>]+>/g, '')); };
    area.querySelectorAll('.tcard').forEach(function (b) {
      b.onclick = function () {
        if (solved) return;
        area.querySelectorAll('.tcard').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel'); pick = +b.dataset.k; G.playNote(R.items[pick].f, R.wave); G.bump(b, 'pop');
      };
    });
    G.$('.sure', area).onclick = function () {
      if (solved) return;
      if (pick < 0) { G.toast('先點卡片聽聽看，再選一個！'); return; }
      if (R.items[pick].f === target) {
        solved = true; G.sfx.ok(); G.$('.sure', area).disabled = true;
        var w = G.$('.why', area); w.innerHTML = '✅ ' + R.why; w.hidden = false; G.$('.nxrow', area).hidden = false;
      } else { G.sfx.bad(); api.miss(); G.toast('再聽一次，比較看看哪一個比較' + (R.want === 'high' ? '高（尖）' : '低（沉）') + '？'); }
    };
    G.$('.nx', area).onclick = function () { r++; if (r < lv.rounds.length) show(); else api.finish(); };
  }
  show();
};
