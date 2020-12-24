import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class ContainerParser<T> implements IParser<string> {
  parser: IParser<T>

  constructor(parser: IParser<T>) {
    this.parser = parser
  }

  parse(input: string): ParseResult<string> {
    try {
      const result = this.parser.parse(input)
      const _ = result.tryValue()
      const value = input.substring(0, input.length - result.next.length)
      return new ParseSuccess(value, result.next)
    } catch (e) {
      if (e instanceof ParseFailure) return e
      throw e
    }
  }
}

export function container<T>(parser: IParser<T>): IParser<string> {
  return new ContainerParser(parser)
}
