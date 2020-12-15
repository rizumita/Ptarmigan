import * as P from '../parser/parser'
import { IParser } from '../parser/iParser'
import { spaces } from '../parser/utilityParsers'

export class Constant {
  key: string
  value: string

  constructor(key: string, value: string) {
    this.key = '$' + key
    this.value = value
  }

  static get parser(): IParser<Constant> {
    const constKey = P.string('const')
    const name = P.map(P.triple(constKey, spaces, P.match(/[\w]+/)), v => v[2])
    const separator = P.triple(spaces, P.string('='), spaces)
    const value = P.map(P.double(separator, P.match(/[\w]+/)), v => v[1])
    return P.map<[string, string], Constant>(P.double(name, value), v => new Constant(v[0], v[1]))
  }
}
