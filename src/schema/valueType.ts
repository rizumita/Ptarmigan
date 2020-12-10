import { TypedValue } from '../parser/typedParser'

export class ValueType implements TypedValue {
  name: string
  valueType: string
  faker: string | null

  constructor(value: string[]) {
    this.name = value[0]
    this.valueType = value[1]
    this.faker = value[2]
  }
}
