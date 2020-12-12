import assert from 'assert'
import { IParser } from '../../parser/iParser'
import { spaces } from '../../parser/utilityParsers'
import { DictionaryFieldType } from './dictionaryFieldType'
import { ValueFieldType } from './valueFieldType'
import * as P from '../../parser/parser'

export class Field {
  name: string
  type: ValueFieldType | DictionaryFieldType

  constructor(name: string, type: ValueFieldType | DictionaryFieldType) {
    this.name = name
    this.type = type
  }

  static parser(layer: number): IParser<Field> {
    assert(layer >= 0)

    const separator = P.ignore(P.triple(P.option(spaces), P.string(':'), P.option(spaces)))
    const namePart = P.map(P.double(P.match(/\w+/), separator), v => v[0])
    const typeParser =
      layer == 0
        ? ValueFieldType.parser
        : P.or<ValueFieldType | DictionaryFieldType>([ValueFieldType.parser, DictionaryFieldType.parser(layer - 1)])
    return P.map<[string, ValueFieldType | DictionaryFieldType], Field>(
      P.double(namePart, typeParser),
      v => new Field(v[0], v[1])
    )
  }
}
