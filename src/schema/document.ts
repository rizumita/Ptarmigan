import assert from 'assert'
import { IParser } from '../parser/iParser'
import { isNotNull } from '../parser/parser'
import { spaces, wrapWSs } from '../parser/utilityParsers'
import { Collection } from './collection'
import { Field } from './field/field'
import { Generate } from './generate'
import * as P from '../parser/parser'

export class Document {
  name: string
  fields: Field[]
  generates: Generate[]
  collections: Collection[]

  constructor(name: string, value: (Field | Generate | Collection)[]) {
    this.name = name
    this.fields = value.filter((v): v is Field => v instanceof Field)
    this.generates = value.filter((v): v is Generate => v instanceof Generate)
    this.collections = value.filter((v): v is Collection => v instanceof Collection)
  }

  static parser(layer: number): IParser<Document> {
    assert(layer >= 0)

    const dictStart = P.double(P.string('{'), spaces)
    const dictEnd = P.string('}')
    const decl = P.double(P.string('document'), spaces)
    const contentParsers: (IParser<Field> | IParser<Generate> | IParser<Collection>)[] = [
      Field.parser(4),
      Generate.parser,
    ]
    if (layer > 0) contentParsers.push(Collection.parser(layer - 1))

    const namePart = P.map(P.triple(decl, P.match(/\w+/), spaces), v => v[1])
    const sps = P.many(wrapWSs(P.or<Field | Generate | Collection>(contentParsers)))
    const contentsPart = P.map(P.triple(dictStart, sps, dictEnd), v => v[1] ?? [])

    return P.map<[string, (Field | Generate | Collection)[] | null], Document>(
      P.double(namePart, P.option(contentsPart)),
      v => new Document(v[0], v[1] ?? [])
    )
  }
}
