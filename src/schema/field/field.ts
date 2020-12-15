import assert from 'assert'
import { IParser } from '../../parser/iParser'
import { spaces } from '../../parser/utilityParsers'
import { ArrayAttribute } from './arrayAttribute'
import { DictionaryFieldType } from './dictionaryFieldType'
import { ValueFieldType } from './valueFieldType'
import * as P from '../../parser/parser'

export class Field {
  name: string
  type: ValueFieldType | DictionaryFieldType
  arrayAttribute: ArrayAttribute | null

  constructor(name: string, type: ValueFieldType | DictionaryFieldType, arrayAttribute: ArrayAttribute | null = null) {
    this.name = name
    this.type = type
    this.arrayAttribute = arrayAttribute
  }

  static parser(layer: number): IParser<Field> {
    assert(layer >= 0)

    const separator = P.ignore(P.triple(P.option(spaces), P.string(':'), P.option(spaces)))
    const namePart = P.map(P.double(P.match(/\w+/), separator), v => v[0])
    const typeParser =
      layer == 0
        ? ValueFieldType.parser
        : P.or<ValueFieldType | DictionaryFieldType>([ValueFieldType.parser, DictionaryFieldType.parser(layer - 1)])

    return P.map<[string, ValueFieldType | DictionaryFieldType, ArrayAttribute | null], Field>(
      P.triple(namePart, typeParser, P.option(ArrayAttribute.parser)),
      v => new Field(v[0], v[1], v[2])
    )
  }

  get data(): unknown {
    if (this.arrayAttribute != null) {
      let length = Math.min(this.type.length, this.arrayAttribute.length == 0 ? Infinity : this.arrayAttribute.length)
      if (length === Infinity) length = 0

      if (this.type instanceof ValueFieldType) {
        const result: (string | number | boolean)[] = []
        for (let i = 0; i < length; i++) {
          result.push(this.type.data())
        }
        return result
      } else {
        const result: { [key: string]: unknown }[] = []
        for (let i = 0; i < length; i++) {
          result.push(this.type.data())
        }
        return result
      }
    } else {
      return this.type.data()
    }
  }
}
