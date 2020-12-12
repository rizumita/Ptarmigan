import { IParser } from '../../parser/iParser'
import { isNotNull } from '../../parser/parser'
import * as P from '../../parser/parser'
import { InvalidSchemaError } from '../invalidSchemaError'

export class ReferenceAttribute {
  path: string[]

  constructor(pathString: string) {
    const path = pathString.split('/').filter(value => value.length >= 1)
    if (path.length % 2 != 0) throw new InvalidSchemaError('ReferenceAttribute needs document reference: ' + pathString)
    this.path = path
  }

  static get parser(): IParser<ReferenceAttribute> {
    return P.map<string, ReferenceAttribute>(
      P.map(P.double(P.ignore(P.string('@')), P.match(/[/\w]+/)), v => v[1]),
      v => new ReferenceAttribute(v)
    )
  }
}
