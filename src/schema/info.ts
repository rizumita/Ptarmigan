import { isNotNull } from '../parser/filterParser'
import * as P from '../parser/parser'
import { IParser } from '../parser/iParser'
import { name, sentence, spaces } from '../parser/utilityParsers'

export class Info {
  key: string
  value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }

  static get parser(): IParser<Info> {
    const infoKey = P.string('info')
    const keyPart = P.map(
      P.seq([P.ignore(infoKey), P.ignore(spaces), name, P.ignore(spaces)]),
      v => v.find((value): value is string => typeof value === 'string') ?? ''
    )
    const contentPart = P.map(
      P.seq([P.ignore(P.string('=')), P.ignore(spaces), sentence]),
      v => v.find((value): value is string => typeof value === 'string') ?? ''
    )

    return P.map<[string, string], Info>(P.double(keyPart, contentPart), v => new Info(v[0], v[1]))
  }
}
