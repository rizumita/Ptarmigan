import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class StringParser implements IParser<string> {
  literal: string

  public constructor(literal: string) {
    this.literal = literal
  }

  getLiteral(): string {
    return this.literal
  }

  parse(input: string): ParseResult<string> {
    if (input.startsWith(this.literal)) {
      return new ParseSuccess(this.literal, input.substring(this.literal.length))
    } else {
      return new ParseFailure('expect: ' + this.literal, input)
    }
  }
}

export function string(literal: string) {
  return new StringParser(literal)
}
