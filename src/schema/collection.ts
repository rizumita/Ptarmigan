import assert from 'assert'
import { isNotNull } from '../parser/parser'
import * as P from '../parser/parser'
import { IParser } from '../parser/iParser'
import { spaces, wrapWSs } from '../parser/utilityParsers'
import { Document } from './document'

export class Collection {
  path: string
  documents: Document[]

  constructor(path: string, documents: Document[]) {
    this.path = path
    this.documents = documents
  }

  static parser(layer: number): IParser<Collection> {
    assert(layer >= 0)

    const dictStart = P.string('{')
    const dictEnd = P.string('}')

    const decl = P.ignore(P.double(P.string('collection'), spaces))
    const name = P.match(/\w+/)
    const namePart = P.map(P.triple(decl, name, spaces), v => v[1])
    const document = P.map(
      P.triple(P.ignore(dictStart), wrapWSs(P.many(Document.parser(layer))), P.ignore(dictEnd)),
      v => v[1]
    )
    return P.map(P.double(namePart, document), v => new Collection(v[0], v[1]))
  }
}
