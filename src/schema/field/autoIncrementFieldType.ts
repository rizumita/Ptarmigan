import { randomInt } from 'crypto'
import * as faker from 'faker'
import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { inCurlyBraces, inWhitespaces } from '../../parser/utilityParsers'
import { DataGeneratable } from './dataGeneratable'

export class AutoIncrementFieldType implements DataGeneratable {
  constructor(type: string, value: number | null) {
    this.type = type
    this.value = value ?? 1
  }

  type: string
  value: number
  private _autoIncrementNumber: number | null = null

  get autoIncrementNumber(): number {
    if (this._autoIncrementNumber == null) this._autoIncrementNumber = this.value
    const result = this._autoIncrementNumber
    this._autoIncrementNumber = result + 1
    return result
  }

  static get parser(): IParser<AutoIncrementFieldType> {
    const type = P.map(P.double(P.match(/\w+/), inWhitespaces(P.string('%'))), v => v[0])
    return P.map(P.double(type, this.valueParser), v => {
      return new AutoIncrementFieldType(v[0], v[1] != null ? Number(v[1]) : 1)
    })
  }

  static get valueParser(): IParser<string | null> {
    return P.or([
      P.map(P.triple(P.string('auto'), P.option(P.string(':')), P.option(P.match(/\d+/))), v => v[2]),
      inCurlyBraces(P.map(P.triple(P.string('auto'), P.option(P.string(':')), P.option(P.match(/\d+/))), v => v[2])),
    ])
  }

  get length(): number {
    return Infinity
  }

  data(): number | boolean {
    if (this.type == 'bool' || this.type == 'boolean') {
      return faker.random.boolean()
    } else {
      return this.autoIncrementNumber
    }
  }
}
