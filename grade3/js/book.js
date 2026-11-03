/* 三上自然：三版本單元對照（KGVer）。levels 寫遊戲單元代號（整個單元）或「代號-第幾關」（只用那一關） */
window.BOOK = {
  subject: 'science', grade: 3, sem: '上', defaultVersion: 'nani',
  versions: {
    nani: [
      { no: 1, title: '認識植物', levels: ['u1'], bankUnits: ['第 1 單元 認識植物'] },
      { no: 2, title: '空氣和水', levels: ['u2'], bankUnits: ['第 2 單元 空氣和水'] },
      { no: 3, title: '認識動物', levels: ['u3'], bankUnits: ['第 3 單元 認識動物'] },
      { no: 4, title: '磁鐵', levels: ['u4'], bankUnits: ['第 4 單元 磁鐵'] }
    ],
    kang: [
      { no: 1, title: '多采多姿的植物', levels: ['u1'], bankUnits: ['第 1 單元 認識植物'] },
      { no: 2, title: '生活中的力', levels: ['fo', 'u4'], bankUnits: ['生活中的力', '第 4 單元 磁鐵'] },
      { no: 3, title: '奇妙的空氣', levels: ['u2-1', 'u2-2', 'aq'], bankUnits: ['第 2 單元 空氣和水', '乾淨的空氣'] },
      { no: 4, title: '廚房裡的科學', levels: ['ds', 'ab'], bankUnits: ['溶解與物質的辨別', '紫色高麗菜汁與酸鹼'] }
    ],
    han: [
      { no: 1, title: '植物大發現', levels: ['u1'], bankUnits: ['第 1 單元 認識植物'] },
      { no: 2, title: '磁鐵好好玩', levels: ['u4'], bankUnits: ['第 4 單元 磁鐵'] },
      { no: 3, title: '風與空氣', levels: ['u2'], bankUnits: ['第 2 單元 空氣和水'] },
      { no: 4, title: '奇妙的溶解', levels: ['ds'], bankUnits: ['溶解與物質的辨別'] }
    ]
  }
};
