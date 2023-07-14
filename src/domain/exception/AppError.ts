export type AppErrorName = "challonge" | "invalid" | "unknown";

/**
 * エラー型
 */
export class AppError implements Error {
  constructor({
    name,
    message,
    stack,
    cause,
    details,
  }: {
    name: AppErrorName;
    message: string;
    stack?: string | undefined;
    cause?: Error | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
  }) {
    this.name = name;
    this.message = message;
    this.stack = stack;
    this.cause = cause;
    this.details = details;
  }

  static exception = (): AppError => {
    return new AppError({ name: "unknown", message: "通信状態を確認してください" });
  };

  name: AppErrorName;
  message: string;
  stack?: string | undefined;
  cause?: Error | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}
