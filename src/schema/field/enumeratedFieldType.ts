import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { inParentheses, inWhitespaces } from '../../parser/utilityParsers'
import { DataGeneratable } from './dataGeneratable'
import { parseFieldType } from './fieldTypeFunctions'

export class EnumeratedFieldType implements DataGeneratable {
  type: string
  values: string[]
  private index = 0

  constructor(type: string, values: string[] = []) {
    this.type = type
    this.values = values
  }

  get length(): number {
    return this.values.length
  }

  data(): unknown {
    if (this.values.length == 0) return null

    if (this.index >= this.length) {
      this.index = 0
    }
    const i = this.index
    this.index++

    return parseFieldType(this.values[i], this.type)
  }

  static get parser(): IParser<EnumeratedFieldType> {
    const type = P.map(P.double(P.match(/\w+/), inWhitespaces(P.option(P.string('%')))), v => v[0])
    return P.map(P.double(type, this.valueParser), v => new EnumeratedFieldType(v[0], v[1]))
  }

  static get valueParser(): IParser<string[]> {
    const value = inParentheses(P.match(/(?:[^()\\]|\\.)*/))
    return P.map(value, v => v.split('|').filter(value => value.length > 0))
  }
}
