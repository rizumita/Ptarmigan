import { Parser } from './parser'
import { ParseFailuer, ParseResult, ParseSuccess } from './parseResult'

export class TripleParser implements Parser<[any, any, any]> {
  fhs: Parser<any>
  shs: Parser<any>
  ths: Parser<any>

  constructor(fhs: Parser<any>, shs: Parser<any>, ths: Parser<any>) {
    this.fhs = fhs
    this.shs = shs
    this.ths = ths
  }

  parse(input: string): ParseResult<any> {
    const fresult = this.fhs.parse(input)

    if (fresult instanceof ParseSuccess) {
      const value1 = fresult.value
      var next = fresult.next
      const sresult = this.shs.parse(next)

      if (sresult instanceof ParseSuccess) {
        const value2 = sresult.value
        next = sresult.next
        const tresult = this.ths.parse(next)

        if (tresult instanceof ParseSuccess) {
          const value3 = tresult.value
          next = tresult.next
          return new ParseSuccess<[any, any, any]>([value1, value2, value3], next)
        } else {
          return new ParseFailuer<any>(next + ' is not match', input)
        }
      } else {
        return new ParseFailuer<any>(next + ' is not match', input)
      }
    } else {
      return new ParseFailuer<any>((fresult as ParseFailuer<any>).next + ' is not match', input)
    }
  }
}

export function bracket(fps: Parser<any>, sps: Parser<any>, tps: Parser<any>) {
  return new TripleParser(fps, sps, tps)
}
