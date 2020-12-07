import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class EndParser implements IParser<any> {
  public constructor() {}

  parse(input: string): ParseResult<string> {
    if (input == '') {
      return new ParseSuccess(null, input)
    } else {
      return new ParseFailure('expected: end, actual: ' + input, input)
    }
  }
}

export function end() {
  return new EndParser()
}
