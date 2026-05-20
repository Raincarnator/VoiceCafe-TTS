import { NoOpStatsService } from './stats-service.js';
import { KVStatsService } from './kv-stats-service.js';
import { D1StatsService } from './d1-stats-service.js';

/**
 * 创建统计服务实例
 * @param {object} env - Cloudflare Workers 环境变量
 * @returns {StatsService} 统计服务实例
 */
export function createStatsService(env) {
    const statsType = env.STATS_TYPE || 'none';

    switch (statsType.toLowerCase()) {
        case 'kv':
            if (env.STATS_KV) {
                return new KVStatsService(env.STATS_KV);
            }
            console.warn('STATS_TYPE is "kv" but STATS_KV namespace not found, using NoOp');
            return new NoOpStatsService();

        case 'd1':
            if (env.STATS_DB) {
                return new D1StatsService(env.STATS_DB);
            }
            console.warn('STATS_TYPE is "d1" but STATS_DB database not found, using NoOp');
            return new NoOpStatsService();

        case 'none':
        default:
            return new NoOpStatsService();
    }
}
