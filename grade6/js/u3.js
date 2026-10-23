/* 單元三 變動的大地 */

/* 河流地圖（程式畫的 SVG），熱點：上游、凹岸、凸岸、下游、河口 */
G.riverSVG = function (spots) {
  return '<rect width="400" height="300" rx="14" fill="#e8f5e9"/>' +
    '<path d="M0 0 H200 L150 40 L110 20 L60 70 L0 50Z" fill="#a1887f"/><path d="M60 0 L90 30 L120 0Z" fill="#8d6e63"/><path d="M0 20 L30 0 H0Z" fill="#fff"/>' +
    '<path d="M330 300 Q350 250 400 228 V300Z" fill="#4fc3f7"/><text x="372" y="292" font-size="14" fill="#01579b">海</text>' +
    '<path d="M335 268 L352 244 L372 266Z" fill="#d7ccc8" opacity=".9"/>' +
    '<path d="M60 40 Q100 100 140 120" fill="none" stroke="#29b6f6" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M140 120 Q260 110 270 170" fill="none" stroke="#29b6f6" stroke-width="10" stroke-linecap="round"/>' +
    '<path d="M270 170 Q280 230 340 250 Q350 254 356 256" fill="none" stroke="#29b6f6" stroke-width="15" stroke-linecap="round"/>' +
    '<text x="68" y="104" font-size="16">🪨</text><text x="160" y="112" font-size="12">🪨</text>' +
    '<text x="290" y="255" font-size="11" fill="#8d6e63">∴∴</text>' +
    spots.map(function (s, k) {
      return '<g class="spot" data-id="' + s.id + '"><circle class="hl" cx="' + s.x + '" cy="' + s.y + '" r="28" fill="#ffeb3b"/>' +
        '<circle cx="' + s.x + '" cy="' + s.y + '" r="13" fill="#fff" stroke="#ff9800" stroke-width="3"/>' +
        '<text x="' + s.x + '" y="' + (s.y + 5) + '" font-size="14" font-weight="900" text-anchor="middle" fill="#e65100">' + 'ABCDE'[k] + '</text>' +
        '<circle cx="' + s.x + '" cy="' + s.y + '" r="28" fill="transparent"/></g>';
    }).join('');
};
G.riverSpots = [{ id: 'up', x: 90, y: 78 }, { id: 'out', x: 290, y: 126 }, { id: 'in', x: 226, y: 160 }, { id: 'down', x: 300, y: 222 }, { id: 'mouth', x: 362, y: 270 }];

/* 找位置：lv.rounds:[{prompt, ans, why}]，點錯算一次失誤 */
G.types.spot = function (lv, area, api) {
  var rounds = lv.rounds, r = 0;
  function show() {
    var R = rounds[r];
    area.innerHTML = '<div class="panel sim"><div class="bar"><span>第 ' + (r + 1) + ' / ' + rounds.length + ' 題</span><span>💡 點地圖上的 A～E</span></div>' +
      '<div class="inst"><button class="say" aria-label="朗讀題目">🔈</button><div class="q">' + R.prompt + '</div></div>' +
      '<svg viewBox="0 0 400 300">' + G.riverSVG(G.riverSpots) + '</svg>' +
      '<div class="why" hidden></div><div class="row" hidden><button class="btn nx">' + (r === rounds.length - 1 ? '完成！' : '下一題 ➜') + '</button></div></div>';
    G.$('.say', area).onclick = function () { G.speak(R.prompt); };
    var solved = false;
    area.querySelectorAll('.spot').forEach(function (g) {
      g.addEventListener('click', function () {
        if (solved) return;
        if (g.dataset.id === R.ans) {
          solved = true; G.sfx.ok(); g.classList.add('on');
          var w = G.$('.why', area); w.innerHTML = '✅ ' + R.why; w.hidden = false; G.$('.row', area).hidden = false;
        } else { G.sfx.bad(); api.miss(); G.toast('不是這裡喔，再想想看！'); }
      });
    });
    G.$('.nx', area).onclick = function () { r++; if (r < rounds.length) show(); else api.finish(); };
  }
  show();
};

G.units.push({
  id: 'u3', no: '三', name: '變動的大地', e: '⛰️', c: '#8d6e63',
  sub: '流水的作用・岩石與礦物・土壤與化石',
  levels: [
    {
      name: '河流探險地圖', kind: 'op', type: 'spot', th: [0, 1],
      inst: '這是一條從高山流到大海的河流。依照題目，在地圖上點出正確的位置（A～E）！',
      recap: '流水有<b>侵蝕、搬運、堆積</b>三種作用。<b>上游</b>坡陡水急、侵蝕強，多大石頭、V 形谷；<b>下游</b>坡緩水慢、堆積多，河道寬、多細砂泥；河口堆積成<b>三角洲</b>。彎曲河道<b>凹岸</b>被侵蝕、<b>凸岸</b>堆積。',
      rounds: [
        { prompt: '哪裡坡度最陡、水流最急，侵蝕作用最強，河床有很多大石頭？', ans: 'up', why: 'A 是上游：坡度陡、水流快，侵蝕力強，常形成 V 形谷。' },
        { prompt: '河道轉彎時，哪一岸水流比較快，河岸會被<b>侵蝕</b>（凹岸）？', ans: 'out', why: 'B 在彎道外側（凹岸），水流快、侵蝕強，河岸會越來越往外凹。' },
        { prompt: '河道轉彎時，哪一岸水流比較慢，砂石會<b>堆積</b>下來（凸岸）？', ans: 'in', why: 'C 在彎道內側（凸岸），水流慢，砂石堆積形成沙洲。' },
        { prompt: '哪裡地勢平坦、河道很寬、水流緩慢，河床多是細砂和泥？', ans: 'down', why: 'D 是下游：坡度平緩，水流變慢，搬運來的細砂和泥堆積下來。' },
        { prompt: '河水把泥沙帶到出海口堆積，形成「三角洲」的是哪裡？', ans: 'mouth', why: 'E 是河口：水流進大海後速度變慢，泥沙堆積成三角洲。' }
      ]
    },
    {
      name: '岩石礦物偵探社', kind: 'idea', type: 'clue', pick: 5, unit: '題', th: [1, 3],
      ask: '猜猜我是哪一種岩石或礦物？',
      inst: '看提示猜猜看！礦物可以從顏色、硬度、條痕、光澤來分辨。提示看得越少，星星越多。',
      recap: '<b>岩石由礦物組成</b>。分辨礦物看<b>顏色、光澤、硬度、條痕</b>（在無釉瓷板上畫出的粉末顏色）。石英硬、方解石遇稀鹽酸冒泡、雲母能一片片剝開。花岡岩、大理石、砂岩、石灰岩在生活中各有用途。',
      rounds: [
        { ans: '石英', e: '💎', clues: ['我是一種礦物，常是無色透明或白色。', '我很硬，可以在玻璃上刻出刮痕。', '我是製造玻璃的主要原料。'], opts: ['方解石', '雲母', '滑石'] },
        { ans: '方解石', e: '🧪', clues: ['我是一種礦物，硬度不高，用銅幣就能刻出痕跡。', '滴上稀鹽酸，我會冒出氣泡。', '石灰岩和大理石主要由我組成。'], opts: ['石英', '雲母', '長石'] },
        { ans: '雲母', e: '📄', clues: ['我是一種有亮亮光澤的礦物。', '我可以被剝成一片一片很薄的薄片。', '我耐熱又絕緣，以前用在電器裡。'], opts: ['石英', '方解石', '黃鐵礦'] },
        { ans: '花岡岩', e: '🪦', clues: ['我是一種岩石，由岩漿在地底慢慢冷卻形成。', '我身上有黑、白、灰色的斑點顆粒。', '我很堅硬，常用來做建材、地板和墓碑。'], opts: ['砂岩', '大理石', '頁岩'] },
        { ans: '大理石', e: '🏛️', clues: ['我是一種岩石，花蓮太魯閣有很多我。', '我由石灰岩受到高溫高壓變成。', '我有美麗的花紋，常用來做地板和雕刻。'], opts: ['花岡岩', '砂岩', '玄武岩'] },
        { ans: '砂岩', e: '🏜️', clues: ['我是一種岩石，摸起來粗粗的。', '我是由很多砂粒堆積、膠結在一起形成的。', '仔細看，可以看到一顆一顆的砂粒。'], opts: ['大理石', '花岡岩', '玄武岩'] },
        { ans: '玄武岩', e: '⬛', clues: ['我是一種黑色或深灰色的岩石。', '我是岩漿噴出地面後快速冷卻形成的，常有小孔洞。', '澎湖有很多我形成的柱狀景觀。'], opts: ['砂岩', '大理石', '石灰岩'] }
      ]
    },
    {
      name: '土壤與化石的祕密', kind: 'boss', type: 'combo', th: [1, 3],
      inst: '岩石怎麼變成土壤？化石告訴我們什麼？大地的變化會帶來哪些災害？一起挑戰！',
      recap: '岩石受風吹、日晒、雨淋和生物作用，<b>風化</b>成碎屑，再混合動植物遺骸（<b>有機質</b>）形成<b>土壤</b>。<b>化石</b>是保存在地層（多在沉積岩）中的古代生物遺骸或痕跡，能幫我們推測古代環境。',
      steps: [
        {
          type: 'order', rounds: [{
            prompt: '岩石怎麼變成土壤？依照順序點一點！',
            why: '土壤的形成要非常非常久的時間，所以要好好保護土壤。',
            items: [{ e: '🪨', t: '堅硬的大岩石' }, { e: '🌦️', t: '風吹日晒雨淋，裂成岩塊' }, { e: '🧱', t: '碎成小石塊和砂粒' }, { e: '🍂', t: '混入動植物遺骸（有機質）' }, { e: '🌱', t: '形成可以種植物的土壤' }]
          }]
        },
        {
          type: 'quiz', pick: 5, qs: [
            { q: '化石是什麼？', big: '🐚', opts: ['保存在地層中的古代生物遺骸或痕跡', '形狀像動物的普通石頭', '現代動物的骨頭', '人工雕刻的石頭'], a: 0, why: '化石是古代生物的遺骸或活動痕跡（如腳印），被保存在地層中。' },
            { q: '在高山的岩層中發現貝殼化石，可以推測什麼？', big: '⛰️🐚', opts: ['這裡很久以前是海洋', '貝殼會爬山', '有人把貝殼帶上山', '山上會下貝殼雨'], a: 0, why: '貝殼生活在海裡，表示這裡古代是海，後來地殼抬升變成高山。' },
            { q: '化石最常在哪一類岩石中找到？', opts: ['沉積岩', '岩漿冷卻形成的火成岩', '金屬礦物', '玻璃'], a: 0, why: '生物遺骸被泥沙一層層掩埋，形成沉積岩，所以化石多在沉積岩中。' },
            { q: '岩石受到「風吹、日晒、雨淋」慢慢碎裂的作用叫做什麼？', opts: ['風化作用', '凝結作用', '熱脹作用', '光合作用'], a: 0, why: '岩石受氣候和生物影響而碎裂、分解，叫做風化作用。' },
            { q: '颱風豪雨後，山區可能發生土石流。下列哪一個做法比較安全？', opts: ['聽從撤離通知，遠離溪谷和山坡', '到溪邊觀察水位', '在山坡下搭帳篷', '開車進山區看風景'], a: 0, why: '豪雨時山區容易發生土石流和山崩，要聽從撤離通知。' },
            { q: '海岸邊的海蝕洞、海蝕平臺，主要是怎麼形成的？', opts: ['海浪長時間侵蝕岩石', '人工挖出來的', '地震震出來的', '火山噴發形成'], a: 0, why: '海浪拍打岩岸，長時間侵蝕，形成海蝕洞、海蝕平臺等地形。' },
            { q: '為什麼土壤對生物很重要？', opts: ['植物在土壤中生長，許多動物也住在土裡', '土壤可以發電', '土壤會自己移動', '土壤一下子就能形成，不重要'], a: 0, why: '植物靠土壤提供養分和水分，土壤也是許多小動物的家。' }
          ]
        }
      ]
    }
  ]
});
