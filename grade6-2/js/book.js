/* 六下自然：三版本單元對照（KGVer）。levels 寫遊戲單元代號（整個單元）或「代號-第幾關」（只用那一關） */
window.BOOK = {
  subject: 'science', grade: 6, sem: '下', defaultVersion: 'nani',
  versions: {
    nani: [
      { no: 1, title: '巧妙的施力工具', levels: ['mc'], bankUnits: ['簡單機械'] },
      { no: 2, title: '地球的環境與生態', levels: ['eco'], bankUnits: ['生物與環境'] },
      { no: 3, title: '我們只有一個地球', levels: ['ea'], bankUnits: ['永續地球'] }
    ],
    kang: [
      { no: 1, title: '簡單機械', levels: ['mc'], bankUnits: ['簡單機械'] },
      { no: 2, title: '能量與生活', levels: ['ec', 'en'], bankUnits: ['能量與生活'] },
      { no: 3, title: '地球的生態', levels: ['eco', 'ea-3'], bankUnits: ['生物與環境'] }
    ],
    han: [
      { no: 1, title: '簡單機械', levels: ['mc'], bankUnits: ['簡單機械'] },
      { no: 2, title: '生活中的聲音', levels: ['snd'], bankUnits: ['生活中的聲音'] },
      { no: 3, title: '寰宇永續護地球', levels: ['eco-1', 'ea'], bankUnits: ['永續地球', '生物與環境'] }
    ]
  }
};
