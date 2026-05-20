// 统计服务抽象接口

/**
 * 统计服务基类
 */
export class StatsService {
    /**
     * 增加统计计数
     * @param {string} type - 统计类型 (pageViews, ttsCalls, ttsChars)
     * @param {number} count - 增加的数量
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async increment(type, count = 1) {
        throw new Error('Method not implemented');
    }

    /**
     * 获取统计数据
     * @returns {Promise<{data?: object, error?: string}>}
     */
    async getStats() {
        throw new Error('Method not implemented');
    }

    /**
     * 检查统计服务是否启用
     * @returns {boolean}
     */
    isEnabled() {
        return false;
    }
}

/**
 * 空操作统计服务（默认，禁用统计）
 */
export class NoOpStatsService extends StatsService {
    async increment(type, count = 1) {
        return { success: true };
    }

    async getStats() {
        return { error: 'Statistics not enabled' };
    }

    isEnabled() {
        return false;
    }
}
