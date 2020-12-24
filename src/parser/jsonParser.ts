import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class JSONParser implements IParser<JSON> {
  parser: IParser<string>

  constructor(parser: IParser<string>) {
    this.parser = parser
  }

  parse(input: string): ParseResult<JSON> {
    try {
      const result = this.parser.parse(input)
      const value = result.tryValue()
      const json = JSON.parse(value)
      return new ParseSuccess(json, result.next)
    } catch (e) {
      if (e instanceof ParseFailure) return e
      return new ParseFailure(e.message, input)
    }
  }
}

export function json(parser: IParser<string>): IParser<JSON> {
  return new JSONParser(parser)
}
