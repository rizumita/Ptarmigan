import { IParser } from './parser'
import { ParseResult, ParseSuccess } from './parseResult'

export class ContinueParser<T> implements IParser<T[]> {
  parser: IParser<T>

  constructor(parser: IParser<T>) {
    this.parser = parser
  }

  parse(input: string): ParseResult<T[]> {
    let previous = input
    let next = input
    const values = new Array<T>()

    do {
      previous = next
      const result = this.parser.parse(next)

      if (result instanceof ParseSuccess) {
        if (result.value != null) values.push(result.value)
        next = result.next
      } else {
        break
      }
    } while (previous != next)

    return new ParseSuccess(values, next)
  }
}

export function many<T>(parser: IParser<T>): IParser<T[]> {
  return new ContinueParser(parser)
}
