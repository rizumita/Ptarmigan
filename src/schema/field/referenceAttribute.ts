import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { DataGeneratable } from './dataGeneratable'

export class ReferenceAttribute implements DataGeneratable {
  path: string[]

  constructor(pathString: string) {
    this.path = pathString.split('/').filter(value => value.length >= 1)
  }

  static get parser(): IParser<ReferenceAttribute> {
    return P.map<string, ReferenceAttribute>(
      P.map(P.double(P.ignore(P.string('@')), P.match(/[/\w]+/)), v => v[1]),
      v => new ReferenceAttribute(v)
    )
  }

  get length(): number {
    return 1
  }

  data(): unknown {
    return null
  }
}
