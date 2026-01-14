export class AppError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
  }
}

export const normalizeError = (e: unknown): string => {
  if (e instanceof AppError) return e.message;
  if (e instanceof Error) return e.message;
  return "Unknown error";
};
