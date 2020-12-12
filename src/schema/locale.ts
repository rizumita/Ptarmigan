import { IParser } from '../parser/iParser'
import { isNotNull } from '../parser/parser'
import * as P from '../parser/parser'
import { spaces } from '../parser/utilityParsers'

export class Locale {
  name: string

  constructor(value: string) {
    this.name = value
  }

  static get parser(): IParser<Locale> {
    const decl = P.seq([P.string('locale'), spaces, P.string('='), spaces])
    return P.map(P.double(decl, P.match(/\w+/)), v => new Locale(v[1]))
  }
}
