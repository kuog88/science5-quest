/* 四上自然探險島：共用引擎（拖曳、音效、朗讀、題型） */
var G = { units: [], types: {} };

G.$ = function (s, r) { return (r || document).querySelector(s); };
G.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
G.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
G.starsByMiss = function (m, a, b) { a = a == null ? 0 : a; b = b == null ? 2 : b; return m <= a ? 3 : m <= b ? 2 : 1; };
G.starText = function (n) { return '★★★'.slice(0, n) + '☆☆☆'.slice(0, 3 - n); };

/* ---------- 進度 ---------- */
G.KEY = 'science-g4-progress';
G.save = {};
try { G.save = JSON.parse(localStorage.getItem(G.KEY)) || {}; } catch (e) { G.save = {}; }
G.getStars = function (id) { return (G.save.stars && G.save.stars[id]) || 0; };
G.setStars = function (id, n) {
  G.save.stars = G.save.stars || {};
  if ((G.save.stars[id] || 0) < n) G.save.stars[id] = n;
  G.persist();
};
G.persist = function () { try { localStorage.setItem(G.KEY, JSON.stringify(G.save)); } catch (e) { } };

/* ---------- 音效 ---------- */
G.soundOn = G.save.sound !== false;
G.actx = null;
G.tone = function (freq, dur, type, delay) {
  if (!G.soundOn) return;
  try {
    if (!G.actx) G.actx = new (window.AudioContext || window.webkitAudioContext)();
    var t = G.actx.currentTime + (delay || 0);
    var o = G.actx.createOscillator(), g = G.actx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(G.actx.destination); o.start(t); o.stop(t + dur);
  } catch (e) { }
};
G.sfx = {
  ok: function () { G.tone(660, .12, 'triangle'); G.tone(880, .16, 'triangle', .1); },
  bad: function () { G.tone(220, .22, 'square'); },
  win: function () { [523, 659, 784, 1047].forEach(function (f, i) { G.tone(f, .2, 'triangle', i * .12); }); },
  tick: function () { G.tone(520, .06, 'sine'); }
};

/* ---------- 朗讀 ---------- */
G.speak = function (text) {
  if (!('speechSynthesis' in window)) { G.toast('這台裝置不支援朗讀'); return; }
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ''));
  u.lang = 'zh-TW'; u.rate = 0.9;
  var v = speechSynthesis.getVoices().filter(function (v) { return /zh[-_]TW/i.test(v.lang); })[0];
  if (v) u.voice = v;
  speechSynthesis.speak(u);
};

G.toastTimer = 0;
G.toast = function (msg, ms) {
  var t = G.$('#toast'); if (!t) return;
  t.innerHTML = msg; t.hidden = false;
  clearTimeout(G.toastTimer);
  G.toastTimer = setTimeout(function () { t.hidden = true; }, ms || 2600);
};
G.bump = function (el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

/* ---------- 拖曳（滑鼠＋觸控），也可「點一下選取、再點目標」 ---------- */
G.picked = null;
G.unpick = function () { if (G.picked) G.picked.chip.classList.remove('picked'); G.picked = null; };
G.dropAt = function (x, y) { var el = document.elementFromPoint(x, y); return el && el.closest('[data-drop]'); };
G.makeDrag = function (chip, onDrop) {
  chip.addEventListener('pointerdown', function (e) {
    if (chip.dataset.locked) return;
    e.preventDefault();
    var sx = e.clientX, sy = e.clientY, ghost = null, moved = false, last = null;
    var r = chip.getBoundingClientRect();
    function move(ev) {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
        moved = true; G.unpick();
        ghost = chip.cloneNode(true); ghost.classList.add('ghost'); ghost.style.width = r.width + 'px';
        document.body.appendChild(ghost); chip.classList.add('dragging');
      }
      if (moved) {
        ghost.style.left = (ev.clientX - r.width / 2) + 'px';
        ghost.style.top = (ev.clientY - r.height / 2) + 'px';
        var t = G.dropAt(ev.clientX, ev.clientY);
        if (t !== last) { if (last) last.classList.remove('hi'); if (t) t.classList.add('hi'); last = t; }
      }
    }
    function up(ev) {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      chip.classList.remove('dragging');
      if (last) last.classList.remove('hi');
      if (moved) {
        ghost.remove();
        var t = ev.type === 'pointerup' ? G.dropAt(ev.clientX, ev.clientY) : null;
        if (t) onDrop(chip, t);
      } else {
        if (G.picked && G.picked.chip === chip) { G.unpick(); return; }
        G.unpick(); G.picked = { chip: chip, onDrop: onDrop }; chip.classList.add('picked');
      }
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  });
};
G.makeDrop = function (el) {
  el.setAttribute('data-drop', '1');
  el.addEventListener('click', function () {
    if (!G.picked) return;
    var p = G.picked; G.unpick(); p.onDrop(p.chip, el);
  });
};
G.chipHTML = function (it) {
  return (it.e ? '<span class="e">' + it.e + '</span>' : '') + '<span>' + G.esc(it.t) + '</span>';
};

/* ---------- 題型：選擇題 quiz ---------- */
/* lv.qs: [{q, big?, opts:[...], a:正確索引, why}]，lv.pick 抽幾題 */
G.types.quiz = function (lv, area, api) {
  var qs = G.shuffle(lv.qs).slice(0, lv.pick || lv.qs.length);
  var i = 0;
  function show() {
    var Q = qs[i];
    var order = G.shuffle(Q.opts.map(function (o, k) { return k; }));
    var dots = qs.map(function (_, k) { return '<i class="' + (k < i ? 'on' : k === i ? 'cur' : '') + '"></i>'; }).join('');
    area.innerHTML = '<div class="panel">' +
      '<div class="bar"><div class="dots">' + dots + '</div><span>第 ' + (i + 1) + ' / ' + qs.length + ' 題</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀題目">🔈</button><div class="q">' + Q.q + (Q.big ? '<span class="big">' + Q.big + '</span>' : '') + '</div></div>' +
      '<div class="opts">' + order.map(function (k) { return '<button class="opt" data-k="' + k + '">' + Q.opts[k] + '</button>'; }).join('') + '</div>' +
      '<div class="why" hidden></div><div class="row" hidden><button class="btn nx">' + (i === qs.length - 1 ? '完成！' : '下一題 ➜') + '</button></div></div>';
    G.$('.say', area).onclick = function () { G.speak(Q.q + '。' + Q.opts.join('、')); };
    area.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        var k = +b.dataset.k;
        if (k === Q.a) {
          G.sfx.ok(); b.classList.add('right'); G.bump(b, 'pop');
          area.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          var w = G.$('.why', area); w.innerHTML = '✅ ' + (Q.why || '答對了！'); w.hidden = false;
          G.$('.row', area).hidden = false;
        } else {
          G.sfx.bad(); b.classList.add('wrong'); b.disabled = true; G.bump(b, 'shake'); api.miss();
        }
      };
    });
    G.$('.nx', area).onclick = function () { i++; if (i < qs.length) show(); else api.finish(); };
  }
  show();
};

/* ---------- 題型：分類 sort ---------- */
/* lv.bins: [{k, t, e?, c?}]  lv.items: [{t, e, k, why?}] */
G.types.sort = function (lv, area, api) {
  var items = G.shuffle(lv.items), left = items.length;
  area.innerHTML = '<div class="panel"><div class="bar"><span>還剩 <b class="left">' + left + '</b> 個</span><span>💡 拖曳卡片，或點一下卡片再點籃子</span></div>' +
    '<div class="bins">' + lv.bins.map(function (b) {
      return '<div class="bin" data-k="' + b.k + '" style="--bc:' + (b.c || 'var(--green)') + '"><h3>' + (b.e || '') + ' ' + b.t + '</h3><div class="in"></div></div>';
    }).join('') + '</div><div class="pool"></div></div>';
  var pool = G.$('.pool', area);
  area.querySelectorAll('.bin').forEach(G.makeDrop);
  items.forEach(function (it) {
    var c = document.createElement('div'); c.className = 'chip'; c.innerHTML = G.chipHTML(it); pool.appendChild(c);
    G.makeDrag(c, function (chip, bin) {
      if (bin.dataset.k === it.k) {
        G.sfx.ok(); chip.className = 'chip small pop'; chip.dataset.locked = '1';
        G.$('.in', bin).appendChild(chip); left--; G.$('.left', area).textContent = left;
        if (it.why) G.toast('✅ ' + it.why, 2000);
        if (!left) setTimeout(api.finish, 700);
      } else {
        G.sfx.bad(); api.miss(); G.bump(chip, 'shake');
        G.toast('再想想看！' + (it.hint ? '💡 ' + it.hint : ''));
      }
    });
  });
};

/* ---------- 題型：依序點選 order ---------- */
/* lv.rounds: [{prompt, items:[{t, svg?|e?}]（已依正確順序）}] */
G.types.order = function (lv, area, api) {
  var r = 0;
  function show() {
    var R = lv.rounds[r], next = 0;
    var cards = G.shuffle(R.items.map(function (it, k) { return { it: it, k: k }; }));
    area.innerHTML = '<div class="panel"><div class="bar"><span>第 ' + (r + 1) + ' / ' + lv.rounds.length + ' 回</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀">🔈</button><div class="q">' + R.prompt + '</div></div>' +
      '<div class="cards">' + cards.map(function (c) {
        return '<button class="ocard" data-k="' + c.k + '">' + (c.it.svg || '<div style="font-size:50px">' + (c.it.e || '') + '</div>') + '<div>' + c.it.t + '</div></button>';
      }).join('') + '</div><div class="why" hidden></div><div class="row" hidden><button class="btn nx">' + (r === lv.rounds.length - 1 ? '完成！' : '下一回 ➜') + '</button></div></div>';
    G.$('.say', area).onclick = function () { G.speak(R.prompt); };
    area.querySelectorAll('.ocard').forEach(function (b) {
      b.onclick = function () {
        if (b.classList.contains('done')) return;
        if (+b.dataset.k === next) {
          G.sfx.ok(); b.classList.add('done'); next++;
          b.insertAdjacentHTML('beforeend', '<span class="num">' + next + '</span>'); G.bump(b, 'pop');
          if (next === R.items.length) {
            var w = G.$('.why', area); w.innerHTML = '✅ ' + (R.why || '排對了！'); w.hidden = false;
            G.$('.row', area).hidden = false;
          }
        } else { G.sfx.bad(); api.miss(); G.bump(b, 'shake'); }
      };
    });
    G.$('.nx', area).onclick = function () { r++; if (r < lv.rounds.length) show(); else api.finish(); };
  }
  show();
};

/* ---------- 題型：猜猜我是誰 clue ---------- */
/* lv.rounds: [{ans, e, clues:[...], opts:[...]}]；多看一個提示或答錯都算一次失誤 */
G.types.clue = function (lv, area, api) {
  var rounds = G.shuffle(lv.rounds).slice(0, lv.pick || lv.rounds.length), r = 0;
  function show() {
    var R = rounds[r], shown = 1;
    var opts = G.shuffle(R.opts.concat([R.ans]));
    area.innerHTML = '<div class="panel"><div class="bar"><span>第 ' + (r + 1) + ' / ' + rounds.length + ' 隻</span><span>提示越少，星星越多！</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀提示">🔈</button><div class="q">猜猜我是哪一種動物？</div></div>' +
      '<div class="clues"></div><div class="row"><button class="btn alt more">🔍 再給我一個提示</button></div>' +
      '<div class="opts" style="margin-top:12px">' + opts.map(function (o) { return '<button class="opt" data-o="' + o + '">' + o + '</button>'; }).join('') + '</div>' +
      '<div class="why" hidden></div><div class="row nxrow" hidden><button class="btn nx">' + (r === rounds.length - 1 ? '完成！' : '下一隻 ➜') + '</button></div></div>';
    function renderClues() {
      G.$('.clues', area).innerHTML = R.clues.slice(0, shown).map(function (c, k) { return '<div class="clue">提示 ' + (k + 1) + '：' + c + '</div>'; }).join('');
      G.$('.more', area).disabled = shown >= R.clues.length;
    }
    renderClues();
    G.$('.say', area).onclick = function () { G.speak(R.clues.slice(0, shown).join('。')); };
    G.$('.more', area).onclick = function () { if (shown < R.clues.length) { shown++; api.miss(); G.sfx.tick(); renderClues(); } };
    area.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.o === R.ans) {
          G.sfx.ok(); b.classList.add('right');
          area.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          G.$('.more', area).disabled = true;
          var w = G.$('.why', area); w.innerHTML = '<span style="font-size:40px">' + R.e + '</span> 答對了！我是<b>' + R.ans + '</b>。' + (R.why || ''); w.hidden = false;
          G.$('.nxrow', area).hidden = false;
        } else { G.sfx.bad(); api.miss(); b.classList.add('wrong'); b.disabled = true; G.bump(b, 'shake'); }
      };
    });
    G.$('.nx', area).onclick = function () { r++; if (r < rounds.length) show(); else api.finish(); };
  }
  show();
};

/* ---------- 題型：組合 combo（依序進行多段，失誤累計） ---------- */
/* lv.steps: [{type, ...該題型參數}] */
G.types.combo = function (lv, area, api) {
  var s = 0;
  function run() {
    var st = lv.steps[s];
    G.types[st.type](st, area, { miss: api.miss, finish: function () { s++; if (s < lv.steps.length) { run(); window.scrollTo(0, 0); } else api.finish(); } });
  }
  run();
};
