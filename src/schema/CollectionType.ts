import { TypedValue } from '../parser/typedParser'
import { DocumentType } from './documentType'

export class CollectionType implements TypedValue {
  path: string
  document: DocumentType

  constructor(value: any[]) {
    this.path = value[1]
    this.document = value[2]
  }
}
