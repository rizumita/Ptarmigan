import { TypedValue } from '../parser/typedParser'

export class ValueType implements TypedValue {
  typeName: string
  valueType: string
  faker: string | null

  constructor(value: string[]) {
    this.typeName = value[0]
    this.valueType = value[1]
    this.faker = value[2]
  }
}
