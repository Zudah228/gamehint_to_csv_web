/**
 *
 */
export class FormState<T> {
  constructor(public value: T | undefined) {}

  error: string | undefined;

  get hasError(): boolean {
    return this.error !== undefined;
  }
}
