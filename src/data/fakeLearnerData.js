export const fakeLearnerData = {
  user: {
    name: "Aniket Sharma",
    role: "Learner",
    engagementScore: 85,
    focusStreak: 5,
    lastSession: {
      date: "2023-10-01",
      duration: 120, // in minutes
      emotions: ["Focused", "Confused"],
    },
  },
  focusMetrics: {
    hoursFocused: 15,
    goal: 20,
    peakFocusHours: [
      { hour: "10 AM", duration: 120 },
      { hour: "2 PM", duration: 90 },
    ],
  },
  appUsage: {
    categories: {
      socialMedia: 30,
      coursePlatforms: 40,
      videoLectures: 20,
      productivityApps: 10,
    },
  },
  contentAnalysis: {
    struggleZones: [
      { timestamp: "00:15:00", reason: "Paused for clarification" },
      { timestamp: "01:05:00", reason: "Rewatched section" },
    ],
    connectedCourses: [
      { title: "Math 101", completionRate: 70 },
      { title: "History 202", completionRate: 60 },
    ],
  },
  resourceEffectiveness: {
    retentionRates: {
      video: 70,
      article: 60,
      quiz: 80,
    },
  },
};