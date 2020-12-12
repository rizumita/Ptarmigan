import { IParser } from './iParser'
import { map } from './mapParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

// export class UnwrapParser implements IParser<unknown> {
//   parser: IParser<unknown[]>
//
//   constructor(parser: IParser<unknown[]>) {
//     this.parser = parser
//   }
//
//   parse(input: string): ParseResult<unknown> {
//     try {
//       const result = this.parser.parse(input)
//       const value = result.tryValue()
//       return new ParseSuccess(value.length == 0 ? null : value.length == 1 ? value[0] : value, result.next)
//     } catch (e) {
//       if (e instanceof ParseFailure) {
//         return e
//       } else {
//         throw e
//       }
//     }
//   }
// }

export function unwrap<T>(parser: IParser<T[]>): IParser<T> {
  return map<T[], T>(parser, v => {
    if (v.length == 1) return v[0]
    throw Error(v.toString() + ' is not able to be unwrapped')
  })
}
