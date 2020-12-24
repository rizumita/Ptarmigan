import assert from 'assert'
import { IParser } from '../../parser/iParser'
import { inWhitespaces, spaces } from '../../parser/utilityParsers'
import { ArrayAttribute } from './arrayAttribute'
import { AutoIncrementFieldType } from './autoIncrementFieldType'
import { DataGeneratable } from './dataGeneratable'
import { DictionaryFieldType } from './dictionaryFieldType'
import { EnumeratedFieldType } from './enumeratedFieldType'
import { FakerFieldType } from './fakerFieldType'
import { ReferenceFieldType } from './referenceFieldType'
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

    const name = P.map(
      P.triple(P.match(/\s*/), P.match(/\w+/), P.triple(P.match(/\s*/), P.string(':'), P.match(/\s*/))),
      v => v[1]
    )

    const raw = P.map(P.match(/^([^/\s[\]}]+)/), v => new EnumeratedFieldType(v, []))

    const typeCandidates: IParser<DataGeneratable>[] = [
      FakerFieldType.parser,
      AutoIncrementFieldType.parser,
      ReferenceFieldType.parser,
      EnumeratedFieldType.parser,
      raw,
    ]
    if (layer != 0) typeCandidates.splice(0, 0, DictionaryFieldType.parser(layer - 1))
    const type = P.or<DataGeneratable>(typeCandidates)

    return P.map(P.double(name, ArrayAttribute.parser(type)), v => new Field(v[0], v[1]))
  }

  get data(): [string, unknown] {
    return [this.name, this.dataGenerator.data()]
  }
}
