import { IParser } from './iParser'
import { ParseFailure, ParseIgnored, ParseResult, ParseSuccess } from './parseResult'

export class OptionParser implements IParser<[any]> {
  ps: IParser<any>

  constructor(ps: IParser<any>) {
    this.ps = ps
  }

  parse(input: string): ParseResult<any> {
    const psresult = this.ps.parse(input)

    if (psresult instanceof ParseSuccess || psresult instanceof ParseIgnored) {
      const value = psresult.value
      return new ParseSuccess<any>(value, psresult.next)
    } else {
      return new ParseSuccess<any>(null, input)
    }
  }
}

export function option(parser: IParser<any>) {
  return new OptionParser(parser)
}
