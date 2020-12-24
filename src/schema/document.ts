import assert from 'assert'
import { IParser } from '../parser/iParser'
import { inContent, inCurlyBraces, inWhitespaces, spaces } from '../parser/utilityParsers'
import { Collection } from './collection'
import { DocumentGeneratable } from './documentGeneratable'
import { DocumentId } from './documentId'
import { FakeGenerate } from './generate/fakeGenerate'
import { Field } from './field/field'
import * as P from '../parser/parser'
import { JsonGenerate } from './generate/jsonGenerate'

export class Document {
  name: string
  id: DocumentId | null
  fields: Field[]
  generates: DocumentGeneratable[]
  collections: Collection[]

  constructor(name: string, id: DocumentId | null, value: (Field | DocumentGeneratable | Collection)[]) {
    this.name = name
    this.id = id
    this.fields = value.filter((v): v is Field => v instanceof Field)
    this.generates = value.filter(
      (v): v is DocumentGeneratable => v instanceof FakeGenerate || v instanceof JsonGenerate
    )
    this.collections = value.filter((v): v is Collection => v instanceof Collection)
  }

  static parser(layer: number): IParser<Document> {
    assert(layer >= 0)

    const decl = P.double(P.string('document'), spaces)
    const contentParsers: (IParser<Field> | IParser<DocumentGeneratable> | IParser<Collection>)[] = [
      Field.parser(4),
      FakeGenerate.parser,
      JsonGenerate.parser,
    ]
    if (layer > 0) contentParsers.push(Collection.parser(layer - 1))

    const name = inContent(decl, P.match(/\w+/), spaces)
    const id = inWhitespaces(P.option(DocumentId.parser))
    const content = inCurlyBraces<(Field | DocumentGeneratable | Collection)[]>(
      inWhitespaces(P.many(inWhitespaces(P.or(contentParsers))))
    )

    return P.map(P.triple(name, id, P.option(content)), v => new Document(v[0], v[1], v[2] ?? []))
  }
}
