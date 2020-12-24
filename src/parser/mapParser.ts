import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class MapParser<S, T> implements IParser<T> {
  parser: IParser<S>
  map: (v: S) => T

  constructor(parser: IParser<S>, map: (v: S) => T) {
    this.parser = parser
    this.map = map
  }

  parse(input: string): ParseResult<T> {
    try {
      const result = this.parser.parse(input)
      const value = result.tryValue()
      return new ParseSuccess(this.map(value), result.next)
    } catch (e) {
      if (e instanceof ParseFailure) return e
      throw e
    }
  }
}

export function map<S, T>(parser: IParser<S>, map: (v: S) => T): IParser<T> {
  return new MapParser(parser, map)
}
