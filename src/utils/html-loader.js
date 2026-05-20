// 由于 Cloudflare Workers 不支持直接导入 HTML 文件
// 我们需要将 HTML 内容作为字符串导出
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const HTML_PAGE = readFileSync(join(__dirname, '../templates/index.html'), 'utf-8');
