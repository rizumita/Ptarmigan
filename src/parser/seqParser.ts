import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class SeqParser<T> implements IParser<T[]> {
  parsers: IParser<unknown>[]

  constructor(parsers: IParser<unknown>[]) {
    this.parsers = parsers
  }

  parse(input: string): ParseResult<T[]> {
    try {
      let next = input
      const values = Array<T>()

      for (const item of this.parsers) {
        const result = item.parse(next)
        values.push(result.tryValue() as T)
        next = result.next
      }

      return new ParseSuccess(values, next)
    } catch (e) {
      if (e instanceof ParseFailure) return e
      throw e
    }
  }
}

export function seq<T>(parsers: IParser<unknown>[]): IParser<T[]> {
  return new SeqParser<T>(parsers)
}
