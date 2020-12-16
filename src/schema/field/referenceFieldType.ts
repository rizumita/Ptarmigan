import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { DataGeneratable } from './dataGeneratable'

export class ReferenceFieldType implements DataGeneratable {
  path: string[]

  constructor(pathString: string) {
    this.path = pathString.split('/').filter(value => value.length >= 1)
  }

  static get parser(): IParser<ReferenceFieldType> {
    return P.map<string, ReferenceFieldType>(
      P.map(P.double(P.ignore(P.string('ref@')), this.valueParser), v => v[1]),
      v => new ReferenceFieldType(v)
    )
  }

  static get valueParser(): IParser<string> {
    return P.match(/\/[/\w]+/)
  }

  get length(): number {
    return 1
  }

  data(): unknown {
    return null
  }
}
