import { IParser } from './iParser'
import { map } from './mapParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class OptionParser<T> implements IParser<T | null> {
  ps: IParser<T>

  constructor(ps: IParser<T>) {
    this.ps = ps
  }

  parse(input: string): ParseResult<T | null> {
    try {
      const result = this.ps.parse(input)
      const value = result.tryValue()
      return new ParseSuccess(value, result.next)
    } catch (e) {
      if (e instanceof ParseFailure) return new ParseSuccess(null, input)
      throw e
    }
  }
}

export function option<T>(parser: IParser<T>): IParser<T | null> {
  return new OptionParser(parser)
}
