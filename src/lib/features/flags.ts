export const FEATURE_FLAGS = {
  enableClientResultSave: true,
} as const;

export function isClientResultSaveEnabled(): boolean {
  return FEATURE_FLAGS.enableClientResultSave;
}
