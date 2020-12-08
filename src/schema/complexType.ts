import { TypedValue } from '../parser/typedParser'
import { ValueType } from './valueType'
import { Property } from './property'

export class ComplexType implements TypedValue {
  typeName: string
  properties: Property[]

  constructor(value: any[]) {
    this.typeName = value[0]

    if (value.length > 1 && value[1] instanceof Array) {
      this.properties = value[1].map((v) => new Property(v))
    } else {
      this.properties = []
    }
  }
}
