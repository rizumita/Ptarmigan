import { TypedValue } from '../parser/typedParser'
import { ComplexType } from './complexType'
import { CollectionType } from './CollectionType'

export class DocumentType implements TypedValue {
  typeName: any
  collection: CollectionType | undefined

  constructor(value: any[]) {
    this.typeName = value[1]
    this.collection = value[2]
  }
}
