import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'
import { toStringOrNumber } from './parserUtility'
import { OnigRegExp, OnigScanner } from 'oniguruma'

export class RegExpParser implements IParser<string> {
  regexp: OnigRegExp

  constructor(source: string) {
    const pattern = source == '^' ? source : '^' + source
    this.regexp = new OnigRegExp(pattern)
  }

  parse(input: string): ParseResult<any> {
    const searchArray = this.regexp.searchSync(input)

    if (searchArray != null && searchArray.length > 0) {
      const value = input.substring(searchArray[0].start, searchArray[0].end)
      return new ParseSuccess(toStringOrNumber(value), input.substring(searchArray[0].length))
    } else {
      return new ParseFailure('/' + this.regexp.source + '/ is not match', input)
    }
  }
}

export function match(source: string) {
  return new RegExpParser(source)
}

export function matchRegex(regex: RegExp) {
  return new RegExpParser(regex.source)
}
