import { Parser } from './parser'
import { ParseFailuer, ParseResult, ParseSuccess } from './parseResult'

export class OptionParser implements Parser<[any]> {
  ps: Parser<any>

  constructor(ps: Parser<any>) {
    this.ps = ps
  }

  parse(input: string): ParseResult<any> {
    const psresult = this.ps.parse(input)

    if (psresult instanceof ParseSuccess) {
      const value = psresult.value
      return new ParseSuccess<any>(value, psresult.next)
    } else {
      return new ParseSuccess<any>(null, input)
    }
  }
}

export function option(parser: Parser<any>) {
  return new OptionParser(parser)
}
