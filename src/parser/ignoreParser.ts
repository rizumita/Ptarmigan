import { IParser } from './iParser'
import { ParseFailuer, ParseResult, ParseSuccess } from './parseResult'

export class IgnoreParser implements IParser<any[]> {
  parser: IParser<any>

  constructor(parser: IParser<any>) {
    this.parser = parser
  }

  parse(input: string): ParseResult<string> {
    const result = this.parser.parse(input)

    if (result instanceof ParseSuccess) {
      return new ParseSuccess(null, result.next)
    }
    return result
  }
}

export function ignore(parser: IParser<any>) {
  return new IgnoreParser(parser)
}
