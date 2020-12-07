import { TypedValue } from '../parser/typedParser'

export class Constant implements TypedValue {
  key: string
  value: string

  constructor(value: string[]) {
    this.key = value[1]
    this.value = value[2]
  }
}
