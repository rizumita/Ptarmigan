import { parse } from 'path'
import { Parser } from './parser'
import { ParseResult, ParseSuccess } from './parseResult'

export class ContinueParser implements Parser<any> {
  parser: Parser<any>

  constructor(parser: Parser<any>) {
    this.parser = parser
  }

  parse(input: string): ParseResult<Array<any>> {
    var next = input
    const values = new Array<any>()
    while (true) {
      const previous = next
      const result = this.parser.parse(next)
      if (result instanceof ParseSuccess) {
        values.push(result.value)
        next = result.next
      } else {
        return new ParseSuccess(values, previous)
      }
    }
  }
}

export function many(parser: Parser<any>) {
  return new ContinueParser(parser)
}
