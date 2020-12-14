import assert from 'assert'
import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { wrapWSs } from '../../parser/utilityParsers'
import { ArrayAttribute } from './arrayAttribute'
import { Field } from './field'

export class DictionaryFieldType {
  fields: Field[]
  arrayAttribute: ArrayAttribute | null

  constructor(fields: Field[], arrayAttribute: ArrayAttribute | null = null) {
    this.fields = fields
    this.arrayAttribute = arrayAttribute
  }

  static parser(layer: number): IParser<DictionaryFieldType> {
    assert(layer >= 0)

    const dictStart = P.ignore(P.string('{'))
    const dictEnd = P.ignore(P.string('}'))
    const contents = P.many(wrapWSs(Field.parser(layer)))
    const type = P.map(P.triple(dictStart, contents, dictEnd), v => v[1])
    return P.map(P.double(type, P.option(ArrayAttribute.parser)), v => new DictionaryFieldType(v[0], v[1]))
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
