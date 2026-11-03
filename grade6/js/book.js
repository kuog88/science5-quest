/* 六上自然：三版本單元對照（KGVer）。levels 寫遊戲單元代號（整個單元）或「代號-第幾關」（只用那一關） */
window.BOOK = {
  subject: 'science', grade: 6, sem: '上', defaultVersion: 'nani',
  versions: {
    nani: [
      { no: 1, title: '多樣的天氣變化', levels: ['u1'], bankUnits: ['第 1 單元 多樣的天氣變化'] },
      { no: 2, title: '熱對物質的影響', levels: ['u2'], bankUnits: ['第 2 單元 熱對物質的影響'] },
      { no: 3, title: '變動的大地', levels: ['u3'], bankUnits: ['第 3 單元 變動的大地'] },
      { no: 4, title: '奇妙的電磁世界', levels: ['u4'], bankUnits: ['第 4 單元 奇妙的電磁世界'] }
    ],
    kang: [
      { no: 1, title: '探索天氣的變化', levels: ['u1', 'cc'], bankUnits: ['第 1 單元 多樣的天氣變化'] },
      { no: 2, title: '水溶液', levels: ['sol'], bankUnits: ['水溶液'] },
      { no: 3, title: '動物大解密', levels: ['an-1', 'br'], bankUnits: ['動物大解密'] },
      { no: 4, title: '電磁作用', levels: ['u4'], bankUnits: ['第 4 單元 奇妙的電磁世界'] }
    ],
    han: [
      { no: 1, title: '熱的影響與傳播', levels: ['pc', 'u2'], bankUnits: ['第 2 單元 熱對物質的影響'] },
      { no: 2, title: '多變的天氣', levels: ['u1'], bankUnits: ['第 1 單元 多樣的天氣變化'] },
      { no: 3, title: '發現大地的奧祕', levels: ['qk-2', 'u3', 'qk-3'], bankUnits: ['第 3 單元 變動的大地'] },
      { no: 4, title: '電磁與生活', levels: ['u4'], bankUnits: ['第 4 單元 奇妙的電磁世界'] }
    ]
  }
};
