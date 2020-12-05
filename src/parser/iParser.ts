import { ParseResult } from './parseResult'

export interface IParser<T> {
  parse(input: string): ParseResult<T>
}
