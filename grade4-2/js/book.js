/* 四下自然：三版本單元對照（KGVer）。levels 寫遊戲單元代號（整個單元）或「代號-第幾關」（只用那一關） */
window.BOOK = {
  subject: 'science', grade: 4, sem: '下', defaultVersion: 'nani',
  versions: {
    nani: [
      { no: 1, title: '生活中有趣的力', levels: ['u1'], bankUnits: ['第 1 單元 生活中有趣的力'] },
      { no: 2, title: '昆蟲家族', levels: ['u2'], bankUnits: ['第 2 單元 昆蟲家族'] },
      { no: 3, title: '水的移動', levels: ['u3'], bankUnits: ['第 3 單元 水的移動'] },
      { no: 4, title: '了解臺灣的環境', levels: ['u4'], bankUnits: ['第 4 單元 了解臺灣的環境'] }
    ],
    kang: [
      { no: 1, title: '白天和夜晚的天空', levels: ['sm'], bankUnits: ['太陽、月亮與月相'] },
      { no: 2, title: '水的移動', levels: ['u3'], bankUnits: ['第 3 單元 水的移動'] },
      { no: 3, title: '昆蟲大解密', levels: ['u2'], bankUnits: ['第 2 單元 昆蟲家族'] },
      { no: 4, title: '自然資源與利用', levels: ['en', 'rs'], bankUnits: ['能量與能源', '自然資源與保護'] }
    ],
    han: [
      { no: 1, title: '生活中的力', levels: ['u1-1', 'u1-2', 'pt'], bankUnits: ['第 1 單元 生活中有趣的力', '力的傳送'] },
      { no: 2, title: '水的奇妙現象', levels: ['u3-2', 'u3-3'], bankUnits: ['第 3 單元 水的移動'] },
      { no: 3, title: '變動的大地', levels: ['u4'], bankUnits: ['第 4 單元 了解臺灣的環境'] },
      { no: 4, title: '能源與電路', levels: ['en-1', 'ci', 'en-2', 'en-3'], bankUnits: ['能量與能源', '電路'] }
    ]
  }
};
