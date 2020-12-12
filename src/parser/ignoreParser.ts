import { IParser } from './iParser'
import { map } from './mapParser'

export function ignore<T>(parser: IParser<T>): IParser<null> {
  return map(parser, _ => null)
}
