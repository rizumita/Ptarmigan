import * as faker from 'faker'
import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { DataGeneratable } from './dataGeneratable'

export class AutoIncrementAttribute implements DataGeneratable {
  constructor(value: number | null) {
    this.value = value ?? 1
  }

  value: number
  private _autoIncrementNumber: number | null = null

  get autoIncrementNumber(): number {
    if (this._autoIncrementNumber == null) this._autoIncrementNumber = this.value
    const result = this._autoIncrementNumber
    this._autoIncrementNumber = result + 1
    return result
  }

  static get parser(): IParser<AutoIncrementAttribute> {
    const decl = P.string('{auto')
    const number = P.map<[string, string], string | null>(P.double(P.string(':'), P.match(/\d+/)), v => v[1])
    const end = P.string('}')
    return P.map<[string, string | null, string], AutoIncrementAttribute>(P.triple(decl, P.option(number), end), v => {
      return new AutoIncrementAttribute(v[1] != null ? Number(v[1]) : 1)
    })
  }

  get length(): number {
    return Infinity
  }

  data(): number {
    return this.autoIncrementNumber
  }
}
