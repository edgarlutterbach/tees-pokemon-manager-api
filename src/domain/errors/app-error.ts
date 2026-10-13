export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  protected constructor(
    message: string,
    statusCode: number,
    details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.details = details;
  }
}
