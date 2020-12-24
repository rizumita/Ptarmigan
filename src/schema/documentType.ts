import { IParser } from '../parser/iParser'
import * as P from '../parser/parser'
import { inCurlyBraces, inWhitespaces } from '../parser/utilityParsers'
import { DocumentId } from './documentId'
import { Field } from './field/field'

export class DocumentType {
  name: string
  id: DocumentId | null
  fields: Field[]

  constructor(name: string, documentId: DocumentId | null, fields: Field[]) {
    this.name = name
    this.id = documentId
    this.fields = fields
  }

  static get parser(): IParser<DocumentType> {
    const name = P.map(P.double(P.string('type'), inWhitespaces(P.match(/[a-zA-Z_$][a-zA-Z\d_$]*/))), v => v[1])
    const id = P.option(inWhitespaces(DocumentId.parser))
    const content = P.map(
      P.double(P.string('='), inWhitespaces(inCurlyBraces(P.many(inWhitespaces(Field.parser(10)))))),
      v => v[1]
    )
    return P.map(P.triple(name, id, content), v => new DocumentType(v[0], v[1], v[2]))
  }
}
