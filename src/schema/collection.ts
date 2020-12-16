import assert from 'assert'
import * as P from '../parser/parser'
import { IParser } from '../parser/iParser'
import { inCurlyBraces, inWhitespaces, spaces } from '../parser/utilityParsers'
import { Document } from './document'
import { DocumentId } from './documentId'
import { AutoIncrementAttribute } from './field/autoIncrementAttribute'

export class Collection {
  path: string
  documentId: DocumentId
  documents: Document[]

  constructor(path: string, documentId: DocumentId | null, documents: Document[]) {
    this.path = path
    this.documentId = documentId ?? new DocumentId(new AutoIncrementAttribute(1))
    this.documents = documents
  }

  static parser(layer: number): IParser<Collection> {
    assert(layer >= 0)

    const name = P.map(P.triple(P.string('collection'), spaces, P.match(/\w+/)), v => v[2])
    const content = P.map(
      P.double(spaces, inCurlyBraces(P.many(inWhitespaces(P.or([DocumentId.parser, Document.parser(layer)]))))),
      v => v[1]
    )
    return P.map(
      P.double(name, content),
      v =>
        new Collection(
          v[0],
          v[1].find((value): value is DocumentId => value instanceof DocumentId) ?? null,
          v[1].filter((value): value is Document => value instanceof Document)
        )
    )
  }
}
