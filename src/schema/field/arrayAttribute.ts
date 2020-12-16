import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { inBrackets } from '../../parser/utilityParsers'
import { InvalidSchemaError } from '../invalidSchemaError'
import { DataGeneratable } from './dataGeneratable'

export class ArrayAttribute implements DataGeneratable {
  dataGenerator: DataGeneratable
  length: number

  constructor(dataGenerator: DataGeneratable, length: number) {
    if (length < 0) throw new InvalidSchemaError('ArrayAttribute needs positive number:' + length)

    this.dataGenerator = dataGenerator
    this.length = length == 0 ? Infinity : length
  }

  data(): unknown[] {
    let length = Math.min(this.dataGenerator.length, this.length)
    if (length === Infinity) length = 0

    const result: unknown[] = []
    for (let i = 0; i < length; i++) {
      result.push(this.dataGenerator.data())
    }
    return result
  }

  static parser<T extends DataGeneratable>(parser: IParser<T>): IParser<DataGeneratable> {
    const double = P.double(parser, P.option(inBrackets(P.map(P.match(/-?\d*/), v => Number(v)))))
    return P.map(double, v => (v[1] == null ? v[0] : new ArrayAttribute(v[0], v[1])))
  }
}
