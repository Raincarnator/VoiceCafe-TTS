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
 * D1 统计服务实现
 */
export class D1StatsService extends StatsService {
    constructor(d1Database) {
        super();
        this.db = d1Database;
        this.initialized = false;
    }

    /**
     * 初始化数据库表（如果不存在）
     */
    async ensureTables() {
        if (this.initialized || !this.db) {
            return;
        }

        try {
            await this.db.batch([
                this.db.prepare(`
                    CREATE TABLE IF NOT EXISTS daily_stats (
                        date TEXT NOT NULL,
                        type TEXT NOT NULL,
                        count INTEGER NOT NULL DEFAULT 0,
                        PRIMARY KEY (date, type)
                    )
                `),
                this.db.prepare(`
                    CREATE TABLE IF NOT EXISTS total_stats (
                        type TEXT NOT NULL PRIMARY KEY,
                        count INTEGER NOT NULL DEFAULT 0
                    )
                `),
                this.db.prepare(`
                    CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date DESC)
                `)
            ]);
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize D1 tables:', error);
            // 即使初始化失败也标记为已尝试，避免重复尝试
            this.initialized = true;
        }
    }

    /**
     * 清理超过30天的旧数据
     */
    async cleanupOldData() {
        if (!this.db) {
            return;
        }

        try {
            // 计算30天前的日期
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 30);
            const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

            // 删除超过30天的数据
            await this.db.prepare(`
                DELETE FROM daily_stats
                WHERE date < ?
            `).bind(cutoffDateStr).run();
        } catch (error) {
            console.error('D1 cleanup failed:', error);
            // 清理失败不影响主流程
        }
    }

    async increment(type, count = 1) {
        if (!this.db) {
            return { success: false, error: 'D1 database not configured' };
        }

        // 确保表已创建
        await this.ensureTables();

        try {
            const today = getTodayKey();

            // 使用事务更新每日统计和总计统计
            await this.db.batch([
                // 更新或插入每日统计
                this.db.prepare(`
                    INSERT INTO daily_stats (date, type, count)
                    VALUES (?, ?, ?)
                    ON CONFLICT(date, type) DO UPDATE SET count = count + ?
                `).bind(today, type, count, count),

                // 更新或插入总计统计
                this.db.prepare(`
                    INSERT INTO total_stats (type, count)
                    VALUES (?, ?)
                    ON CONFLICT(type) DO UPDATE SET count = count + ?
                `).bind(type, count, count)
            ]);

            // 每次写入时有10%的概率触发清理（避免每次都清理）
            if (Math.random() < 0.1) {
                // 异步清理，不等待结果
                this.cleanupOldData().catch(err => {
                    console.error('Background cleanup failed:', err);
                });
            }

            return { success: true };
        } catch (error) {
            // 捕获速率限制错误，静默失败
            console.error('D1 stats increment failed:', error);
            return { success: false, error: error.message };
        }
    }

    async getStats() {
        if (!this.db) {
            return { error: 'D1 database not configured' };
        }

        // 确保表已创建
        await this.ensureTables();

        try {
            const last30Days = getLast30Days();

            // 获取每日数据
            const dailyData = {
                pageViews: [],
                ttsCalls: [],
                ttsChars: []
            };

            // 查询最近30天的所有数据
            const dailyResults = await this.db.prepare(`
                SELECT date, type, count
                FROM daily_stats
                WHERE date >= ?
                ORDER BY date ASC
            `).bind(last30Days[0]).all();

            // 创建日期-类型映射
            const dataMap = {};
            if (dailyResults.results) {
                for (const row of dailyResults.results) {
                    if (!dataMap[row.date]) {
                        dataMap[row.date] = {};
                    }
                    dataMap[row.date][row.type] = row.count;
                }
            }

            // 填充30天数据，缺失的补0
            for (const day of last30Days) {
                const dayData = dataMap[day] || {};
                dailyData.pageViews.push({
                    date: day,
                    count: dayData.pageViews || 0
                });
                dailyData.ttsCalls.push({
                    date: day,
                    count: dayData.ttsCalls || 0
                });
                dailyData.ttsChars.push({
                    date: day,
                    count: dayData.ttsChars || 0
                });
            }

            // 获取总计数据
            const totalResults = await this.db.prepare(`
                SELECT type, count
                FROM total_stats
            `).all();

            const totalData = {
                pageViews: 0,
                ttsCalls: 0,
                ttsChars: 0
            };

            if (totalResults.results) {
                for (const row of totalResults.results) {
                    totalData[row.type] = row.count;
                }
            }

            return {
                data: {
                    daily: dailyData,
                    total: totalData
                }
            };
        } catch (error) {
            console.error('D1 stats retrieval failed:', error);
            return { error: 'Failed to retrieve statistics' };
        }
    }

    isEnabled() {
        return !!this.db;
    }
}
