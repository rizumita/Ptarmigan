import { TypedValue } from '../parser/typedParser'

export class Constant implements TypedValue {
  key: string
  value: string

  constructor(value: string[]) {
    this.key = '$' + value[0]
    this.value = value[1]
  }

  static isConstant(value: string) {
    return value.startsWith('$')
  }
}
