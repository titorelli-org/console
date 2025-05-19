export type OperationStatusShape = {
  ok: boolean;
  result?: any;
  error?: unknown;
};

export class OperationStatus implements OperationStatusShape {
  public result?: any;
  public error?: unknown;

  public static ok(): OperationStatus;
  public static ok(result: any): OperationStatus;
  public static ok(maybeResult?: any) {
    return new OperationStatus(true, maybeResult);
  }

  public static fail(): OperationStatus;
  public static fail(error: unknown): OperationStatus;
  public static fail(maybeError?: unknown) {
    return new OperationStatus(false, maybeError);
  }

  public static async invoke<Result, Args extends unknown[]>(
    run: (...args: Args) => Promise<Result>,
    ...args: Args
  ): Promise<OperationStatus> {
    try {
      const result = await run(...args);

      return OperationStatus.ok(result);
    } catch (error) {
      return OperationStatus.fail(error);
    }
  }

  public static bind<Result, Args extends unknown[]>(
    run: (...args: Args) => Promise<Result>,
  ) {
    return (...args: Args) => OperationStatus.invoke(run, ...args);
  }

  public static matchShape(o: object): o is OperationStatusShape {
    return "ok" in o && (o.ok ? "result" in o : "error" in o);
  }

  public static from({ ok, result, error }: OperationStatusShape) {
    return ok
      ? new OperationStatus(ok, result)
      : new OperationStatus(ok, error);
  }

  constructor(ok: true);
  constructor(ok: true, result: any);
  constructor(ok: false);
  constructor(ok: false, error: unknown);
  constructor(
    public ok: boolean = true,
    errorOrResult?: any | unknown,
  ) {
    Object.assign(
      this,
      ok ? { result: errorOrResult } : { error: errorOrResult },
    );
  }

  toJSON() {
    return {
      ok: this.ok,
      result: this.result,
      error: this.error,
    };
  }

  toError() {
    return new Error("OperationStatusError", { cause: this.error });
  }
}
