import assert from 'assert'
import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { inCurlyBraces, inWhitespaces } from '../../parser/utilityParsers'
import { DataGeneratable } from './dataGeneratable'
import { Field } from './field'

export class DictionaryFieldType implements DataGeneratable {
  fields: Field[]

  constructor(fields: Field[]) {
    this.fields = fields
  }

  static parser(layer: number): IParser<DictionaryFieldType> {
    assert(layer >= 0)

    const contents = P.many(Field.parser(layer))
    const type = inCurlyBraces(inWhitespaces(contents))
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
