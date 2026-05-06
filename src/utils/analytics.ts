/**
 * Lightweight local analytics system for Reverie.
 * Handles game metrics, player behavior, and preparation for external integration.
 */

export interface AnalyticsData {
  sessionsStarted: number;
  gamesCompleted: number;
  totalScore: number;
  totalRerolls: number;
  cardUsage: Record<string, number>;
  lastEvent: string;
  dropOffPoints: Record<string, number>; // e.g., { "decision": 5, "drawing": 2 }
}

const STORAGE_KEY = "reverie_analytics_v1";

const INITIAL_DATA: AnalyticsData = {
  sessionsStarted: 0,
  gamesCompleted: 0,
  totalScore: 0,
  totalRerolls: 0,
  cardUsage: {},
  lastEvent: "",
  dropOffPoints: {}
};

class AnalyticsManager {
  private data: AnalyticsData;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.data = saved ? JSON.parse(saved) : { ...INITIAL_DATA };
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  /**
   * Tracks a generic event
   */
  track(event: string, metadata?: any) {
    console.info(`[Analytics] ${event}`, metadata);
    this.data.lastEvent = event;

    switch (event) {
      case "session_start":
        this.data.sessionsStarted++;
        break;
      case "game_complete":
        this.data.gamesCompleted++;
        if (metadata?.score) this.data.totalScore += metadata.score;
        if (metadata?.cards) {
          metadata.cards.forEach((c: any) => {
            this.data.cardUsage[c.type] = (this.data.cardUsage[c.type] ?? 0) + 1;
          });
        }
        break;
      case "reroll":
        this.data.totalRerolls++;
        break;
      case "drop_off":
        if (metadata?.phase) {
          this.data.dropOffPoints[metadata.phase] = (this.data.dropOffPoints[metadata.phase] ?? 0) + 1;
        }
        break;
    }

    this.save();
    
    // Future: Integration with external analytics (Firebase, Mixpanel, etc.)
    // if (EXTERNAL_ENABLED) external.push(event, metadata);
  }

  /**
   * Returns aggregated metrics
   */
  getMetrics() {
    return {
      ...this.data,
      averageScore: this.data.gamesCompleted > 0 ? Math.round(this.data.totalScore / this.data.gamesCompleted) : 0,
      rerollFrequency: this.data.gamesCompleted > 0 ? (this.data.totalRerolls / this.data.gamesCompleted).toFixed(2) : 0,
    };
  }

  reset() {
    this.data = { ...INITIAL_DATA };
    this.save();
  }
}

export const analytics = new AnalyticsManager();
