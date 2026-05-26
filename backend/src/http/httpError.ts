export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code = "HTTP_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function assertFound<T>(value: T | null | undefined, message: string): T {
  if (!value) throw new HttpError(404, message, "NOT_FOUND");
  return value;
}
