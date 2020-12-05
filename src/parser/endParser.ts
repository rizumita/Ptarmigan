import { IParser } from './iParser'
import { ParseFailuer, ParseResult, ParseSuccess } from './parseResult'

export class EndParser implements IParser<any> {
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
