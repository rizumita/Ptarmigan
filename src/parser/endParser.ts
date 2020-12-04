import { Parser } from './parser'
import { ParseFailuer, ParseResult, ParseSuccess } from './parseResult'

export class EndParser implements Parser<any> {
  public constructor() {}

  parse(input: string): ParseResult<string> {
    if (input == '') {
      return new ParseSuccess(null, input)
    } else {
      return new ParseFailuer('expected: end, actual: ' + input, input)
    }
  }
}

export function end() {
  return new EndParser()
}
