import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { InvalidSchemaError } from '../invalidSchemaError'

export class ArrayAttribute {
  length: number

  constructor(count: number) {
    if (count < 0) throw new InvalidSchemaError('ArrayAttribute needs positive number:' + count)

    this.length = count
  }

  static get parser(): IParser<ArrayAttribute> {
    return P.map(
      P.triple(
        P.string('['),
        P.map(P.match(/-?\d*/), v => Number(v)),
        P.string(']')
      ),
      v => new ArrayAttribute(v[1])
    )
  }
}
