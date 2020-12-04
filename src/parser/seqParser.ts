import { Parser } from './parser'
import { ParseFailuer, ParseResult, ParseSuccess } from './parseResult'

export class SeqParser implements Parser<[any, any]> {
  lhs: Parser<any>
  rhs: Parser<any>

  constructor(lhs: Parser<any>, rhs: Parser<any>) {
    this.lhs = lhs
    this.rhs = rhs
  }

  parse(input: string): ParseResult<any> {
    const lresult: ParseResult<any> = this.lhs.parse(input)

    if (lresult instanceof ParseSuccess) {
      const value1 = lresult.value
      var next = lresult.next
      const rresult = this.rhs.parse(next)

      if (rresult instanceof ParseSuccess) {
        const value2 = rresult.value
        return new ParseSuccess<[any, any]>([value1, value2], rresult.next)
      } else if (rresult instanceof ParseFailuer) {
        return new ParseFailuer<any>(next + ' is not match', rresult.message)
      } else {
        return new ParseFailuer<any>(next + ' is not match', input)
      }
    } else {
      return new ParseFailuer<any>(
        (lresult as ParseFailuer<any>).next + 'is not match',
        (lresult as ParseFailuer<any>).message
      )
    }
  }
}

export function seq(lps: Parser<any>, rps: Parser<any>) {
  return new SeqParser(lps, rps)
}
