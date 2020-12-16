import assert from 'assert'
import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { inWhitespaces } from '../../parser/utilityParsers'
import { DataGeneratable } from './dataGeneratable'
import { Field } from './field'

export class DictionaryFieldType implements DataGeneratable {
  fields: Field[]

  constructor(fields: Field[]) {
    this.fields = fields
  }

  static parser(layer: number): IParser<DictionaryFieldType> {
    assert(layer >= 0)

    const dictStart = P.ignore(P.string('{'))
    const dictEnd = P.ignore(P.string('}'))
    const contents = P.many(inWhitespaces(Field.parser(layer)))
    const type = P.map(P.triple(dictStart, contents, dictEnd), v => v[1])
    return P.map(type, v => new DictionaryFieldType(v))
  }

  get length(): number {
    return Infinity
  }

  data(): { [key: string]: unknown } {
    const data: { [key: string]: unknown } = {}
    this.fields.map(value => value.data).forEach(([key, value]) => (data[key] = value))
    return data
  }
}
