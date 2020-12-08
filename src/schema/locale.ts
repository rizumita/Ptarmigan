import { TypedValue } from '../parser/typedParser'

export class Locale implements TypedValue {
  name: string

  constructor(value: string[]) {
    this.name = value[0]
  }
}
