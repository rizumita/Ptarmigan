import { TypedValue } from '../parser/typedParser'

export class Property implements TypedValue {
  name: string
  valueType: string

  constructor(value: string[]) {
    this.name = value[0]
    this.valueType = value[1]
  }
}
