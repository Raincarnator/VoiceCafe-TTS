// Token 刷新时间配置（秒）
export const TOKEN_REFRESH_BEFORE_EXPIRY = 3 * 60;

// 硅基流动 API 配置
export const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/audio/transcriptions';
export const SILICONFLOW_MODEL = 'FunAudioLLM/SenseVoiceSmall';

// 文件大小限制
export const MAX_TEXT_FILE_SIZE = 500 * 1024; // 500KB
export const MAX_AUDIO_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 文本长度限制
export const MAX_TEXT_LENGTH = 10000; // 字符
export const MAX_CHUNK_SIZE = 1500; // 单个文本块的最大长度
export const MAX_CHUNKS = 40; // 最大分块数量

// TTS 配置
export const DEFAULT_VOICE = 'zh-CN-XiaoxiaoNeural';
export const DEFAULT_OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

// 批处理配置
export const BATCH_SIZE = 3; // 每批处理的音频块数量
export const BATCH_DELAY_MS = 800; // 批次间延迟（毫秒）
export const RETRY_DELAY_MS = 500; // 重试延迟（毫秒）
export const MAX_RETRIES = 3; // 最大重试次数

// 支持的音频格式
export const ALLOWED_AUDIO_TYPES = [
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a',
    'audio/flac', 'audio/aac', 'audio/ogg', 'audio/webm',
    'audio/amr', 'audio/3gpp'
];

// 支持的音频文件扩展名
export const ALLOWED_AUDIO_EXTENSIONS = [
    'mp3', 'wav', 'm4a', 'flac', 'aac',
    'ogg', 'webm', 'amr', '3gp'
];
