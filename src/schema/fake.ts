import { TypedValue } from '../parser/typedParser'

export class Fake implements TypedValue {
  fakeNumber: number

  constructor(value: string[]) {
    this.fakeNumber = parseInt(value[1])
  }

  static default(): Fake {
    return new Fake(['Fake', '10'])
  }
}
