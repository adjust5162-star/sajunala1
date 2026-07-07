import type { AuthUserSummary } from "./types";

export function isSignedIn(user: AuthUserSummary | null): user is AuthUserSummary {
  return Boolean(user?.id);
}
