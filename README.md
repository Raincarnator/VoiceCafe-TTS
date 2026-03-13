# 🎙️ VoiceCraft - AI驱动的语音处理平台

一个功能强大的AI语音处理平台，集成了文字转语音(TTS)和语音转文字(STT)双向功能。基于Microsoft Edge TTS和硅基流动API，支持20+种语音选项，为用户提供完整的语音处理解决方案。
>
> 直接使用: https://tts.wangwangit.com

<img width="2512" height="1284" alt="image" src="https://github.com/user-attachments/assets/570961ef-b189-480f-833e-7877ce38f19d" />


## ✨ 特性

### 🎯 核心功能
- 🗣️ **文字转语音(TTS)** - 基于Microsoft Edge TTS，支持20+种中文语音
- 🎧 **语音转文字(STT)** - 集成硅基流动API，高精度语音识别
- 🔄 **双向处理** - 智能模式切换，语音与文字无缝转换
- 🌍 **多语言支持** - 支持中文、英文、日文、韩文、西班牙文、法文、德文、俄文

### 🎨 用户体验
- ⚡ **秒速生成** - 快速生成高质量语音文件和转录文本
- 🆓 **完全免费** - 无需注册，无使用限制
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎛️ **丰富参数** - 支持语速、音调、语音风格等多种调节
- 📥 **支持下载** - 生成的音频可直接下载为 MP3 格式
- 📋 **便捷操作** - 转录结果可复制、编辑，支持转为语音功能

### 🔧 技术特性
- 🔗 **API 兼容** - 兼容 OpenAI TTS API 格式
- 🎵 **多音频格式** - 支持mp3、wav、m4a、flac、aac等9种音频格式
- 🔐 **灵活配置** - 支持默认Token和自定义Token配置
- 🎨 **现代化UI** - 优雅的卡片式设计，直观的模式切换

## 🚀 一键部署

### 点击按钮，一键部署到 CloudFlare Workers,

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/wangwangit/tts)



## 🎯 使用方法

### 🌐 网页界面使用

#### 文字转语音模式
1. 访问部署后的 Worker 域名
2. 确保当前为"文字转语音"模式（默认模式）
3. 选择输入方式：手动输入或上传txt文件
4. 在文本框中输入要转换的文字，或上传txt文件
5. 选择喜欢的语音、语速、音调、语音风格等参数
6. 点击"开始生成语音"按钮
7. 播放生成的音频或下载 MP3 文件

#### 语音转文字模式
1. 点击页面顶部的"语音转文字"按钮切换模式
2. 上传音频文件（支持mp3、wav、m4a等9种格式，最大10MB）
3. 选择Token配置：使用默认Token或输入自定义硅基流动Token
4. 点击"开始语音转录"按钮
5. 查看转录结果，支持复制、编辑或直接转为语音

#### 🌍 多语言切换
- 点击右上角的语言切换器
- 支持中文、English、日本語、한국어、Español、Français、Deutsch、Русский
- 自动记住用户的语言偏好

### 🔌 API 调用

#### 文字转语音 API

```javascript
// JavaScript 调用示例
const response = await fetch('https://your-worker.workers.dev/v1/audio/speech', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        input: "你好，这是一个测试",
        voice: "zh-CN-XiaoxiaoNeural",
        speed: 1.0,
        pitch: "0",
        style: "general"
    })
});

const audioBlob = await response.blob();
```

```bash
# cURL 调用示例
curl -X POST "https://your-worker.workers.dev/v1/audio/speech" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "你好，这是一个测试",
    "voice": "zh-CN-XiaoxiaoNeural",
    "speed": 1.0,
    "pitch": "0",
    "style": "general"
  }' \
  --output speech.mp3
```

#### 语音转文字 API

```javascript
// JavaScript 调用示例
const formData = new FormData();
formData.append('file', audioFile); // 音频文件
formData.append('token', 'your-siliconflow-token'); // 可选，不提供则使用默认token

const response = await fetch('https://your-worker.workers.dev/v1/audio/transcriptions', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log(result.text); // 转录结果
```

```bash
# cURL 调用示例
curl -X POST "https://your-worker.workers.dev/v1/audio/transcriptions" \
  -F "file=@audio.mp3" \
  -F "token=your-siliconflow-token"
```

## 🎨 支持的语音

### 女声
- `zh-CN-XiaoxiaoNeural` - 晓晓 (温柔)
- `zh-CN-XiaoyiNeural` - 晓伊 (甜美)
- `zh-CN-XiaochenNeural` - 晓辰 (知性)
- `zh-CN-XiaohanNeural` - 晓涵 (优雅)
- `zh-CN-XiaomengNeural` - 晓梦 (梦幻)
- `zh-CN-XiaomoNeural` - 晓墨 (文艺)
- `zh-CN-XiaoqiuNeural` - 晓秋 (成熟)
- `zh-CN-XiaoruiNeural` - 晓睿 (智慧)
- `zh-CN-XiaoshuangNeural` - 晓双 (活泼)
- `zh-CN-XiaoxuanNeural` - 晓萱 (清新)
- `zh-CN-XiaoyanNeural` - 晓颜 (柔美)
- `zh-CN-XiaoyouNeural` - 晓悠 (悠扬)
- `zh-CN-XiaozhenNeural` - 晓甄 (端庄)

### 男声
- `zh-CN-YunxiNeural` - 云希 (清朗)
- `zh-CN-YunyangNeural` - 云扬 (阳光)
- `zh-CN-YunjianNeural` - 云健 (稳重)
- `zh-CN-YunfengNeural` - 云枫 (磁性)
- `zh-CN-YunhaoNeural` - 云皓 (豪迈)
- `zh-CN-YunxiaNeural` - 云夏 (热情)
- `zh-CN-YunyeNeural` - 云野 (野性)
- `zh-CN-YunzeNeural` - 云泽 (深沉)

## ⚙️ API 参数

### 🗣️ 文字转语音 API 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `input` | string | - | 要转换的文本内容（必填） |
| `voice` | string | `zh-CN-XiaoxiaoNeural` | 语音选择 |
| `speed` | number | `1.0` | 语速 (0.5-2.0) |
| `pitch` | string | `"0"` | 音调 (-50 到 50) |
| `style` | string | `"general"` | 语音风格 |
| `volume` | string | `"0"` | 音量调节 |

### 🎧 语音转文字 API 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file` | File | - | 音频文件（必填，支持多种格式） |
| `token` | string | 默认内置 | 硅基流动API Token（可选） |

#### 支持的音频格式
- **文件格式**: mp3, wav, m4a, flac, aac, ogg, webm, amr, 3gp
- **文件大小**: 最大 10MB
- **模型**: FunAudioLLM/SenseVoiceSmall（自动使用）

### 支持的语音风格

- `general` - 通用风格
- `assistant` - 智能助手
- `chat` - 聊天对话
- `customerservice` - 客服专业
- `newscast` - 新闻播报
- `affectionate` - 亲切温暖
- `calm` - 平静舒缓
- `cheerful` - 愉快欢乐
- `gentle` - 温和柔美
- `lyrical` - 抒情诗意
- `serious` - 严肃正式

## 🛠️ 技术架构

### 🔧 核心技术
- **前端**: 现代化 HTML5 + CSS3 + 原生JavaScript
- **后端**: Cloudflare Workers（边缘计算）
- **TTS引擎**: Microsoft Edge TTS（20+种中文语音）
- **STT引擎**: 硅基流动 FunAudioLLM/SenseVoiceSmall
- **国际化**: 内置8种语言支持，自动检测浏览器语言

### 🎨 设计架构
- **设计系统**: CSS变量 + 响应式布局
- **UI框架**: 无依赖，纯原生实现
- **交互设计**: 双向模式切换，直观的用户体验
- **API设计**: RESTful API，兼容OpenAI格式

### 🔒 安全与性能
- **无服务器**: 基于Cloudflare Workers，全球边缘部署
- **数据安全**: 所有处理在边缘完成，无数据存储
- **高可用**: 全球CDN加速，99.9%可用性
- **零配置**: 开箱即用，无需额外配置

## 🎨 设计特色

### 🎯 用户界面
- **双模式设计**: 水平布局的模式切换器，消除界面空白
- **现代化 UI**: 采用简洁的卡片式设计
- **国际化界面**: 8种语言无缝切换，右上角语言选择器
- **响应式布局**: 完美适配各种设备尺寸
- **微交互**: 丰富的悬停效果和动画

### 🎨 视觉体验
- **统一风格**: 新旧功能视觉一致，无违和感
- **智能切换**: 根据模式动态显示相关界面元素
- **无渐变设计**: 使用纯色设计，更加专业
- **可访问性**: 支持键盘导航和屏幕阅读器

## 📱 移动端优化

### 🔄 适配策略
- **模式切换**: 移动端垂直布局，桌面端水平布局
- **触摸友好**: 按钮尺寸针对移动端优化
- **文件上传**: 支持拖拽和点击两种方式
- **性能优化**: 针对移动设备的网络和性能优化

### 📋 功能适配
- **音频上传**: 移动端优化的文件选择界面
- **结果展示**: 移动端友好的转录结果展示
- **语言切换**: 移动端下拉菜单适配

## 🔧 开发

### 本地开发

```bash
# 克隆项目
git clone <your-repo>

# 安装 Wrangler CLI
npm install -g wrangler

# 本地开发
wrangler dev
```

### 项目结构

```
├── index.js          # 主要代码文件
├── README.md         # 项目文档
└── wrangler.toml     # Cloudflare Workers 配置
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🌟 更新日志

### v2.0.0 - 重大更新
- 🎉 **新增语音转文字功能** - 集成硅基流动API，支持高精度语音识别
- 🌍 **多语言国际化** - 支持8种语言，自动检测浏览器语言
- 🎨 **品牌升级** - 更名为VoiceCraft，全新的AI语音处理平台
- 🔄 **双向处理** - 智能模式切换，语音与文字无缝转换
- 📱 **界面优化** - 水平布局的模式切换器，更好的空间利用
- 🔧 **错误修复** - 修复文本包含特殊字符时的XML转义问题

### v1.x.x - 历史版本
- 基础的文字转语音功能
- Microsoft Edge TTS集成
- 响应式设计

## 🙏 致谢

- **Microsoft Edge TTS** - 提供高质量的语音合成服务
- **硅基流动** - 提供先进的语音识别API
- **Cloudflare Workers** - 提供无服务器计算平台
- **开源社区** - 感谢所有贡献者和用户的支持

## 📞 联系我们

关注公众号「一只会飞的旺旺」获取更多 AI 工具和技术分享：

- 🔥 最新 AI 工具推荐和使用教程
- 🚀 前沿技术解析和实战案例  
- 💎 独家资源和工具源码分享
- 💬 技术问题答疑和交流社群

---

**🎙️ VoiceCraft - 让语音处理更智能，让创意更有声音！** 

*从文字到语音，从语音到文字，AI驱动的完整语音处理解决方案。*



