import assert from 'assert'
import { IParser } from '../../parser/iParser'
import { spaces } from '../../parser/utilityParsers'
import { ArrayAttribute } from './arrayAttribute'
import { DataGeneratable } from './dataGeneratable'
import { DictionaryFieldType } from './dictionaryFieldType'
import { ValueFieldType } from './valueFieldType'
import * as P from '../../parser/parser'

export class Field {
  name: string
  dataGenerator: DataGeneratable

  constructor(name: string, dataGenerator: DataGeneratable) {
    this.name = name
    this.dataGenerator = dataGenerator
  }

  static parser(layer: number): IParser<Field> {
    assert(layer >= 0)

    const separator = P.ignore(P.triple(P.option(spaces), P.string(':'), P.option(spaces)))
    const namePart = P.map(P.double(P.match(/\w+/), separator), v => v[0])
    const typeParser =
      layer == 0
        ? ValueFieldType.parser
        : P.or<ValueFieldType | DictionaryFieldType>([ValueFieldType.parser, DictionaryFieldType.parser(layer - 1)])

    return P.map(P.double(namePart, ArrayAttribute.parser(typeParser)), v => new Field(v[0], v[1]))
  }

  get data(): [string, unknown] {
    return [this.name, this.dataGenerator.data()]
  }
}
