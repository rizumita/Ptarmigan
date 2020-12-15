import assert from 'assert'
import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { wrapWSs } from '../../parser/utilityParsers'
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
    const contents = P.many(wrapWSs(Field.parser(layer)))
    const type = P.map(P.triple(dictStart, contents, dictEnd), v => v[1])
    return P.map(type, v => new DictionaryFieldType(v))
  }

  get length(): number {
    return Infinity
  }

  data(): { [key: string]: unknown } {
    const data: { [key: string]: unknown } = {}

    for (const field of this.fields) {
      data[field.name] = field.data
    }

    return data
  }
}

// setFakeTo(doc: { [id: string]: any }): void {
//   const dict: { [key: string]: unknown } = {}
//
// for (const valueType of this.valueTypes) {
//   dict[valueType.name] = valueType.valueType.getFake()
// }
//
// doc[this.name] = dict
// }
