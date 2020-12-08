import { TypedValue } from '../parser/typedParser'
import { DocumentType } from './documentType'
import { Fake } from './fake'
import { Generate } from './generate'

export class CollectionType implements TypedValue {
  path: string
  fake: Fake
  generate: Generate | null
  document: DocumentType

  constructor(value: any[]) {
    this.path = value[0]
    const data: any[] = value[1]
    this.fake = data.find((v): v is Fake => v instanceof Fake) ?? Fake.default()
    this.generate = data.find((v): v is Generate => v instanceof Generate) ?? null
    this.document = data.find((v): v is DocumentType => v instanceof DocumentType)!
  }
}
