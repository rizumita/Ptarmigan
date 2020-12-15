import { IParser } from '../parser/iParser'
import * as P from '../parser/parser'
import { inCurlyBraces, inWhitespaces, spaces } from '../parser/utilityParsers'
import { Field } from './field/field'

export class DocumentType {
  name: string
  fields: Field[]

  constructor(name: string, fields: Field[]) {
    this.name = name
    this.fields = fields
  }

  static get parser(): IParser<DocumentType> {
    const name = P.map(P.triple(P.double(P.string('type'), spaces), P.match(/\w+/), spaces), v => v[1])
    const content = P.map(
      P.triple(P.string('='), spaces, inCurlyBraces(P.many(inWhitespaces(Field.parser(7))))),
      v => v[2]
    )
    return P.map(P.double(name, content), v => new DocumentType(v[0], v[1]))
  }
}
