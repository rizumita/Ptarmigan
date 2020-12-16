import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { inWhitespaces } from '../../parser/utilityParsers'
import { DataGeneratable } from './dataGeneratable'
import { parseFieldType } from './fieldTypeFunctions'

export class FakerFieldType implements DataGeneratable {
  constructor(type: string, value: string, isUnique = false) {
    this.type = type
    this.value = value
    this.isUnique = isUnique
  }

  private readonly type: string
  private readonly value: string
  private readonly isUnique: boolean

  static get parser(): IParser<FakerFieldType> {
    const type = P.map(P.double(P.match(/\w+/), inWhitespaces(P.string('%'))), v => v[0])
    const unique = P.map(P.option(P.string('&unique')), v => v != null)
    return P.map(P.triple(type, this.valueParser, unique), v => new FakerFieldType(v[0], v[1], v[2]))
  }

  static get valueParser(): IParser<string> {
    return P.match(/\w+\.[\w()]+/)
  }

  get length(): number {
    return Infinity
  }

  data(): unknown {
    return parseFieldType(eval(this.code), this.type)
  }

  private get code(): string {
    let f: string

    if (this.value.match(/\(.*\)/)) {
      f = 'faker.' + this.value
    } else {
      if (this.isUnique) {
        f = 'faker.unique(faker.' + this.value + ')'
      } else {
        f = 'faker.' + this.value + '()'
      }
    }
    return `var faker = require('faker');${f};`
  }
}
