export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const emptyState: ActionState = {};
