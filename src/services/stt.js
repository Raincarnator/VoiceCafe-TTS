import { SILICONFLOW_API_URL, SILICONFLOW_MODEL, ALLOWED_AUDIO_TYPES, MAX_AUDIO_FILE_SIZE } from '../config/constants.js';
import { makeCORSHeaders } from '../utils/cors.js';

// 验证音频文件格式
export function validateAudioFile(audioFile) {
    // 验证音频文件
    if (!audioFile) {
        return {
            valid: false,
            error: {
                message: "未找到音频文件",
                type: "invalid_request_error",
                param: "file",
                code: "missing_file"
            }
        };
    }

    // 验证文件大小
    if (audioFile.size > MAX_AUDIO_FILE_SIZE) {
        return {
            valid: false,
            error: {
                message: "音频文件大小不能超过10MB",
                type: "invalid_request_error",
                param: "file",
                code: "file_too_large"
            }
        };
    }

    // 验证音频文件格式
    const isValidType = ALLOWED_AUDIO_TYPES.some(type =>
        audioFile.type.includes(type) ||
        audioFile.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|aac|ogg|webm|amr|3gp)$/i)
    );

    if (!isValidType) {
        return {
            valid: false,
            error: {
                message: "不支持的音频文件格式，请上传mp3、wav、m4a、flac、aac、ogg、webm、amr或3gp格式的文件",
                type: "invalid_request_error",
                param: "file",
                code: "invalid_file_type"
            }
        };
    }

    return { valid: true };
}

// 语音转录服务
export async function transcribeAudio(audioFile, customToken = null, env = null) {
    try {
        // 优先使用用户提供的token，其次使用环境变量，最后提示错误
        const token = customToken || (env && env.SILICONFLOW_API_KEY);

        if (!token) {
            return {
                success: false,
                error: {
                    message: "未配置 API Token，请在环境变量中设置 SILICONFLOW_API_KEY 或提供自定义 Token",
                    type: "invalid_request_error",
                    param: "token",
                    code: "missing_api_key"
                },
                status: 401
            };
        }

        // 构建发送到硅基流动API的FormData
        const apiFormData = new FormData();
        apiFormData.append('file', audioFile);
        apiFormData.append('model', SILICONFLOW_MODEL);

        // 发送请求到硅基流动API
        const apiResponse = await fetch(SILICONFLOW_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: apiFormData
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('硅基流动API错误:', apiResponse.status, errorText);

            let errorMessage = '语音转录服务暂时不可用';

            if (apiResponse.status === 401) {
                errorMessage = 'API Token无效，请检查您的配置';
            } else if (apiResponse.status === 429) {
                errorMessage = '请求过于频繁，请稍后再试';
            } else if (apiResponse.status === 413) {
                errorMessage = '音频文件太大，请选择较小的文件';
            }

            return {
                success: false,
                error: {
                    message: errorMessage,
                    type: "api_error",
                    param: null,
                    code: "transcription_api_error"
                },
                status: apiResponse.status
            };
        }

        // 获取转录结果
        const transcriptionResult = await apiResponse.json();

        return {
            success: true,
            data: transcriptionResult
        };

    } catch (error) {
        console.error("语音转录处理失败:", error);
        return {
            success: false,
            error: {
                message: "语音转录处理失败",
                type: "api_error",
                param: null,
                code: "transcription_processing_error"
            },
            status: 500
        };
    }
}
