import { IParser } from './iParser'
import { ParseIgnored, ParseResult, ParseSuccess } from './parseResult'

export class UnwrapParser implements IParser<any> {
  parser: IParser<any>

  constructor(parser: IParser<any>) {
    this.parser = parser
  }

  parse(input: string): ParseResult<any> {
    const result = this.parser.parse(input)

    if (result instanceof ParseSuccess) {
      const value = result.value

      if (value instanceof Array) {
        if (value.length == 0) {
          return new ParseIgnored<any>(result.next)
        } else if (value.length == 1) {
          return new ParseSuccess(value[0], result.next)
        } else {
          return new ParseSuccess(
            value.filter((v) => v !== null),
            result.next
          )
        }
      } else if (value == null) {
        return new ParseIgnored<any>(result.next)
      }
    }
    return result
  }
}

export function unwrap(parser: IParser<any>) {
  return new UnwrapParser(parser)
}
