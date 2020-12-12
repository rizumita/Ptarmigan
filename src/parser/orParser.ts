import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export class OrParser<T> implements IParser<T> {
  psArray: IParser<unknown>[]

  constructor(psArray: IParser<unknown>[]) {
    this.psArray = psArray
  }

  parse(input: string): ParseResult<T> {
    for (const p of this.psArray) {
      const result = p.parse(input)
      try {
        const value = result.tryValue() as T
        return new ParseSuccess(value, result.next)
        // eslint-disable-next-line no-empty
      } catch {}
    }

    return new ParseFailure(this.psArray + ' are not matched', input)
  }
}

export function or<T = unknown>(psArray: IParser<unknown>[]): IParser<T> {
  return new OrParser<T>(psArray)
}
