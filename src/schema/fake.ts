import { TypedValue } from '../parser/typedParser'

export class Fake implements TypedValue {
  fakeNumber: number

  constructor(value: number) {
    this.fakeNumber = value
  }

  static default(): Fake {
    return new Fake(10)
  }
}
