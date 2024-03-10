export const ROUTES = {
  LOG_IN: (redirectUrl?: string) => {
    if (redirectUrl) {
      return `/login?redirect=${redirectUrl}`;
    }
    return `/login`;
  },
  REGISTRATION: "/",
  DASHBOARD: {
    HOME: "/dashboard",
    STUDY_TOPIC: "/dashboard/study-topic",
    SCHEDULES: "/dashboard/schedules",
  },
} as const;
