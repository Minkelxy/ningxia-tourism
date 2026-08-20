import { collectContentErrors } from './content-check';

interface GroupedError {
  group: string;
  message: string;
}

// 按"文件/slug 归属"分组：能从错误信息中提取标识的归到对应文件/实体，无法归类的放"通用"桶。
const groupError = (error: string): GroupedError => {
  // 手记解析错误：形如 "filename.md: ..."
  let m = error.match(/^([\w-]+\.md):\s*(.+)$/);
  if (m) return { group: `src/content/journal/${m[1]}`, message: m[2] };
  // 图片变体缺失：形如 "id: 缺少本地图片 <path>"，按路径区分景点/手记
  m = error.match(/^([\w-]+):\s*缺少本地图片\s+(.+)$/);
  if (m) {
    const path = m[2];
    const suffix = path.includes('/attractions/') ? ' (景点)' : path.includes('/journal/') ? ' (手记)' : '';
    return { group: `${m[1]}${suffix}`, message: `缺少本地图片 ${path}` };
  }
  // 手记内容校验：形如 "type:slug: ..."
  m = error.match(/^[a-z]+:([\w-]+):\s*(.+)$/);
  if (m) return { group: `${m[1]} (手记)`, message: m[2] };
  // 景点/城市/食物等实体校验：形如 "kebab-id: ..."
  m = error.match(/^([a-z][\w-]*):\s*(.+)$/);
  if (m) return { group: m[1], message: m[2] };
  return { group: '通用', message: error };
};

const main = () => {
  const errors = collectContentErrors();
  if (errors.length === 0) {
    console.log('内容校验通过：未发现内容数据问题。');
    process.exit(0);
  }

  // 保留收集顺序，按出现先后分组。
  const groups = new Map<string, string[]>();
  for (const error of errors) {
    const { group, message } = groupError(error);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(message);
  }

  const lines: string[] = [];
  for (const [group, messages] of groups) {
    lines.push(`✗ ${group}`);
    for (const message of messages) lines.push(`  - ${message}`);
  }
  lines.push('');
  lines.push(`内容校验未通过：共 ${errors.length} 个问题`);
  console.log(lines.join('\n'));
  process.exit(1);
};

main();
