/* 五上自然：三版本單元對照（KGVer）。levels 寫課的 id（LESSONS，例如 'u1a'、'k1a'），星星記在課的 id 上 */
window.BOOK = {
  subject: 'science', grade: 5, sem: '上', defaultVersion: 'nani',
  versions: {
    nani: [
      { no: 1, title: '太陽與光', levels: ['u1a', 'u1b'], bankUnits: ['第 1 單元 太陽與光'] },
      { no: 2, title: '植物世界', levels: ['u2a', 'u2b'], bankUnits: ['第 2 單元 植物世界'] },
      { no: 3, title: '水溶液', levels: ['u3a', 'u3b', 'u3c'], bankUnits: ['第 3 單元 水溶液'] },
      { no: 4, title: '力與運動', levels: ['u4a', 'u4b', 'u4c'], bankUnits: ['第 4 單元 力與運動'] }
    ],
    kang: [
      { no: 1, title: '動物世界', levels: ['k1a', 'k1b'], bankUnits: ['動物世界'] },
      { no: 2, title: '探索聲光世界', levels: ['k2a', 'k2b', 'u1b'], bankUnits: ['聲音與樂器', '光的折射與色光'] },
      { no: 3, title: '神祕的天空', levels: ['u1a', 'k3a', 'k3b'], bankUnits: ['太陽的位置與四季', '太陽系與星空'] },
      { no: 4, title: '燃燒與生鏽', levels: ['k4a', 'k4b', 'k4c'], bankUnits: ['燃燒與生鏽'] }
    ],
    han: [
      { no: 1, title: '太陽的祕密', levels: ['h1a', 'u1a', 'u1b'], bankUnits: ['第 1 單元 太陽與光'] },
      { no: 2, title: '千變萬化的植物', levels: ['h2a', 'u2a', 'u2b', 'h2c'], bankUnits: ['第 2 單元 植物世界'] },
      { no: 3, title: '奇妙的水溶液', levels: ['u3a', 'u3b', 'u3c'], bankUnits: ['第 3 單元 水溶液'] },
      { no: 4, title: '力與運動', levels: ['u4a', 'u4b', 'u4c'], bankUnits: ['第 4 單元 力與運動'] }
    ]
  }
};
