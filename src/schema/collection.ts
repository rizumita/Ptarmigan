import assert from 'assert'
import * as P from '../parser/parser'
import { IParser } from '../parser/iParser'
import { inCurlyBraces, inWhitespaces, spaces } from '../parser/utilityParsers'
import { Document } from './document'
import { DocumentId } from './documentId'

export class Collection {
  path: string
  documents: Document[]

  constructor(path: string, documents: Document[]) {
    this.path = path
    this.documents = documents
  }

  static parser(layer: number): IParser<Collection> {
    assert(layer >= 0)

    const name = P.map(P.triple(P.string('collection'), spaces, P.match(/\w+/)), v => v[2])
    const content = P.map(
      P.double(spaces, inCurlyBraces(inWhitespaces(P.many(inWhitespaces(Document.parser(layer)))))),
      v => v[1]
    )
    return P.map(P.double(name, content), v => new Collection(v[0], v[1]))
  }
}
