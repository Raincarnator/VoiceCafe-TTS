import { getVoice } from '../services/tts.js';
import { makeCORSHeaders } from '../utils/cors.js';
import { MAX_TEXT_FILE_SIZE, MAX_TEXT_LENGTH, DEFAULT_VOICE, DEFAULT_OUTPUT_FORMAT } from '../config/constants.js';

// 处理 JSON 格式的 TTS 请求
export async function handleTTSJson(requestBody) {
    const {
        input,
        voice = DEFAULT_VOICE,
        speed = '1.0',
        volume = '0',
        pitch = '0',
        style = "general",
        response_format = DEFAULT_OUTPUT_FORMAT
    } = requestBody;

    // 处理参数格式
    let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
    let numVolume = parseInt(String(parseFloat(volume) * 100));
    let numPitch = parseInt(pitch);

    const response = await getVoice(
        input,
        voice,
        rate >= 0 ? `+${rate}%` : `${rate}%`,
        numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
        numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
        style,
        response_format
    );

    return response;
}

// 处理文件上传的 TTS 请求
export async function handleTTSFileUpload(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const voice = formData.get('voice') || DEFAULT_VOICE;
        const speed = formData.get('speed') || '1.0';
        const volume = formData.get('volume') || '0';
        const pitch = formData.get('pitch') || '0';
        const style = formData.get('style') || 'general';
        const response_format = formData.get('response_format') || DEFAULT_OUTPUT_FORMAT;

        // 验证文件
        if (!file) {
            return new Response(JSON.stringify({
                error: {
                    message: "未找到上传的文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "missing_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件类型
        if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
            return new Response(JSON.stringify({
                error: {
                    message: "不支持的文件类型，请上传txt文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "invalid_file_type"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件大小
        if (file.size > MAX_TEXT_FILE_SIZE) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件大小超过限制（最大500KB）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "file_too_large"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 读取文件内容
        const text = await file.text();

        // 验证文本内容
        if (!text.trim()) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件内容为空",
                    type: "invalid_request_error",
                    param: "file",
                    code: "empty_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 文本长度限制
        if (text.length > MAX_TEXT_LENGTH) {
            return new Response(JSON.stringify({
                error: {
                    message: "文本内容过长（最大10000字符）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "text_too_long"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 处理参数格式
        let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
        let numVolume = parseInt(String(parseFloat(volume) * 100));
        let numPitch = parseInt(pitch);

        // 调用TTS服务
        return await getVoice(
            text,
            voice,
            rate >= 0 ? `+${rate}%` : `${rate}%`,
            numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
            numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
            style,
            response_format
        );

    } catch (error) {
        console.error("文件上传处理失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: "文件处理失败",
                type: "api_error",
                param: null,
                code: "file_processing_error"
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
