import { handleOptions } from './src/utils/cors.js';
import { makeCORSHeaders } from './src/utils/cors.js';
import { handleAudioTranscription } from './src/handlers/stt-handler.js';
import { handleTTSJson, handleTTSFileUpload } from './src/handlers/tts-handler.js';
import { handleVoicesRequest, handleLocalesRequest, handleModelsRequest } from './src/handlers/voices-handler.js';
import { handleStatsRequest, incrementStats } from './src/handlers/stats-handler.js';
import { handleTTSSourceRequest } from './src/handlers/tts-source-handler.js';
import { getHTMLPage } from './src/templates/html-template.js';
import { createStatsService } from './src/services/stats-factory.js';

// 主请求处理函数
async function handleRequest(request, env) {
    // 初始化统计服务
    const statsService = createStatsService(env);
    if (request.method === "OPTIONS") {
        return handleOptions(request);
    }

    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    // 返回前端页面
    if (path === "/" || path === "/index.html") {
        // 统计页面访问
        await incrementStats(statsService, 'pageViews', 1);

        // 获取 Google Analytics 测量 ID（如果配置）
        const gaMeasurementId = env.GA_MEASUREMENT_ID || null;

        // 传递统计是否启用的状态
        const statsEnabled = statsService.isEnabled();

        return new Response(getHTMLPage(gaMeasurementId, statsEnabled), {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                ...makeCORSHeaders()
            }
        });
    }

    // 统计数据 API
    if (path === "/v1/stats") {
        return handleStatsRequest(statsService);
    }

    // 语言列表 API
    if (path === "/v1/locales") {
        return await handleLocalesRequest(request);
    }

    // 语音列表 API
    if (path === "/v1/voices") {
        return await handleVoicesRequest(request);
    }

    // OpenAI 格式的 models API
    if (path === "/v1/models") {
        return await handleModelsRequest(request);
    }

    // TTS 源导出 API
    if (path === "/tts.json") {
        return await handleTTSSourceRequest(request, env);
    }

    // 语音转录 API
    if (path === "/v1/audio/transcriptions") {
        try {
            return await handleAudioTranscription(request, env);
        } catch (error) {
            console.error("Audio transcription error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
                    code: "transcription_error"
                }
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }
    }

    // 文字转语音 API
    if (path === "/v1/audio/speech") {
        try {
            const contentType = request.headers.get("content-type") || "";
            let textLength = 0;

            // 处理文件上传
            if (contentType.includes("multipart/form-data")) {
                const formData = await request.formData();
                const file = formData.get('file');
                if (file) {
                    const text = await file.text();
                    textLength = text.length;
                }

                const response = await handleTTSFileUpload(request);

                // 统计 TTS 调用
                if (response.ok) {
                    await incrementStats(statsService, 'ttsCalls', 1);
                    await incrementStats(statsService, 'ttsChars', textLength);
                }

                return response;
            }

            // 处理JSON请求
            const requestBody = await request.json();
            textLength = requestBody.input ? requestBody.input.length : 0;

            const response = await handleTTSJson(requestBody);

            // 统计 TTS 调用
            if (response.ok) {
                await incrementStats(statsService, 'ttsCalls', 1);
                await incrementStats(statsService, 'ttsChars', textLength);
            }

            return response;

        } catch (error) {
            console.error("Error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
                    code: "edge_tts_error"
                }
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }
    }

    // 默认返回 404
    return new Response("Not Found", { status: 404 });
}

// Cloudflare Workers 导出
export default {
    async fetch(request, env, ctx) {
        return handleRequest(request, env);
    }
};
