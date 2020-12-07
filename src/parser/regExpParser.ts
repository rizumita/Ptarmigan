import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class RegExpParser implements IParser<string> {
  regexp: RegExp

  constructor(regexp: RegExp) {
    const pattern = regexp.source[0] == '^' ? regexp.source : '^' + regexp.source
    this.regexp = new RegExp(pattern)
  }

  parse(input: string): ParseResult<string> {
    const execArray = this.regexp.exec(input)

    if (execArray != null) {
      const value = execArray[0]
      return new ParseSuccess(value, input.substring(value.length))
    } else {
      return new ParseFailure('/' + this.regexp.source + '/ is not match', input)
    }
  }
}

export function match(regex: RegExp) {
  return new RegExpParser(regex)
}
