import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'
import { toStringOrNumber } from './parserUtility'

export class RegExpParser implements IParser<string> {
  regexp: RegExp

  constructor(source: string) {
    const pattern = source == '^' ? source : '^' + source
    this.regexp = new RegExp(pattern)
  }

  parse(input: string): ParseResult<string> {
    const execArray = this.regexp.exec(input)

    if (execArray != null && execArray.length > 0) {
      const value = execArray[0]
      return new ParseSuccess(value, input.substring(value.length))
    } else {
      return new ParseFailure('/' + this.regexp.source + '/ is not match', input)
    }
  }
}

export function match(regex: RegExp): IParser<string> {
  return new RegExpParser(regex.source)
}
