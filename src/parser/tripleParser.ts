import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class TripleParser<S, T, U> implements IParser<[S, T, U]> {
  fhs: IParser<S>
  shs: IParser<T>
  ths: IParser<U>

  constructor(fhs: IParser<S>, shs: IParser<T>, ths: IParser<U>) {
    this.fhs = fhs
    this.shs = shs
    this.ths = ths
  }

  parse(input: string): ParseResult<[S, T, U]> {
    try {
      const fResult = this.fhs.parse(input)
      const value1 = fResult.tryValue()
      const sResult = this.shs.parse(fResult.next)
      const value2 = sResult.tryValue()
      const tResult = this.ths.parse(sResult.next)
      const value3 = tResult.tryValue()
      return new ParseSuccess([value1, value2, value3], tResult.next)
    } catch (e) {
      if (e instanceof ParseFailure) {
        return new ParseFailure(e.next + ' is not match', input)
      } else {
        throw e
      }
    }
  }
}

export function triple<S, T, U>(fps: IParser<S>, sps: IParser<T>, tps: IParser<U>): IParser<[S, T, U]> {
  return new TripleParser(fps, sps, tps)
}
