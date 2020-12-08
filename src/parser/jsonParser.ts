import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class JSONParser implements IParser<JSON> {
  parser: IParser<string>

  constructor(parser: IParser<string>) {
    this.parser = parser
  }

  parse(input: string): ParseResult<string> {
    const result = this.parser.parse(input)

    if (result instanceof ParseSuccess) {
      try {
        const json = JSON.parse(result.value)
        return new ParseSuccess(json, result.next)
      } catch (e) {
        return new ParseFailure(e.message, result.next)
      }
    } else {
      return result
    }
  }
}

export function json(parser: IParser<string>) {
  return new JSONParser(parser)
}
