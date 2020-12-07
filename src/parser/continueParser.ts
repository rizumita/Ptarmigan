import { parse } from 'path'
import { IParser } from './parser'
import { ParseResult, ParseSuccess } from './parseResult'

export class ContinueParser implements IParser<any> {
  parser: IParser<any>

  constructor(parser: IParser<any>) {
    this.parser = parser
  }

  parse(input: string): ParseResult<Array<any>> {
    let next = input
    const values = new Array<any>()
    while (true) {
      const previous = next
      const result = this.parser.parse(next)
      if (result instanceof ParseSuccess) {
        if (result.value != null) values.push(result.value)
        next = result.next
      } else {
        return new ParseSuccess(values, previous)
      }
    }
  }
}

export function many(parser: IParser<any>) {
  return new ContinueParser(parser)
}
