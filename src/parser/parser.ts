import { ParseResult } from './parseResult'

export interface Parser<T> {
  parse(input: string): ParseResult<T>
}
