export class OperationStatus {
  public static ok() {
    return new OperationStatus(true);
  }

  public static fail() {
    return new OperationStatus(false);
  }

  constructor(private ok: boolean = true) {}

  toJSON() {
    return { ok: this.ok };
  }
}
