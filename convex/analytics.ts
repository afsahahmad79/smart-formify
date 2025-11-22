// convex/analytics.js
import { query } from "./_generated/server";

export const getSubmissionStats = query(async ({ db }, args) => {
    const submissions = await db.query("forms").collect();
    return {
        overview: {
        totalViews: 0,
        totalSubmissions: 0,
        conversionRate: 0,
        avgCompletionTime: 0,
        viewsChange: 0,
        submissionsChange: 0,
        conversionChange: 0,
        timeChange: 0,
        },
        dailyData: [],
        deviceData: [],
        locationData: [],
        formPerformance: [],
        hourlyData: [],
    };
});

export const getAnalyticsData = query(async ({ db }) => {
  // Use the same logic for now as the other for compatibility
  const submissions = await db.query("forms").collect();
  return {
    overview: {
      totalViews: 0,
      totalSubmissions: 0,
      conversionRate: 0,
      avgCompletionTime: 0,
      viewsChange: 0,
      submissionsChange: 0,
      conversionChange: 0,
      timeChange: 0,
    },
    dailyData: [],
    deviceData: [],
    locationData: [],
    formPerformance: [],
    hourlyData: [],
  };
});