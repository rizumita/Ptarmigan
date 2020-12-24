import { IParser } from './iParser'
import { map } from './mapParser'

export function filter<T>(
  parser: IParser<T[]>,
  predicate: (value: T, index: number, array: T[]) => unknown,
  thisArg?: T
): IParser<T[]> {
  return map(parser, v => v.filter(predicate, thisArg))
}

export const isNotNull = <V>(v: V | null): boolean => v != null
