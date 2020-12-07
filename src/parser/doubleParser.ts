import { IParser } from './iParser'
import { ParseFailure, ParseIgnored, ParseResult, ParseSuccess } from './parseResult'

export class DoubleParser implements IParser<any> {
  lhs: IParser<any>
  rhs: IParser<any>

  constructor(lhs: IParser<any>, rhs: IParser<any>) {
    this.lhs = lhs
    this.rhs = rhs
  }

  parse(input: string): ParseResult<any> {
    const lresult: ParseResult<any> = this.lhs.parse(input)

    if (lresult instanceof ParseSuccess || lresult instanceof ParseIgnored) {
      const value1 = lresult.value
      var next = lresult.next
      const rresult = this.rhs.parse(next)

      if (rresult instanceof ParseSuccess || rresult instanceof ParseIgnored) {
        const value2 = rresult.value
        return new ParseSuccess<any[]>(
          [value1, value2].filter((v) => v !== null),
          rresult.next
        )
      } else if (rresult instanceof ParseFailure) {
        return new ParseFailure<any>(next + ' is not match', rresult.message)
      } else {
        return new ParseFailure<any>(next + ' is not match', input)
      }
    } else {
      return new ParseFailure<any>(
        (lresult as ParseFailure<any>).next + 'is not match',
        (lresult as ParseFailure<any>).next
      )
    }
  }
}

export function double(lps: IParser<any>, rps: IParser<any>) {
  return new DoubleParser(lps, rps)
}
