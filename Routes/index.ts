export const ROUTES = {
  DASHBOARD: { HOME: "/dashboard", STUDY_TOPIC: "/dashboard/study-topic" },
  LOG_IN: (redirectUrl?: string) => {
    if (redirectUrl) {
      return `/login?redirect=${redirectUrl}`;
    }
    return `/login`;
  },
  REGISTRATION: "/",
} as const;
