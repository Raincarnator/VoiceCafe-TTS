import { makeCORSHeaders } from '../utils/cors.js';

// 增加统计计数
export async function incrementStats(statsService, type, count = 1) {
    await statsService.increment(type, count);
}

// 获取统计数据
export async function getStats(statsService) {
    const result = await statsService.getStats();
    return result.data || { error: result.error };
}

// 检查统计是否启用
export function isStatsEnabled(statsService) {
    return statsService.isEnabled();
}

// 处理统计数据请求
export async function handleStatsRequest(statsService) {
    if (!statsService.isEnabled()) {
        return new Response(JSON.stringify({
            error: 'Statistics not enabled'
        }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
                ...makeCORSHeaders()
            }
        });
    }

    const result = await statsService.getStats();

    if (result.error) {
        return new Response(JSON.stringify({
            error: result.error
        }), {
            status: 503,
            headers: {
                'Content-Type': 'application/json',
                ...makeCORSHeaders()
            }
        });
    }

    return new Response(JSON.stringify(result.data), {
        headers: {
            'Content-Type': 'application/json',
            ...makeCORSHeaders()
        },
        status: 200
    });
}
