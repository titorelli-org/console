export class OperationStatus {
  constructor(private ok: boolean = true) { }

  toJSON() {
    return { ok: this.ok }
  }
}
