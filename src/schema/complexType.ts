import { TypedValue } from '../parser/typedParser'
import { ValueType } from './valueType'
import { Property } from './property'

export class ComplexType implements TypedValue {
  typeName: string
  properties: Property[]

  constructor(value: any[]) {
    this.typeName = value[1]

    if (value.length > 2 && value[2] instanceof Array) {
      this.properties = value[2].map((v) => new Property(v))
    } else {
      this.properties = []
    }
  }
}
