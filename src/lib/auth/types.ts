export type AuthUiState = "loading" | "signed_out" | "signed_in" | "unavailable";

export type AuthUserSummary = {
  id: string;
  email: string | null;
};
