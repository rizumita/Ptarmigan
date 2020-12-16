import assert from 'assert'
import { IParser } from '../parser/iParser'
import { inContent, inCurlyBraces, inWhitespaces, spaces } from '../parser/utilityParsers'
import { Collection } from './collection'
import { DocumentGeneratable } from './documentGeneratable'
import { FakeGenerate } from './generate/fakeGenerate'
import { Field } from './field/field'
import * as P from '../parser/parser'
import { JsonGenerate } from './generate/jsonGenerate'

export class Document {
  name: string
  fields: Field[]
  generates: DocumentGeneratable[]
  collections: Collection[]

  constructor(name: string, value: (Field | DocumentGeneratable | Collection)[]) {
    this.name = name
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
    const content = inCurlyBraces<(Field | DocumentGeneratable | Collection)[]>(
      inWhitespaces(P.many(inWhitespaces(P.or(contentParsers))))
    )

    return P.map(P.double(name, P.option(content)), v => new Document(v[0], v[1] ?? []))
  }
}
