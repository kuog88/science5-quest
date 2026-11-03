/* 四上自然：三版本單元對照（KGVer）。levels 寫遊戲單元代號（整個單元）或「代號-第幾關」（只用那一關） */
window.BOOK = {
  subject: 'science', grade: 4, sem: '上', defaultVersion: 'nani',
  versions: {
    nani: [
      { no: 1, title: '地球的夥伴—日月星辰', levels: ['u1'], bankUnits: ['第 1 單元 地球的夥伴—日月星辰'] },
      { no: 2, title: '水中世界', levels: ['u2'], bankUnits: ['第 2 單元 水中世界'] },
      { no: 3, title: '光和能源', levels: ['u3'], bankUnits: ['第 3 單元 光和能源'] },
      { no: 4, title: '電路好好玩', levels: ['u4'], bankUnits: ['第 4 單元 電路好好玩'] }
    ],
    kang: [
      { no: 1, title: '地表的靜與動', levels: ['lf'], bankUnits: ['地表與地震'] },
      { no: 2, title: '水生生物與環境', levels: ['u2'], bankUnits: ['第 2 單元 水中世界'] },
      { no: 3, title: '有趣的聲光現象', levels: ['sd-1', 'sd-2', 'u3-1', 'u3-2', 'sd-3'], bankUnits: ['聲音的產生與傳播', '第 3 單元 光和能源'] },
      { no: 4, title: '好玩的電路', levels: ['u4'], bankUnits: ['第 4 單元 電路好好玩'] }
    ],
    han: [
      { no: 1, title: '閃亮的天空', levels: ['u1'], bankUnits: ['第 1 單元 地球的夥伴—日月星辰'] },
      { no: 2, title: '水域環境', levels: ['u2'], bankUnits: ['第 2 單元 水中世界'] },
      { no: 3, title: '物質變變變', levels: ['tm', 'ab'], bankUnits: ['溫度與物質的變化', '紫色高麗菜汁與酸鹼'] },
      { no: 4, title: '聲光世界真有趣', levels: ['sd-1', 'sd-2', 'u3-1', 'u3-2', 'sd-3'], bankUnits: ['聲音的產生與傳播', '第 3 單元 光和能源'] }
    ]
  }
};
