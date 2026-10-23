(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const app = $('#app');
  const UNITS = window.UNITS, L = window.LESSONS;

  // ---------- 工具 ----------
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const unitOf = (lessonId) => UNITS.find((u) => u.lessons.includes(lessonId));
  const examBadge = (u) => (u && u.exam ? `<span class="exam-badge">📝 ${window.EXAM_TITLE || '月考範圍'}</span>` : '');
  const starsHtml = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

  // ---------- 進度（存在這台裝置的瀏覽器） ----------
  const KEY = 'sci5-progress-v1';
  let save = { stars: {}, boss: {}, seen: {}, sound: true };
  try { save = Object.assign(save, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} };

  // ---------- 聲音 ----------
  let soundOn = save.sound !== false, voices = [], mediaAudio = null, actx = null;
  const loadVoices = () => { try { voices = speechSynthesis.getVoices(); } catch (e) {} };
  loadVoices();
  try { speechSynthesis.onvoiceschanged = loadVoices; } catch (e) {}
  function pickVoice() {
    for (const p of ['zh-TW', 'zh-HK', 'zh-CN', 'zh']) {
      const v = voices.find((x) => x.lang.replace('_', '-').startsWith(p));
      if (v) return v;
    }
    return null;
  }
  function stopTalk() {
    try { speechSynthesis.cancel(); } catch (e) {}
    if (mediaAudio) { mediaAudio.pause(); mediaAudio = null; }
  }
  function tts(text) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-TW'; u.rate = 0.9; u.pitch = 1.05;
      const v = pickVoice(); if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  // 手機瀏覽器要在「手指點下去的那一刻」先發一次聲音，之後才允許自動唸
  let unlocked = false;
  function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) {}
  }
  document.addEventListener('pointerdown', unlockAudio, { capture: true });
  document.addEventListener('touchend', unlockAudio, { capture: true });
  // media.js 列出的檔案才會去載入，不存在的錄音、影片不會害聲音卡住
  const MEDIA = window.MEDIA || {};
  const has = (type, key) => (MEDIA[type] || []).includes(key);
  // 有自己錄的配音（media/<id>.mp3，要列在 media.js）就播錄音，沒有就用裝置語音
  function say(text, audioSrc) {
    stopTalk();
    if (!soundOn || !text) return;
    const audioKey = audioSrc && audioSrc.replace(/^media\//, '').replace(/\.mp3$/, '');
    if (audioSrc && has('audio', audioKey)) {
      const a = new Audio(audioSrc); mediaAudio = a;
      const fallback = () => { if (mediaAudio === a) { mediaAudio = null; tts(text); } };
      a.onerror = fallback; a.play().catch(fallback);
      return;
    }
    tts(text);
  }
  function beep(freqs, dur = 0.12, type = 'sine') {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      let t = actx.currentTime;
      freqs.forEach((f) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur);
        t += dur * 0.8;
      });
    } catch (e) {}
  }
  const sfx = {
    tap: () => beep([660], 0.06, 'triangle'),
    good: () => beep([523, 659, 784], 0.12),
    bad: () => beep([240, 180], 0.15, 'square'),
    win: () => beep([523, 659, 784, 1046], 0.16),
  };
  const soundBtn = $('#btn-sound');
  const paintSound = () => { soundBtn.textContent = soundOn ? '🔊' : '🔇'; soundBtn.classList.toggle('off', !soundOn); };
  paintSound();
  soundBtn.onclick = () => { soundOn = !soundOn; save.sound = soundOn; persist(); paintSound(); if (!soundOn) stopTalk(); };
  $('#btn-home').onclick = () => { location.hash = 'home'; };

  function toast(msg, ms = 1200) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), ms);
  }
  const setTitle = (t) => { $('#top-title').textContent = t; };
  let timers = [];
  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
  function cleanup() {
    timers.forEach(clearTimeout); timers = [];
    stopTalk();
    document.querySelectorAll('.clear-video, .modal').forEach((el) => el.remove());
  }

  // ---------- 路由：#home、#learn-u1a、#quiz-u1a、#boss-u1 ----------
  function route() {
    cleanup();
    const h = location.hash.replace('#', '');
    const m = h.match(/^(learn|quiz|boss)-(\w+)$/);
    if (m && m[1] === 'learn' && L[m[2]]) renderLearn(L[m[2]]);
    else if (m && m[1] === 'quiz' && L[m[2]]) startQuiz({ lesson: L[m[2]] });
    else if (m && m[1] === 'boss' && UNITS.find((u) => u.id === m[2])) startQuiz({ unit: UNITS.find((u) => u.id === m[2]) });
    else renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  // =====================================================
  // 首頁：四個單元
  // =====================================================
  function bossOpen(u) { return u.lessons.every((id) => save.stars[id]); }
  function renderHome() {
    setTitle('五上自然闖關');
    const all = UNITS.flatMap((u) => u.lessons).length + UNITS.length;
    const done = Object.keys(save.stars).length + Object.keys(save.boss).length;
    app.innerHTML = `
      <section class="home-hero">
        <button class="mascot" data-act="hello" aria-label="跟小貓打招呼"><img src="assets/img/mascot.webp" alt="毛氈小貓吉祥物"></button>
        <div>
          <h1>五上自然闖關探索館</h1>
          <p>每一課先到「學習」點點看、聽講解，學會了再按「闖關」挑戰。</p>
          <span class="overall">已完成 ${done} / ${all} 關</span>
        </div>
      </section>
      ${UNITS.some((u) => u.exam) ? `<section class="exam-banner">
        <b>📝 ${window.EXAM_TITLE || '月考範圍'}</b>
        <span>${UNITS.filter((u) => u.exam).map((u) => `單元${u.no} ${u.name}`).join('、')}</span>
        <span class="links">${UNITS.filter((u) => u.exam).flatMap((u) => u.lessons).map((id) => `<a class="big-btn small pink" href="#learn-${id}">${L[id].title}</a>`).join('')}</span>
      </section>` : ''}
      <section class="units">
        ${UNITS.map((u) => `
          <div class="unit ${u.exam ? 'exam' : ''}" style="--tint:${u.tint}">
            <div class="unit-head"><div class="unit-orb" aria-hidden="true">${u.icon}</div>
              <div><small>單元${u.no}・第 ${u.weeks} 週</small><h2>${u.name}</h2>${examBadge(u)}</div></div>
            ${u.lessons.map((id) => { const l = L[id]; const s = save.stars[id] || 0; return `
              <div class="lesson-row">
                <div><div class="nm">${l.no}. ${l.title}</div><div class="wk">第 ${l.weeks} 週　<span class="st" aria-label="${s} 顆星">${starsHtml(s)}</span></div></div>
                <div class="btns"><a class="big-btn small blue" href="#learn-${id}">📖 學習</a><a class="big-btn small" href="#quiz-${id}">⭐ 闖關</a></div>
              </div>`; }).join('')}
            <div class="lesson-row boss ${bossOpen(u) ? '' : 'locked'}">
              <div><div class="nm">${u.boss.icon} ${u.boss.name}</div><div class="wk">${bossOpen(u) ? '整個單元大複習，有 3 顆愛心' : '先完成這單元的每一課闖關才能挑戰'}　<span class="st">${save.boss[u.id] ? starsHtml(save.boss[u.id]) : ''}</span></div></div>
              <div class="btns">${bossOpen(u) ? `<a class="big-btn small pink" href="#boss-${u.id}">挑戰魔王</a>` : `<button class="big-btn small ghost" data-act="locked">🔒</button>`}</div>
            </div>
          </div>`).join('')}
      </section>
      <button class="reset-link" data-act="reset">清除闖關紀錄</button>`;
    app.onclick = (e) => {
      const el = e.target.closest('[data-act]'); if (!el) return;
      if (el.dataset.act === 'hello') { sfx.tap(); say('嗨！我們一起來學自然吧！'); }
      if (el.dataset.act === 'locked') { sfx.bad(); toast('🔒 先完成這單元每一課的闖關喔！'); }
      if (el.dataset.act === 'reset') {
        if (el.dataset.sure) { save.stars = {}; save.boss = {}; save.seen = {}; persist(); renderHome(); toast('紀錄已清除'); }
        else { el.dataset.sure = '1'; el.textContent = '確定要清除嗎？再按一次'; }
      }
    };
  }

  // =====================================================
  // 學習頁
  // =====================================================
  let cur = null; // 目前的課
  function renderLearn(l) {
    cur = l;
    const u = unitOf(l.id);
    setTitle(`${u.name}・${l.title}`);
    const seen = new Set(save.seen[l.id] || []);
    const total = Object.keys(l.parts).length;
    app.innerHTML = `
      <section class="lesson-head">
        <div class="eyebrow">單元${u.no} ${u.name}・${l.no}. ${l.title}・第 ${l.weeks} 週</div>
        ${examBadge(u) ? `<div>${examBadge(u)}</div>` : ''}
        <h1>${l.title}</h1>
        <p>${l.intro}</p>
        <span class="explored" id="explored"></span>
      </section>
      <section class="exhibit">
        <div class="stage" id="stage">${l.svg}</div>
        <div class="legend">
          <p>${l.hint || '點圖上會閃的圓點，或按下面的按鈕，會跳出大卡片講解，還會唸給你聽。'}</p>
          <div class="chips">${l.chips.map((id) => `<button class="chip" data-part="${id}" style="--c:var(${l.parts[id].c})">${l.parts[id].name}</button>`).join('')}</div>
          ${l.widget ? '<div id="widget" class="panel" style="padding:14px"></div>' : ''}
          ${l.actions && l.actions.length ? `<div class="acts">${l.actions.map((a, i) => `<button class="act ${a.wide ? 'wide' : ''}" data-actn="${i}" style="--c:${a.c}">${a.label}<small>${a.sub}</small></button>`).join('')}</div>` : ''}
          ${l.facts ? `<div class="facts">${l.facts.map((f) => `<div style="--c:var(${f.c})"><b>${f.t}</b>${f.d}</div>`).join('')}</div>` : ''}
        </div>
      </section>
      ${(l.drawers || []).map((d) => `
        <section>
          <div class="sec-head"><h2>${d.title}</h2><p>${d.desc}</p></div>
          <div class="drawers">${d.ids.map((id) => { const p = l.parts[id]; return `<button class="drawer" data-part="${id}" style="--c:var(${p.c})">${visual(`${l.id}-${id}`, p.art, true)}<span class="tag">${p.kind}</span><h3>${p.name}</h3></button>`; }).join('')}</div>
        </section>`).join('')}
      <section class="panel go-quiz">
        <img src="assets/img/mascot.webp" alt="">
        <div>
          <h2>觀念都學會了嗎？</h2>
          <p>闖關會換到另一頁，題目每次都不一樣。答對 6 題以上就過關！</p>
          <a class="big-btn green" href="#quiz-${l.id}">開始闖關 ➜</a>
        </div>
      </section>`;

    const stage = $('#stage');
    const paintSeen = () => {
      const s = new Set(save.seen[l.id] || []);
      app.querySelectorAll('[data-part]').forEach((b) => b.classList.toggle('seen', s.has(b.dataset.part)));
      stage.querySelectorAll('.hot').forEach((h) => h.classList.toggle('seen', s.has(h.dataset.id)));
      $('#explored').textContent = `已探索 ${[...s].filter((id) => l.parts[id]).length} / ${total}`;
    };
    paintSeen();
    const open = (id) => { openCard(l, id); const s = new Set(save.seen[l.id] || []); s.add(id); save.seen[l.id] = [...s]; persist(); paintSeen(); };
    stage.querySelectorAll('.hot').forEach((h) => {
      h.addEventListener('click', () => open(h.dataset.id));
      h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(h.dataset.id); } });
    });
    app.onclick = (e) => {
      const p = e.target.closest('[data-part]'); if (p) { sfx.tap(); open(p.dataset.part); return; }
      const a = e.target.closest('[data-actn]'); if (a) { sfx.tap(); l.actions[+a.dataset.actn].run(api(stage)); }
    };
    if (l.widget) l.widget($('#widget'), api(stage));
    // 先把這一課的照片載好，點開卡片時就不會先閃一下手繪圖
    Object.keys(l.parts).forEach((id) => { if (has('photo', `${l.id}-${id}`)) new Image().src = `media/${l.id}-${id}.jpg`; });
  }
  // 有可靈寫實照片（列在 media.js）就直接用照片，沒有才用手繪圖
  function visual(key, art, thumb) {
    if (!has('photo', key)) return art || '';
    return `<img src="media/${key}.jpg" alt="" style="width:100%;height:100%;object-fit:cover;display:block;${thumb ? 'border-radius:14px;aspect-ratio:1/1' : ''}">`;
  }
  const api = (svg) => ({ svg, say, toast, sfx, later, NS: 'http://www.w3.org/2000/svg' });

  function openCard(l, id) {
    const item = l.parts[id];
    const key = `${l.id}-${id}`; // 可靈素材檔名，例如 u2a-root.jpg
    stopTalk();
    document.querySelectorAll('.modal').forEach((m) => m.remove());
    const back = document.activeElement;
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `
      <div class="card" role="dialog" aria-modal="true" aria-labelledby="cardTitle" style="--c:var(${item.c})">
        <div class="card-in">
          <figure class="media">${visual(key, item.art)}</figure>
          <div><div class="kind">${item.kind}</div><h3 id="cardTitle">${item.name}</h3><ul>${item.points.map((p) => `<li>${p}</li>`).join('')}</ul></div>
        </div>
        <div class="card-bar"><button class="big-btn green small" data-c="again">🔊 再聽一次</button><button class="big-btn ghost small" data-c="close">關閉</button></div>
      </div>`;
    document.body.appendChild(m);
    // 可靈影片（列在 media.js）會取代照片或手繪圖
    if (has('video', key)) {
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.loop = true; v.autoplay = true; v.preload = 'auto';
      v.addEventListener('loadeddata', () => { if (m.isConnected) { const f = $('.media', m); f.innerHTML = ''; f.appendChild(v); v.play().catch(() => {}); } }, { once: true });
      v.src = `media/${key}.mp4`;
    }
    const close = () => { m.remove(); stopTalk(); if (back) back.focus(); document.removeEventListener('keydown', esc); };
    const esc = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc);
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('[data-c="close"]')) close();
      if (e.target.closest('[data-c="again"]')) say(item.say, `media/${key}.mp3`);
    });
    say(item.say, `media/${key}.mp3`);
    $('[data-c="close"]', m).focus();
  }

  // =====================================================
  // 闖關頁（一般關：8 題、答對 6 題過關；魔王關：10 題、3 顆愛心）
  // =====================================================
  let game = null;
  function startQuiz({ lesson, unit }) {
    if (unit && !bossOpen(unit)) { toast('🔒 先完成這單元每一課的闖關喔！'); location.hash = 'home'; return; }
    let pool;
    // 上一回出過的題目排到最後，這回優先出沒看過的
    const key = lesson ? lesson.id : unit.id;
    const recent = new Set((save.recent && save.recent[key]) || []);
    const fresh = (list) => { const s = shuffle(list); return [...s.filter((q) => !recent.has(q.q)), ...s.filter((q) => recent.has(q.q))]; };
    if (lesson) {
      // 點圖題每回隨機出 1～3 題，其他題目補滿 8 題
      const nTap = 1 + Math.floor(Math.random() * 3);
      const taps = fresh(lesson.quiz.filter((q) => q.tap)).slice(0, nTap);
      const rest = fresh(lesson.quiz.filter((q) => !q.tap)).slice(0, 8 - taps.length);
      pool = shuffle([...taps, ...rest]).map((q) => ({ ...q, lesson }));
    }
    else pool = fresh(unit.lessons.flatMap((id) => L[id].quiz.map((q) => ({ ...q, lesson: L[id] })))).slice(0, 10);
    save.recent = save.recent || {};
    save.recent[key] = pool.map((q) => q.q);
    persist();
    game = { lesson, unit, qs: pool, i: 0, right: 0, wrong: [], hearts: 3, marks: [] };
    setTitle(lesson ? `闖關：${lesson.title}` : `${unit.boss.name}`);
    showQ();
  }
  function showQ() {
    const g = game, q = g.qs[g.i];
    const opts = q.opts ? shuffle(q.opts.map((t, i) => ({ t, ok: i === q.a }))) : null;
    q._opts = opts;
    app.innerHTML = `
      <div class="quiz-page">
        <div class="quiz-top">
          <h1>${g.lesson ? `⭐ ${g.lesson.title}` : `${g.unit.boss.icon} ${g.unit.boss.name}`}</h1>
          ${g.unit ? `<span class="hearts" aria-label="剩 ${g.hearts} 顆愛心">${'❤️'.repeat(g.hearts)}${'🤍'.repeat(3 - g.hearts)}</span>` : ''}
          <a class="big-btn ghost small" href="#learn-${(g.lesson || L[g.unit.lessons[0]]).id}">📖 回去學習</a>
        </div>
        <div class="dots">${g.qs.map((_, i) => `<span class="dot ${i < g.i ? (g.marks[i] ? 'done' : 'miss') : i === g.i ? 'now' : ''}"></span>`).join('')}</div>
        <div class="panel qcard">
          <span class="qlv">第 ${g.i + 1} / ${g.qs.length} 題・${q.lv}</span>
          <div class="qtext"><span>${q.q}</span><button class="icon-btn" id="qsay" aria-label="唸題目">🔊</button></div>
          ${q.tap ? `<div class="qfig quizmode" id="qfig">${q.fig || q.lesson.svg}<div class="tap-hint">👆 直接點圖上的圓點作答</div></div>`
                  : `${q.fig ? `<div class="qfig">${q.fig}</div>` : ''}<div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}">${'ABCD'[i]}. ${o.t}</button>`).join('')}</div>`}
          <div id="fb"></div>
          <div class="qnav"><button class="big-btn green" id="next" hidden>${g.i === g.qs.length - 1 ? '看結果 ➜' : '下一題 ➜'}</button></div>
        </div>
      </div>`;
    const readQ = () => say(q.q + (opts ? '。' + opts.map((o, i) => 'ABCD'[i] + '，' + o.t).join('。') : ''));
    $('#qsay').onclick = readQ;
    later(() => say(q.q), 350);
    if (q.tap) {
      const fig = $('#qfig');
      fig.querySelectorAll('.hot').forEach((h) => {
        h.setAttribute('aria-label', '圖上的一個部位');
        const pick = () => answer((q.accept || [q.tap]).includes(h.dataset.id), h);
        h.addEventListener('click', pick);
        h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      });
    } else {
      app.querySelectorAll('.opt').forEach((b) => b.onclick = () => answer(opts[+b.dataset.i].ok, b));
    }
    $('#next').onclick = () => { sfx.tap(); g.i++; if (g.i < g.qs.length && !(g.unit && g.hearts <= 0)) showQ(); else finish(); };
  }
  function answer(ok, el) {
    const g = game, q = g.qs[g.i];
    if (g.answered === g.i) return; g.answered = g.i;
    g.marks[g.i] = ok;
    if (ok) { g.right++; sfx.good(); } else { g.wrong.push(q); sfx.bad(); if (g.unit) g.hearts--; }
    let rightTxt;
    if (q.tap) {
      const fig = $('#qfig');
      fig.classList.remove('quizmode');
      fig.querySelectorAll('.hot').forEach((h) => { if ((q.accept || [q.tap]).includes(h.dataset.id)) h.classList.add('right'); });
      if (!ok) el.classList.add('wrong');
      rightTxt = (q.accept || [q.tap]).map((id) => q.lesson.parts[id].name).join(' 或 ');
      $('.tap-hint', fig).textContent = `正確答案：${rightTxt}`;
    } else {
      app.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (q._opts[i].ok) b.classList.add('right'); });
      if (!ok) el.classList.add('wrong');
      rightTxt = q._opts.find((o) => o.ok).t;
    }
    $('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}"><b>${ok ? '⭕ 答對了！' : `❌ 答案是「${rightTxt}」`}</b>${q.why}</div>`;
    say((ok ? '答對了！' : '答案是' + rightTxt + '。') + q.why);
    if (g.unit) { const h = $('.hearts'); if (h) h.innerHTML = '❤️'.repeat(g.hearts) + '🤍'.repeat(3 - g.hearts); }
    const nx = $('#next');
    if (g.unit && g.hearts <= 0) nx.textContent = '看結果 ➜';
    nx.hidden = false; nx.focus({ preventScroll: true });
    nx.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function finish() {
    const g = game;
    const n = g.qs.length;
    const passed = g.unit ? g.hearts > 0 : g.right >= 6;
    const miss = g.wrong.length;
    const stars = g.unit ? g.hearts : miss === 0 ? 3 : miss <= 2 ? 2 : 1;
    if (passed) {
      if (g.lesson) save.stars[g.lesson.id] = Math.max(save.stars[g.lesson.id] || 0, stars);
      else save.boss[g.unit.id] = Math.max(save.boss[g.unit.id] || 0, stars);
      persist();
      playClearVideo(g.lesson ? g.lesson.clip : g.unit.boss.video, () => showResult(true, stars));
    } else showResult(false, 0);
  }
  function playClearVideo(name, then) {
    const ov = document.createElement('div');
    ov.className = 'clear-video';
    ov.innerHTML = `<div class="clear-video-box"><video src="assets/video/${name}.mp4" playsinline preload="auto"></video><button class="skip-btn" type="button">跳過 ⏭</button></div>`;
    document.body.appendChild(ov);
    const v = $('video', ov);
    v.muted = !soundOn;
    let finished = false;
    const done = () => { if (finished) return; finished = true; if (!ov.isConnected) return; ov.remove(); then(); };
    v.addEventListener('ended', done); v.addEventListener('error', done);
    $('.skip-btn', ov).addEventListener('click', done);
    v.play().catch(() => { v.muted = true; v.play().catch(done); });
    later(done, 8000);
  }
  function showResult(passed, stars) {
    const g = game;
    const l = g.lesson, u = g.unit || unitOf(l.id);
    const idx = l ? u.lessons.indexOf(l.id) : -1;
    const nextId = l && idx < u.lessons.length - 1 ? u.lessons[idx + 1] : null;
    const backLearn = (l || L[u.lessons[0]]).id;
    const review = g.wrong.length ? `<div class="review"><b>要再複習的題目</b>${g.wrong.map((q) => `<div>${q.q}<br><span>${q.why}</span></div>`).join('')}</div>` : '';
    if (passed) {
      sfx.win();
      const msg = stars === 3 ? '全對！你是自然小博士！' : '過關成功！';
      later(() => say(msg), 300);
      app.innerHTML = `
        <div class="quiz-page"><div class="panel result">
          <img class="result-img" src="assets/img/win.webp" alt="">
          <h2>${msg}</h2>
          <div class="stars" aria-label="${stars} 顆星">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3 - stars)}</span></div>
          <p>${g.unit ? `剩下 ${g.hearts} 顆愛心` : `答對 ${g.right} / ${g.qs.length} 題`}</p>
          ${review}
          <div class="actions">
            <a class="big-btn ghost" href="#${g.unit ? 'boss-' + g.unit.id : 'quiz-' + l.id}" data-again>🔁 再玩一次</a>
            ${nextId ? `<a class="big-btn" href="#learn-${nextId}">下一課 ➜</a>` : ''}
            ${l && !nextId && bossOpen(u) ? `<a class="big-btn pink" href="#boss-${u.id}">${u.boss.icon} 挑戰魔王</a>` : ''}
            <a class="big-btn blue" href="#home">🗺️ 回地圖</a>
          </div>
        </div></div>`;
    } else {
      sfx.bad();
      const msg = g.unit ? '愛心用完了，回去複習再來！' : `答對 ${g.right} 題，差一點點！`;
      later(() => say(msg + '看看錯的題目，再回去學一次吧。'), 300);
      app.innerHTML = `
        <div class="quiz-page"><div class="panel result">
          <img class="result-img" src="assets/img/tryagain.webp" alt="">
          <h2>${msg}</h2>
          <p>${g.unit ? '' : '答對 6 題以上就能過關。'}</p>
          ${review}
          <div class="actions">
            <a class="big-btn green" href="#learn-${backLearn}">📖 回去學習</a>
            <a class="big-btn ghost" href="#${g.unit ? 'boss-' + g.unit.id : 'quiz-' + l.id}" data-again>🔁 再試一次</a>
            <a class="big-btn blue" href="#home">🗺️ 回地圖</a>
          </div>
        </div></div>`;
    }
    // 同一個網址再按一次不會觸發 hashchange，所以自己重開
    const again = $('[data-again]', app);
    if (again) again.onclick = (e) => { if (location.hash === again.getAttribute('href')) { e.preventDefault(); route(); } };
  }

  window.__sci = { get game() { return game; } }; // 方便檢查用
  route();
})();
