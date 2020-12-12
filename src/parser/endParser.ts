import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class EndParser implements IParser<null> {
  public constructor() {}

  parse(input: string): ParseResult<null> {
    if (input == '') {
      return new ParseSuccess(null, input)
    } else {
      return new ParseFailure('expected: end, actual: ' + input, input)
    }
  }
}

export function end(): IParser<null> {
  return new EndParser()
}
