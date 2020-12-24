import * as P from './parser'
import { ParseResult } from './parseResult'

export interface IParser<T> {
  parse(input: string): ParseResult<T>
}

export const log = <T>(parser: IParser<unknown>): IParser<T> => {
  return P.map(parser, v => {
    console.log(v)
    return v as T
  })
}
