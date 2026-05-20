import { StatsService } from './stats-service.js';

// 获取今天的日期字符串 (YYYY-MM-DD)
function getTodayKey() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// 获取过去30天的日期列表
function getLast30Days() {
    const days = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
}

/**
 * KV 统计服务实现
 */
export class KVStatsService extends StatsService {
    constructor(kvNamespace) {
        super();
        this.kv = kvNamespace;
    }

    async increment(type, count = 1) {
        if (!this.kv) {
            return { success: false, error: 'KV namespace not configured' };
        }

        try {
            const today = getTodayKey();
            const dailyKey = `daily:${today}:${type}`;
            const totalKey = `total:${type}`;

            // 更新今日统计
            const dailyValue = await this.kv.get(dailyKey);
            const dailyCount = dailyValue ? parseInt(dailyValue) : 0;
            await this.kv.put(dailyKey, String(dailyCount + count), {
                expirationTtl: 60 * 60 * 24 * 31 // 31天过期
            });

            // 更新总计统计
            const totalValue = await this.kv.get(totalKey);
            const totalCount = totalValue ? parseInt(totalValue) : 0;
            await this.kv.put(totalKey, String(totalCount + count));

            return { success: true };
        } catch (error) {
            // 捕获速率限制错误，静默失败
            console.error('KV stats increment failed:', error);
            return { success: false, error: error.message };
        }
    }

    async getStats() {
        if (!this.kv) {
            return { error: 'KV namespace not configured' };
        }

        try {
            const last30Days = getLast30Days();

            // 获取每日数据
            const dailyData = {
                pageViews: [],
                ttsCalls: [],
                ttsChars: []
            };

            for (const day of last30Days) {
                const pageViews = await this.kv.get(`daily:${day}:pageViews`);
                const ttsCalls = await this.kv.get(`daily:${day}:ttsCalls`);
                const ttsChars = await this.kv.get(`daily:${day}:ttsChars`);

                // 确保数据不足30天时自动补0
                dailyData.pageViews.push({
                    date: day,
                    count: pageViews ? parseInt(pageViews) : 0
                });
                dailyData.ttsCalls.push({
                    date: day,
                    count: ttsCalls ? parseInt(ttsCalls) : 0
                });
                dailyData.ttsChars.push({
                    date: day,
                    count: ttsChars ? parseInt(ttsChars) : 0
                });
            }

            // 获取总计数据
            const totalPageViews = await this.kv.get('total:pageViews');
            const totalTtsCalls = await this.kv.get('total:ttsCalls');
            const totalTtsChars = await this.kv.get('total:ttsChars');

            return {
                data: {
                    daily: dailyData,
                    total: {
                        pageViews: totalPageViews ? parseInt(totalPageViews) : 0,
                        ttsCalls: totalTtsCalls ? parseInt(totalTtsCalls) : 0,
                        ttsChars: totalTtsChars ? parseInt(totalTtsChars) : 0
                    }
                }
            };
        } catch (error) {
            console.error('KV stats retrieval failed:', error);
            return { error: 'Failed to retrieve statistics' };
        }
    }

    isEnabled() {
        return !!this.kv;
    }
}
