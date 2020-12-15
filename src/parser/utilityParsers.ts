import * as P from './parser'
import { IParser } from './parser'

export const space = P.string(' ')
export const spaces = P.many(space)
export const endOfLine = P.or([P.string('\n'), P.end()])
export const whitespaces = P.many(P.or([space, endOfLine]))
export const word = P.match(/[\w.]+/)
export const equal = P.string('=')
export const sentence = P.match(/[\w ]+/)
export const name = P.match(/[\w]+/)

export const inCurlyBraces = <T>(parser: IParser<T>): IParser<T> => inContent(P.string('{'), parser, P.string('}'))
export const inBrackets = <T>(parser: IParser<T>): IParser<T> => inContent(P.string('['), parser, P.string(']'))
export const inParentheses = <T>(parser: IParser<T>): IParser<T> => inContent(P.string('('), parser, P.string(')'))
export const inWhitespaces = <T>(parser: IParser<T>): IParser<T> => inContent(whitespaces, parser, whitespaces)

export function inContent<S, T, U>(start: IParser<S>, content: IParser<T>, end: IParser<U>): IParser<T> {
  return P.map(P.triple(start, content, end), v => v[1])
}

export function wrapWSs<S>(parser: IParser<S>): IParser<S> {
  const tripled = P.triple(P.option(P.ignore(whitespaces)), parser, P.option(P.ignore(whitespaces)))
  return P.unwrap(P.map(tripled, v => v.filter((v): v is S => v != null)))
}
