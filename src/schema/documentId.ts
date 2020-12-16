import { IParser } from '../parser/iParser'
import * as P from '../parser/parser'
import { spaces } from '../parser/utilityParsers'
import { AutoIncrementAttribute } from './field/autoIncrementAttribute'
import { DataGeneratable } from './field/dataGeneratable'
import { EnumeratedAttribute } from './field/enumeratedAttribute'
import { FakerAttribute } from './field/fakerAttribute'

export class DocumentId implements DataGeneratable {
  attribute: DataGeneratable

  constructor(attribute: DataGeneratable) {
    this.attribute = attribute
  }

  static get parser(): IParser<DocumentId> {
    const key = P.double(P.string(':'), spaces)
    const stringValue = P.map(P.match(/[$\w]\w*/), v => new EnumeratedAttribute([v]))
    const value = P.or<DataGeneratable>([
      FakerAttribute.parser,
      AutoIncrementAttribute.parser,
      EnumeratedAttribute.parser,
      stringValue,
    ])
    return P.map(P.double(key, value), v => new DocumentId(v[1]))
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
    return !(this.attribute instanceof FakerAttribute) && value.startsWith('$')
  }
}
