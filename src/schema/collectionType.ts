import { TypedValue } from '../parser/typedParser'
import { DocumentType } from './documentType'

export class CollectionType implements TypedValue {
  path: string
  documents: DocumentType[]

  constructor(value: any[]) {
    this.path = value[0]
    const data: any[] = value[1] ?? []
    this.documents = data.filter((v) => v instanceof DocumentType)
  }
}
