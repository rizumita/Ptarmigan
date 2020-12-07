import { TypedValue } from '../parser/typedParser'
import { DocumentType } from './documentType'
import { Fake } from './fake'

export class CollectionType implements TypedValue {
  path: string
  fake: Fake
  document: DocumentType

  constructor(value: any[]) {
    this.path = value[1]
    const data: any[] = value[2]
    this.fake = data.find((v): v is Fake => v instanceof Fake) ?? Fake.default()
    this.document = data.find((v): v is DocumentType => v instanceof DocumentType)!
  }
}
