import * as P from '../parser/parser'
import { IParser } from '../parser/iParser'
import { name, sentence, space, spaces } from '../parser/utilityParsers'

export class Info {
  key: string
  value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }

  static get parser(): IParser<Info> {
    const infoKey = P.double(P.string('info'), spaces)
    const separator = P.triple(spaces, P.string('='), spaces)
    const key = P.map(P.triple(infoKey, name, separator), v => v[1])
    const content = P.match(/.+/)
    return P.map<[string, string], Info>(P.double(key, content), v => new Info(v[0], v[1]))
  }
}
