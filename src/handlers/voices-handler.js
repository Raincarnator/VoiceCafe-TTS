import { voicesData } from '../data/voices-data.js';
import { makeCORSHeaders } from '../utils/cors.js';

// 获取所有语言列表
export function getLocales() {
    const locales = Object.keys(voicesData.voices).sort();
    return {
        locales: locales,
        total: locales.length
    };
}

// 获取指定语言的语音列表
export function getVoicesByLocale(locale) {
    if (!locale) {
        return {
            error: 'locale parameter is required'
        };
    }

    const voices = voicesData.voices[locale];
    if (!voices) {
        return {
            error: `No voices found for locale: ${locale}`
        };
    }

    return {
        locale: locale,
        voices: voices,
        total: voices.length
    };
}

// OpenAI 格式的 ListModels API
export function listModels(locale) {
    const voices = locale ? voicesData.voices[locale] : null;

    if (locale && !voices) {
        return {
            object: 'list',
            data: [],
            error: `No voices found for locale: ${locale}`
        };
    }

    // 如果指定了语言，返回该语言的语音
    if (locale && voices) {
        const models = voices.map(voice => ({
            id: voice.shortName,
            object: 'model',
            created: Math.floor(new Date(voicesData.stats.generatedAt).getTime() / 1000),
            owned_by: 'microsoft',
            permission: [],
            root: voice.shortName,
            parent: null,
            // 额外信息
            locale: voice.locale,
            localName: voice.localName,
            displayName: voice.displayName,
            gender: voice.gender
        }));

        return {
            object: 'list',
            data: models
        };
    }

    // 如果没有指定语言，返回所有语音
    const allModels = [];
    Object.keys(voicesData.voices).forEach(loc => {
        voicesData.voices[loc].forEach(voice => {
            allModels.push({
                id: voice.shortName,
                object: 'model',
                created: Math.floor(new Date(voicesData.stats.generatedAt).getTime() / 1000),
                owned_by: 'microsoft',
                permission: [],
                root: voice.shortName,
                parent: null,
                locale: voice.locale,
                localName: voice.localName,
                displayName: voice.displayName,
                gender: voice.gender
            });
        });
    });

    return {
        object: 'list',
        data: allModels
    };
}

// 处理语音列表请求
export async function handleVoicesRequest(request) {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');

    const result = getVoicesByLocale(locale);

    return new Response(JSON.stringify(result), {
        headers: {
            'Content-Type': 'application/json',
            ...makeCORSHeaders()
        },
        status: result.error ? 400 : 200
    });
}

// 处理语言列表请求
export async function handleLocalesRequest(request) {
    const result = getLocales();

    return new Response(JSON.stringify(result), {
        headers: {
            'Content-Type': 'application/json',
            ...makeCORSHeaders()
        }
    });
}

// 处理 OpenAI 格式的 models 请求
export async function handleModelsRequest(request) {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');

    const result = listModels(locale);

    return new Response(JSON.stringify(result), {
        headers: {
            'Content-Type': 'application/json',
            ...makeCORSHeaders()
        }
    });
}
