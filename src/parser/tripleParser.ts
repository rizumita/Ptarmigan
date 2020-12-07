import { IParser } from './iParser'
import { ParseFailure, ParseIgnored, ParseResult, ParseSuccess } from './parseResult'

export class TripleParser implements IParser<[any, any, any]> {
  fhs: IParser<any>
  shs: IParser<any>
  ths: IParser<any>

  constructor(fhs: IParser<any>, shs: IParser<any>, ths: IParser<any>) {
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

      if (sresult instanceof ParseSuccess || sresult instanceof ParseIgnored) {
        const value2 = sresult.value
        next = sresult.next
        const tresult = this.ths.parse(next)

        if (tresult instanceof ParseSuccess || tresult instanceof ParseIgnored) {
          const value3 = tresult.value
          next = tresult.next
          const valueArray = [value1, value2, value3].filter((v) => v !== null)
          return new ParseSuccess<any>(valueArray, next)
        } else {
          return new ParseFailure<any>(next + ' is not match', input)
        }
      } else {
        return new ParseFailure<any>(next + ' is not match', input)
      }
    } else {
      return new ParseFailure<any>((fresult as ParseFailure<any>).next + ' is not match', input)
    }
  }
}

export function triple(fps: IParser<any>, sps: IParser<any>, tps: IParser<any>) {
  return new TripleParser(fps, sps, tps)
}
