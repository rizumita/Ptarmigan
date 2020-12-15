import * as P from '../../parser/parser'
import { IParser } from '../../parser/iParser'
import { spaces } from '../../parser/utilityParsers'
import { DocumentGeneratable } from '../documentGeneratable'
import { Field } from '../field/field'

export class FakeGenerate implements DocumentGeneratable {
  constructor(count: number) {
    this.length = count
  }

  length: number

  docs(fields: Field[]): { [p: string]: unknown }[] {
    const result: { [key: string]: unknown }[] = []

    for (let i = 0; i < this.length; i++) {
      const data: { [key: string]: unknown } = {}
      fields.forEach(value => Object.entries(value.data).forEach(([key, value]) => (data[key] = value)))
      result.push(data)
    }

    return result
  }

  static get parser(): IParser<DocumentGeneratable> {
    const decl = P.ignore(P.double(P.string('generate'), spaces))
    const num = P.map(P.match(/\d+/), v => Number(v))
    return P.map(P.double(decl, num), v => new FakeGenerate(v[1]))
  }
}
