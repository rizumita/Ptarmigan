import { IParser } from '../parser/iParser'
import * as P from '../parser/parser'
import { spaces } from '../parser/utilityParsers'
import { AutoIncrementFieldType } from './field/autoIncrementFieldType'
import { DataGeneratable } from './field/dataGeneratable'
import { EnumeratedFieldType } from './field/enumeratedFieldType'
import { FakerFieldType } from './field/fakerFieldType'

export class DocumentId implements DataGeneratable {
  attribute: DataGeneratable

  constructor(attribute: DataGeneratable) {
    this.attribute = attribute
  }

  static get parser(): IParser<DocumentId> {
    const raw = P.map(P.match(/^([^/\s]{1,1500})/), v => new EnumeratedFieldType('string', [v]))

    const value = P.or<DataGeneratable>([
      P.map(FakerFieldType.valueParser, v => new FakerFieldType('string', v)),
      P.map(AutoIncrementFieldType.valueParser, v => new AutoIncrementFieldType('string', v != null ? Number(v) : 1)),
      P.map(EnumeratedFieldType.valueParser, v => new EnumeratedFieldType('string', v)),
      raw,
    ])
    return P.map(P.triple(P.string(':'), spaces, value), v => new DocumentId(v[2]))
  }

  get length(): number {
    return this.attribute.length
  }

  data(): string {
    return String(this.attribute.data())
  }

  id(getConstant: (id: string) => string): string {
    const value = this.data()

    if (this.isConstant(value)) {
      return getConstant(value)
    } else {
      return value
    }
  }

  private isConstant(value: string): boolean {
    return !(this.attribute instanceof FakerFieldType) && value.startsWith('$')
  }
}
