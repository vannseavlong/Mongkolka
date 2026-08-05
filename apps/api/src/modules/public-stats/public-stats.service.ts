import { StatsService } from "../stats/stats.service.js";

export const PublicStatsService = {
  list() {
    return StatsService.list(true);
  },
};
