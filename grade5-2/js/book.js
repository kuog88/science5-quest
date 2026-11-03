/* 五下自然：三版本單元對照（KGVer）。levels 寫遊戲單元代號（整個單元）或「代號-第幾關」（只用那一關） */
window.BOOK = {
  subject: 'science', grade: 5, sem: '下', defaultVersion: 'nani',
  versions: {
    nani: [
      { no: 1, title: '星星的世界', levels: ['u1'], bankUnits: ['第 1 單元 星星的世界'] },
      { no: 2, title: '認識燃燒與生鏽', levels: ['u2'], bankUnits: ['第 2 單元 認識燃燒與生鏽'] },
      { no: 3, title: '動物的生活', levels: ['u3'], bankUnits: ['第 3 單元 動物的生活'] },
      { no: 4, title: '聲音與樂器', levels: ['u4'], bankUnits: ['第 4 單元 聲音與樂器'] }
    ],
    kang: [
      { no: 1, title: '力與運動', levels: ['fm'], bankUnits: ['力與運動'] },
      { no: 2, title: '大地的奧祕', levels: ['qk-1', 'ea', 'qk-2', 'qk-3'], bankUnits: ['大地的奧祕'] },
      { no: 3, title: '植物世界面面觀', levels: ['pl'], bankUnits: ['植物世界面面觀'] },
      { no: 4, title: '熱的作用與傳播', levels: ['ht'], bankUnits: ['熱的作用與傳播'] }
    ],
    han: [
      { no: 1, title: '探索星空的奧祕', levels: ['u1'], bankUnits: ['第 1 單元 星星的世界'] },
      { no: 2, title: '空氣與燃燒', levels: ['u2-1', 'u2-2'], bankUnits: ['空氣與燃燒'] },
      { no: 3, title: '防止生鏽與保存食物', levels: ['u2-3', 'fd'], bankUnits: ['防止生鏽與保存食物'] },
      { no: 4, title: '揭祕動物的世界', levels: ['u3'], bankUnits: ['第 3 單元 動物的生活'] }
    ]
  }
};
