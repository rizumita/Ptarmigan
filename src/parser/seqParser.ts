import { IParser } from './iParser'
import { ParseFailure, ParseIgnored, ParseResult, ParseSuccess } from './parseResult'

export class SeqParser implements IParser<any[]> {
  parsers: IParser<any>[]

  constructor(parsers: IParser<any>[]) {
    this.parsers = parsers
  }

  parse(input: string): ParseResult<any[]> {
    let next = input
    let values = Array<any>()

    for (const item of this.parsers) {
      const result = item.parse(next)

      if (result instanceof ParseSuccess || result instanceof ParseIgnored) {
        values.push(result.value)
        next = result.next
      } else {
        return result
      }
    }

    return new ParseSuccess(values, next)
  }
}

export function seq(parsers: IParser<any>[]) {
  return new SeqParser(parsers)
}
