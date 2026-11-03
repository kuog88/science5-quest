/* 三下自然：三版本單元對照（KGVer）。levels 寫遊戲單元代號（整個單元）或「代號-第幾關」（只用那一關） */
window.BOOK = {
  subject: 'science', grade: 3, sem: '下', defaultVersion: 'nani',
  versions: {
    nani: [
      { no: 1, title: '種菜好好玩', levels: ['u1'], bankUnits: ['第 1 單元 種菜好好玩'] },
      { no: 2, title: '溫度與物質變化的關係', levels: ['u2'], bankUnits: ['第 2 單元 溫度與物質變化的關係'] },
      { no: 3, title: '天氣特派員', levels: ['u3'], bankUnits: ['第 3 單元 天氣特派員'] },
      { no: 4, title: '廚房中的科學', levels: ['u4'], bankUnits: ['第 4 單元 廚房中的科學'] }
    ],
    kang: [
      { no: 1, title: '田園樂', levels: ['u1'], bankUnits: ['第 1 單元 種菜好好玩'] },
      { no: 2, title: '溫度變化對物質的影響', levels: ['u2'], bankUnits: ['第 2 單元 溫度與物質變化的關係'] },
      { no: 3, title: '我是動物解說員', levels: ['an', 'sv'], bankUnits: ['動物的身體構造與功能', '動物的生存法寶'] },
      { no: 4, title: '天氣變變變', levels: ['u3', 'se'], bankUnits: ['第 3 單元 天氣特派員'] }
    ],
    han: [
      { no: 1, title: '快樂小農夫', levels: ['u1'], bankUnits: ['第 1 單元 種菜好好玩'] },
      { no: 2, title: '千變萬化的水', levels: ['wt-1', 'u2', 'wt-2', 'wt-3'], bankUnits: ['會爬的水與水資源', '第 2 單元 溫度與物質變化的關係'] },
      { no: 3, title: '天氣停看聽', levels: ['u3', 'se'], bankUnits: ['第 3 單元 天氣特派員'] },
      { no: 4, title: '動物王國', levels: ['an', 'sv'], bankUnits: ['動物的身體構造與功能', '動物的生存法寶'] }
    ]
  }
};
