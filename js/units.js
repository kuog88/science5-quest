// 單元與課次（依高雄市鳳山區五福國小 115 學年度五上自然課程計畫，南一版）
window.UNITS = [
  { id: 'u1', no: '一', name: '太陽與光', icon: '☀️', tint: '#fbefc9', weeks: '1–4',
    lessons: ['u1a', 'u1b'], boss: { name: '流星魔王關', icon: '🌠', video: 'boss-meteor' } },
  { id: 'u2', no: '二', name: '植物世界', icon: '🌱', tint: '#dcebd2', weeks: '5–9',
    lessons: ['u2a', 'u2b'], boss: { name: '落葉魔王關', icon: '🍂', video: 'boss-leaves' } },
  { id: 'u3', no: '三', name: '水溶液', icon: '🧪', tint: '#e3dcf0', weeks: '10–15',
    lessons: ['u3a', 'u3b', 'u3c'], boss: { name: '彩虹魔王關', icon: '🌈', video: 'rainbow' } },
  { id: 'u4', no: '四', name: '力與運動', icon: '🚲', tint: '#f3dcc8', weeks: '16–21',
    lessons: ['u4a', 'u4b', 'u4c'], boss: { name: '煙火魔王關', icon: '🎆', video: 'boss-fireworks' } },
];
window.LESSONS = {};

// 畫圖小工具：可點的圓點（文字標籤在這裡畫，不用生成圖裡的字）
window.H = {
  hot(id, x, y, c, label, lx, ly) {
    return `<g class="hot" data-id="${id}" tabindex="0" role="button" aria-label="${label}">
      <circle class="ring" cx="${x}" cy="${y}" r="22" stroke="var(${c})"/>
      <circle class="pin" cx="${x}" cy="${y}" r="14" fill="var(${c})"/>
      <text x="${lx}" y="${ly}">${label}</text></g>`;
  },
  petals(cx, cy, s, col) {
    return [0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="${-s}" rx="${s * 0.6}" ry="${s}" transform="translate(${cx} ${cy}) rotate(${r})" fill="${col}"/>`).join('');
  },
  // 在 svg 裡建立一個沿路徑移動的小東西
  mover(api, parent, shape, pathId, dur, delay) {
    const g = document.createElementNS(api.NS, 'g');
    g.innerHTML = shape;
    g.setAttribute('opacity', '0');
    const m = document.createElementNS(api.NS, 'animateMotion');
    m.setAttribute('dur', dur + 's'); m.setAttribute('begin', 'indefinite'); m.setAttribute('fill', 'freeze');
    const mp = document.createElementNS(api.NS, 'mpath'); mp.setAttribute('href', '#' + pathId);
    m.appendChild(mp); g.appendChild(m); parent.appendChild(g);
    api.later(() => { g.setAttribute('opacity', '1'); m.beginElement(); }, delay || 0);
    return g;
  },
};
