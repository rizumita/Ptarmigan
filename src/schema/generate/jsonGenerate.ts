import assert from 'assert'
import * as P from '../../parser/parser'
import { IParser } from '../../parser/iParser'
import { inBrackets, inWhitespaces, spaces } from '../../parser/utilityParsers'
import { Document } from '../document'
import { DocumentGeneratable } from '../documentGeneratable'
import { Schema } from '../schema'

export class JsonGenerate implements DocumentGeneratable {
  contents: { [key: string]: unknown }[]

  constructor(value: string) {
    this.contents = JSON.parse(value)
  }

  docs(document: Document, schema: Schema): { [key: string]: unknown }[] {
    return this.contents
  }

  static get parser(): IParser<DocumentGeneratable> {
    const content = (layer: number): IParser<unknown> => {
      assert(layer >= 0)
      if (layer == 0) {
        return inBrackets(P.many(inWhitespaces(P.match(/[^\[\]]+]/))))
      } else {
        return inBrackets(P.many(inWhitespaces(P.or([P.match(/[^\[\]]+/), content(layer - 1)]))))
      }
    }

    const decl = P.ignore(P.double(P.string('generate'), spaces))
    const jsonString = P.container(content(4))
    return P.map(P.double(decl, jsonString), v => new JsonGenerate(v[1]))
  }

  get length(): number {
    return this.contents.length
  }
}
