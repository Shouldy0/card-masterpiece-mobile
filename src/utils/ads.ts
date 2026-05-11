/**
 * Mock Ad SDK Integration
 * Provides breakpoints for monetization without interrupting gameplay.
 */

export const ads = {
  /**
   * Simulates showing an interstitial ad.
   * Returns a promise that resolves when the ad is finished/skipped.
   */
  showInterstitial: async (): Promise<void> => {
    return new Promise((resolve) => {
      // In a real scenario, you'd call the SDK here:
      // if (window.gads) window.gads.showInterstitial();

      // Simulate ad delay
      console.log("[ADS] Requesting interstitial ad...");
      setTimeout(() => {
        console.log("[ADS] Ad finished.");
        resolve();
      }, 1500); // Short mock duration for development
    });
  },

  /**
   * Simulates showing a rewarded ad (e.g., for an extra reroll).
   */
  showRewarded: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log("[ADS] Requesting rewarded ad...");
      setTimeout(() => {
        console.log("[ADS] Reward earned.");
        resolve(true);
      }, 2000);
    });
  },
};
