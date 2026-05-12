export interface MapColors {
  background: string;
  province: {
    fill: string;
    fillHover: string;
    fillSelected: string;
    stroke: string;
    strokeHover: string;
    strokeSelected: string;
  };
  district: {
    fill: string;
    fillHover: string;
    fillSelected: string;
    stroke: string;
  };
  gradient: {
    start: string;
    end: string;
  };
  selectedGradient: {
    start: string;
    end: string;
  };
  districtGradient: {
    start: string;
    end: string;
  };
  text: {
    primary: string;
    shadow: string;
  };
}

export interface MapConfig {
  colors: MapColors;
  viewBox: {
    width: number;
    height: number;
  };
  padding: number;
  fontSize: number;
  animation: {
    duration: number;
  };
}

export const defaultMapColors: MapColors = {
  background: '#F5F2EB',
  province: {
    fill: '#E8DCC8',
    fillHover: '#D4A857',
    fillSelected: '#2D5A4A',
    stroke: '#B89B5D',
    strokeHover: '#2D5A4A',
    strokeSelected: '#1A3A2A',
  },
  district: {
    fill: '#A8D5BA',
    fillHover: '#7CB894',
    fillSelected: '#3D6B5A',
    stroke: '#7CB894',
  },
  gradient: {
    start: '#E8DCC8',
    end: '#C4A35A',
  },
  selectedGradient: {
    start: '#2D5A4A',
    end: '#3D6B5A',
  },
  districtGradient: {
    start: '#A8D5BA',
    end: '#7CB894',
  },
  text: {
    primary: '#1A1A1A',
    shadow: 'rgba(255,255,255,0.9)',
  },
};

export const defaultMapConfig: MapConfig = {
  colors: defaultMapColors,
  viewBox: {
    width: 900,
    height: 1944,
  },
  padding: 40,
  fontSize: 14,
  animation: {
    duration: 300,
  },
};

export interface CityColors {
  fill: string;
  fillHover: string;
  stroke: string;
  strokeHover: string;
}

export interface DistrictColors {
  fill: string;
  fillHover: string;
  stroke: string;
  strokeHover: string;
}

export type CityName = 'yinchuan' | 'shizuishan' | 'wuzhong' | 'guyuan' | 'zhongwei';

export const cityColors: Record<CityName, CityColors> = {
  yinchuan: {
    fill: '#7EB8D9',
    fillHover: '#4A90B8',
    stroke: '#3D7A9E',
    strokeHover: '#2A5A7A',
  },
  shizuishan: {
    fill: '#A8D5BA',
    fillHover: '#7CB894',
    stroke: '#5A9B6E',
    strokeHover: '#3D6B5A',
  },
  wuzhong: {
    fill: '#F5CBA7',
    fillHover: '#E59866',
    stroke: '#C47D4A',
    strokeHover: '#A0522D',
  },
  guyuan: {
    fill: '#D7BDE2',
    fillHover: '#B49CD0',
    stroke: '#9B7BB2',
    strokeHover: '#7A5FA0',
  },
  zhongwei: {
    fill: '#F9DC5C',
    fillHover: '#E8C43D',
    stroke: '#C9A727',
    strokeHover: '#A6881F',
  },
};

const districtColorPalette = [
  { fill: '#FFE4B5', fillHover: '#FFD700', stroke: '#DAA520', strokeHover: '#B8860B' },
  { fill: '#ADD8E6', fillHover: '#87CEEB', stroke: '#4682B4', strokeHover: '#1E90FF' },
  { fill: '#98FB98', fillHover: '#90EE90', stroke: '#228B22', strokeHover: '#006400' },
  { fill: '#DDA0DD', fillHover: '#DA70D6', stroke: '#8B008B', strokeHover: '#4B0082' },
  { fill: '#F0E68C', fillHover: '#EEE8AA', stroke: '#BDB76B', strokeHover: '#8B8B00' },
  { fill: '#E6E6FA', fillHover: '#D8BFD8', stroke: '#9370DB', strokeHover: '#8A2BE2' },
];

export const districtColors: Record<string, DistrictColors> = {
  xingqing: districtColorPalette[0],
  xixia: districtColorPalette[1],
  jinfeng: districtColorPalette[2],
  yongning: districtColorPalette[3],
  helan: districtColorPalette[4],
  lingwu: districtColorPalette[5],
  dawukou: districtColorPalette[0],
  huinong: districtColorPalette[1],
  pingluo: districtColorPalette[2],
  litong: districtColorPalette[3],
  hongshipu: districtColorPalette[4],
  yanchi: districtColorPalette[5],
  tongxin: districtColorPalette[0],
  qingtongxia: districtColorPalette[1],
  yuanzhou: districtColorPalette[2],
  xiji: districtColorPalette[3],
  longde: districtColorPalette[4],
  jingyuan: districtColorPalette[5],
  pengyang: districtColorPalette[0],
  shapotou: districtColorPalette[1],
  zhongning: districtColorPalette[2],
  haiyuan: districtColorPalette[3],
};

export const getDistrictColor = (name: string): DistrictColors => {
  const pinyinMap: Record<string, string> = {
    '兴庆区': 'xingqing',
    '西夏区': 'xixia',
    '金凤区': 'jinfeng',
    '永宁县': 'yongning',
    '贺兰县': 'helan',
    '灵武市': 'lingwu',
    '大武口区': 'dawukou',
    '惠农区': 'huinong',
    '平罗县': 'pingluo',
    '利通区': 'litong',
    '红寺堡区': 'hongshipu',
    '盐池县': 'yanchi',
    '同心县': 'tongxin',
    '青铜峡市': 'qingtongxia',
    '原州区': 'yuanzhou',
    '西吉县': 'xiji',
    '隆德县': 'longde',
    '泾源县': 'jingyuan',
    '彭阳县': 'pengyang',
    '沙坡头区': 'shapotou',
    '中宁县': 'zhongning',
    '海原县': 'haiyuan',
  };
  const key = pinyinMap[name] || name;
  return districtColors[key] || districtColorPalette[0];
};

export type ThemeName = 'default' | 'desert' | 'forest' | 'ocean' | 'sunset';

export interface ThemePreset {
  name: string;
  description: string;
  colors: MapColors;
}

export const themePresets: Record<ThemeName, ThemePreset> = {
  default: {
    name: '塞上江南（默认）',
    description: '沙漠与绿洲交织的宁夏特色',
    colors: {
      background: '#F5F2EB',
      province: {
        fill: '#E8DCC8',
        fillHover: '#D4A857',
        fillSelected: '#2D5A4A',
        stroke: '#B89B5D',
        strokeHover: '#2D5A4A',
        strokeSelected: '#1A3A2A',
      },
      district: {
        fill: '#A8D5BA',
        fillHover: '#7CB894',
        fillSelected: '#3D6B5A',
        stroke: '#7CB894',
      },
      gradient: {
        start: '#E8DCC8',
        end: '#C4A35A',
      },
      selectedGradient: {
        start: '#2D5A4A',
        end: '#3D6B5A',
      },
      districtGradient: {
        start: '#A8D5BA',
        end: '#7CB894',
      },
      text: {
        primary: '#1A1A1A',
        shadow: 'rgba(255,255,255,0.9)',
      },
    },
  },
  desert: {
    name: '金色沙漠',
    description: '浓郁的沙漠色调',
    colors: {
      background: '#FDF6E3',
      province: {
        fill: '#F4D03F',
        fillHover: '#E67E22',
        fillSelected: '#8B4513',
        stroke: '#D4AC0D',
        strokeHover: '#D35400',
        strokeSelected: '#5D3A1A',
      },
      district: {
        fill: '#F5CBA7',
        fillHover: '#E59866',
        fillSelected: '#A04000',
        stroke: '#E59866',
      },
      gradient: {
        start: '#F4D03F',
        end: '#E67E22',
      },
      selectedGradient: {
        start: '#8B4513',
        end: '#A0522D',
      },
      districtGradient: {
        start: '#F5CBA7',
        end: '#E59866',
      },
      text: {
        primary: '#2C2C2C',
        shadow: 'rgba(255,255,255,0.95)',
      },
    },
  },
  forest: {
    name: '森林绿洲',
    description: '清新自然的绿色主题',
    colors: {
      background: '#F0FFF0',
      province: {
        fill: '#90EE90',
        fillHover: '#32CD32',
        fillSelected: '#228B22',
        stroke: '#228B22',
        strokeHover: '#006400',
        strokeSelected: '#004D00',
      },
      district: {
        fill: '#98FB98',
        fillHover: '#3CB371',
        fillSelected: '#2E8B57',
        stroke: '#3CB371',
      },
      gradient: {
        start: '#90EE90',
        end: '#32CD32',
      },
      selectedGradient: {
        start: '#228B22',
        end: '#2E8B57',
      },
      districtGradient: {
        start: '#98FB98',
        end: '#3CB371',
      },
      text: {
        primary: '#1A1A1A',
        shadow: 'rgba(255,255,255,0.9)',
      },
    },
  },
  ocean: {
    name: '蓝色海洋',
    description: '清凉的蓝色调',
    colors: {
      background: '#F0F8FF',
      province: {
        fill: '#87CEEB',
        fillHover: '#00BFFF',
        fillSelected: '#1E90FF',
        stroke: '#4682B4',
        strokeHover: '#0000CD',
        strokeSelected: '#00008B',
      },
      district: {
        fill: '#ADD8E6',
        fillHover: '#87CEFA',
        fillSelected: '#4169E1',
        stroke: '#87CEFA',
      },
      gradient: {
        start: '#87CEEB',
        end: '#00BFFF',
      },
      selectedGradient: {
        start: '#1E90FF',
        end: '#4169E1',
      },
      districtGradient: {
        start: '#ADD8E6',
        end: '#87CEFA',
      },
      text: {
        primary: '#000080',
        shadow: 'rgba(255,255,255,0.95)',
      },
    },
  },
  sunset: {
    name: '夕阳西下',
    description: '温暖的晚霞色调',
    colors: {
      background: '#FFF0F5',
      province: {
        fill: '#FFB6C1',
        fillHover: '#FF69B4',
        fillSelected: '#C71585',
        stroke: '#DB7093',
        strokeHover: '#FF1493',
        strokeSelected: '#8B008B',
      },
      district: {
        fill: '#FFC0CB',
        fillHover: '#FFB6C1',
        fillSelected: '#DB7093',
        stroke: '#FFB6C1',
      },
      gradient: {
        start: '#FFB6C1',
        end: '#FF69B4',
      },
      selectedGradient: {
        start: '#C71585',
        end: '#DB7093',
      },
      districtGradient: {
        start: '#FFC0CB',
        end: '#FFB6C1',
      },
      text: {
        primary: '#4A4A4A',
        shadow: 'rgba(255,255,255,0.95)',
      },
    },
  },
};
