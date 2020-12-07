import { TypedValue } from '../parser/typedParser'

export class ValueType implements TypedValue {
  typeName: string
  valueType: string
  faker: string | null

  constructor(value: string[]) {
    this.typeName = value[1]
    this.valueType = value[2]
    this.faker = value[3]
  }
}
