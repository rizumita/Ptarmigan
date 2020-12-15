import * as faker from 'faker'
import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { DataGeneratable } from './dataGeneratable'

export class FakerAttribute implements DataGeneratable {
  constructor(value: string) {
    this.value = value
  }

  value: string
  private _autoIncrementNumber = 1

  get autoIncrementNumber(): number {
    const result = this._autoIncrementNumber
    this.autoIncrementNumber = result + 1
    return result
  }

  set autoIncrementNumber(value: number) {
    this._autoIncrementNumber = value
  }

  static get parser(): IParser<FakerAttribute> {
    const decl = P.ignore(P.string('{{'))
    const type = P.match(/[\w.]+/)
    const end = P.string('}}')
    return P.map(P.triple(decl, type, end), v => new FakerAttribute(v[1]))
  }

  get length(): number {
    return Infinity
  }

  data(): string {
    return faker.fake('{{' + this.value + '}}')
  }
}
