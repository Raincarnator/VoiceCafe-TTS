import { voicesData } from '../data/voices-data.js';
import { makeCORSHeaders } from '../utils/cors.js';
import crypto from 'node:crypto';

// 性别翻译映射
const genderTranslations = {
    'zh-CN': { 'Female': '女性', 'Male': '男性' },
    'zh-TW': { 'Female': '女性', 'Male': '男性' },
    'zh-HK': { 'Female': '女性', 'Male': '男性' },
    'yue-CN': { 'Female': '女性', 'Male': '男性' },
    'ja-JP': { 'Female': '女性', 'Male': '男性' },
    'ko-KR': { 'Female': '여성', 'Male': '남성' },
    'es-ES': { 'Female': 'Femenino', 'Male': 'Masculino' },
    'fr-FR': { 'Female': 'Féminin', 'Male': 'Masculin' },
    'de-DE': { 'Female': 'Weiblich', 'Male': 'Männlich' },
    'ru-RU': { 'Female': 'Женский', 'Male': 'Мужской' },
    'en-US': { 'Female': 'Female', 'Male': 'Male' }
};

// 根据语言区域获取性别文本
function getGenderText(gender, locale) {
    // 提取主要语言代码（如 zh-CN-sichuan -> zh-CN）
    const mainLocale = locale.split('-').slice(0, 2).join('-');

    // 查找对应的翻译
    if (genderTranslations[mainLocale]) {
        return genderTranslations[mainLocale][gender] || gender;
    }

    // 默认使用英语
    return genderTranslations['en-US'][gender] || gender;
}

// 从域名生成4位网站代码
function generateSiteCode(hostname) {
    const hash = crypto.createHash('md5').update(hostname).digest('hex');
    const digits = hash.match(/\d/g) || [];

    // 取前4个数字，不足则补0
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += digits[i] || '0';
    }
    return code;
}

// 生成TTS源ID
function generateTTSSourceId(siteCode, localeIndex, voiceIndex) {
    // 格式: 9982 + 4位网站代码 + 2位语言编号 + 3位语音编号
    const localeStr = String(localeIndex).padStart(2, '0');
    const voiceStr = String(voiceIndex).padStart(3, '0');
    return `9982${siteCode}${localeStr}${voiceStr}`;
}

// 处理TTS源导出请求
export async function handleTTSSourceRequest(request, env) {
    const url = new URL(request.url);
    const langParam = url.searchParams.get('lang');
    const hostname = url.hostname;

    // 生成网站代码
    const siteCode = generateSiteCode(hostname);

    // 获取所有语言列表（排序后的）
    const allLocales = Object.keys(voicesData.voices).sort();

    // 确定要导出的语言列表
    let targetLocales = [];

    if (langParam) {
        // 根据lang参数筛选语言
        const langParts = langParam.split('+');
        targetLocales = langParts.filter(locale => voicesData.voices[locale]);
    } else {
        // 如果没有指定语言，导出所有语言
        targetLocales = allLocales;
    }

    // 生成TTS源数据
    const ttsSourceList = [];
    const currentTime = Date.now();

    targetLocales.forEach(locale => {
        const localeIndex = allLocales.indexOf(locale);
        const voices = voicesData.voices[locale] || [];

        voices.forEach((voice, voiceIndex) => {
            const id = generateTTSSourceId(siteCode, localeIndex, voiceIndex);

            // 根据语言区域获取性别翻译
            const genderText = getGenderText(voice.gender, locale);

            const ttsSource = {
                concurrentRate: "0",
                contentType: "audio/mpeg",
                enabledCookieJar: false,
                header: "\"Content-Type\": \"application/json\"",
                id: parseInt(id),
                lastUpdateTime: currentTime,
                name: `${voice.localName}（${genderText}）`,
                url: `https://${hostname}/v1/audio/speech,{\n"method":"POST",\n"body":{"input":"{{speakText}}","voice":"${voice.shortName}","speed":{{speakSpeed/30+0.333}},"pitch":"0","style":"general"}}`
            };

            ttsSourceList.push(ttsSource);
        });
    });

    return new Response(JSON.stringify(ttsSourceList, null, 2), {
        headers: {
            'Content-Type': 'application/json',
            ...makeCORSHeaders()
        }
    });
}
