import * as faker from 'faker'
import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { AutoIncrementAttribute } from './autoIncrementAttribute'
import { DataGeneratable } from './dataGeneratable'
import { EnumeratedAttribute } from './enumeratedAttribute'
import { FakerAttribute } from './fakerAttribute'
import { ReferenceAttribute } from './referenceAttribute'

export class ValueFieldType implements DataGeneratable {
  type: string
  attribute: FakerAttribute | ReferenceAttribute | AutoIncrementAttribute | EnumeratedAttribute | null

  constructor(
    type: string,
    attribute: FakerAttribute | AutoIncrementAttribute | ReferenceAttribute | EnumeratedAttribute | null = null
  ) {
    this.type = type
    this.attribute = attribute
  }

  static get parser(): IParser<ValueFieldType> {
    const percentContent = P.map(
      P.double(P.string('%'), P.or([FakerAttribute.parser, AutoIncrementAttribute.parser, EnumeratedAttribute.parser])),
      v => v[1]
    )
    return P.map<
      [string, FakerAttribute | AutoIncrementAttribute | ReferenceAttribute | EnumeratedAttribute | null],
      ValueFieldType
    >(
      P.double(P.match(/\w+/), P.option(P.or([percentContent, ReferenceAttribute.parser]))),
      v => new ValueFieldType(v[0], v[1] ?? null)
    )
  }

  get length(): number {
    return this.attribute?.length ?? 0
  }

  data(): string | boolean | number | null {
    const data = this.attribute?.data() ?? null
    if (data == null) {
      return null
    } else {
      if (this.type === 'bool') {
        return Boolean(data)
      } else if (this.type === 'int') {
        return Number(data)
      } else if (this.type === 'timestamp') {
        return String(data)
      } else {
        return String(data)
      }
    }
  }
}
