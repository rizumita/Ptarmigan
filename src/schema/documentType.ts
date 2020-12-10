import { TypedValue } from '../parser/typedParser'
import { CollectionType } from './collectionType'
import { ValueType } from './valueType'
import { Fake } from './fake'
import { Generate } from './generate'

export class DocumentType implements TypedValue {
  valueTypes: ValueType[]
  fake: Fake | null
  generate: Generate | null
  collections: CollectionType[]

  constructor(value: any[]) {
    this.valueTypes = value.filter((v) => v instanceof ValueType)
    this.fake = value.find((v): v is Fake => v instanceof Fake) ?? null
    this.generate = value.find((v): v is Generate => v instanceof Generate) ?? null
    this.collections = value.filter((v) => v instanceof CollectionType)
  }
}
