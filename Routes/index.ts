export const ROUTES = {
  HOME: "/",
  LOG_IN: (redirectUrl?: string) =>
    `/login?redirect=${redirectUrl ? redirectUrl : ""}`,
  REGISTRATION: "/register",
} as const;
