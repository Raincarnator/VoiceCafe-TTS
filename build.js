import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔨 开始构建项目...\n');

// 读取 HTML 模板
console.log('📖 读取 HTML 模板...');
const htmlContent = readFileSync(join(__dirname, 'src/templates/index.html'), 'utf-8');

// 转义反引号和 ${} 以避免模板字符串问题
const escapedHtml = htmlContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

// 生成 html-template.js 文件，支持 Google Analytics 和 statsEnabled 参数
const templateContent = `// HTML 模板导出（自动生成，请勿手动编辑）
export const getHTMLPage = (gaMeasurementId = null, statsEnabled = false) => {
    const gaScript = gaMeasurementId ? \`
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=\${gaMeasurementId}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '\${gaMeasurementId}');
    </script>
    \` : '';

    const statsScript = \`
    <script>
        window.STATS_ENABLED = \${statsEnabled};
    </script>
    \`;

    return \`${escapedHtml}\`.replace('</head>', \`\${gaScript}\${statsScript}</head>\`);
};
`;

writeFileSync(join(__dirname, 'src/templates/html-template.js'), templateContent, 'utf-8');
console.log('✅ HTML 模板已成功嵌入到 html-template.js');

console.log('\n📦 项目构建完成！');
