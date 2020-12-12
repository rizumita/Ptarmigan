import { IParser } from './iParser'
import { map } from './mapParser'

export function flatten<T, D extends number = 1>(parser: IParser<T[]>, depth?: D): IParser<FlatArray<T[], D>[]> {
  return map<T[], FlatArray<T[], D>[]>(parser, v => v.flat(depth))
}
