export interface AttractionTheme {
  id: string;
  label: string;
  title: string;
  description: string;
  attractionIds: string[];
  tone: 'sand' | 'green' | 'red' | 'blue';
}

export const attractionThemes: AttractionTheme[] = [
  {
    id: 'first-visit',
    label: '第一次来',
    title: '先看最有辨识度的宁夏',
    description: '历史、沙水、山地和湿地各选一处，适合初次建立目的地印象。',
    attractionIds: ['xixiawangling', 'shahu', 'beiwudang', 'shapotou', 'huangyeguda', 'suyukou', 'zhongweijinshadao'],
    tone: 'sand',
  },
  {
    id: 'ancient-traces',
    label: '时间深处',
    title: '从史前遗址走到丝路石窟',
    description: '把水洞沟、西夏陵与须弥山放进一条跨越漫长年代的文化线索。',
    attractionIds: ['shuidonggou', 'xixiawangling', 'xumishan', 'ningxiamuseum'],
    tone: 'red',
  },
  {
    id: 'yellow-river',
    label: '沿黄河走',
    title: '看古渡、峡谷、水利与黄河建筑',
    description: '同在黄河沿线，古渡、峡谷、黄河坛和黄河楼却是完全不同的体验。',
    attractionIds: ['huangshagudu', 'huangyeguda', 'huanghetan', 'zhonghuahuanghelou', 'shapotou'],
    tone: 'blue',
  },
  {
    id: 'easy-day',
    label: '少折腾',
    title: '从城市内的轻量目的地开始',
    description: '优先选择市区或接驳简单的场馆与古建，给抵达日、返程日留出弹性。',
    attractionIds: ['ningxiamuseum', 'gulou-yuhuangge', 'nanguan', 'zhongweigaomiao', 'mingcuihu'],
    tone: 'green',
  },
];

export const getAttractionThemeById = (id?: string) => attractionThemes.find((theme) => theme.id === id);
