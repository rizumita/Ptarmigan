import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class DoubleParser<S, T> implements IParser<[S, T]> {
  lhs: IParser<S>
  rhs: IParser<T>

  constructor(lhs: IParser<S>, rhs: IParser<T>) {
    this.lhs = lhs
    this.rhs = rhs
  }

  parse(input: string): ParseResult<[S, T]> {
    try {
      const lResult = this.lhs.parse(input)
      const lValue = lResult.tryValue()
      const rResult = this.rhs.parse(lResult.next)
      const rValue = rResult.tryValue()
      return new ParseSuccess([lValue, rValue], rResult.next)
    } catch (e) {
      if (e instanceof ParseFailure) {
        return e
      } else {
        throw e
      }
    }
  }
}

export function double<S, T>(lps: IParser<S>, rps: IParser<T>): IParser<[S, T]> {
  return new DoubleParser(lps, rps)
}
