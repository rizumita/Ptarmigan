import assert from 'assert'
import { Comment } from '../schema/comment'
import * as P from './parser'
import { IParser } from './parser'

export const space = P.string(' ')
export const spaces = P.many(space)
export const endOfLine = P.or([P.string('\n'), P.end()])
export const whitespaces = P.many(P.or([space, endOfLine, Comment.parser]))
export const word = P.match(/[\w.]+/)
export const sentence = P.match(/[\w ]+/)
export const name = P.match(/[\w]+/)

export const inCurlyBraces = <T>(parser: IParser<T>): IParser<T> => inContent(P.string('{'), parser, P.string('}'))
export const inBrackets = <T>(parser: IParser<T>): IParser<T> => inContent(P.string('['), parser, P.string(']'))
export const inParentheses = <T>(parser: IParser<T>): IParser<T> => inContent(P.string('('), parser, P.string(')'))
export const inWhitespaces = <T>(parser: IParser<T>): IParser<T> => inContent(whitespaces, parser, whitespaces)

export function inContent<S, T, U>(start: IParser<S>, content: IParser<T>, end: IParser<U>): IParser<T> {
  return P.map(P.triple(start, content, end), v => v[1])
}

export const recursive = <S, T, U>(
  start: IParser<S>,
  parser: IParser<T>,
  end: IParser<U>,
  layer: number
): IParser<unknown> => {
  assert(layer >= 0)

  if (layer == 0) {
    return inContent(start, parser, end)
  } else {
    return inContent(start, recursive(start, parser, end, layer - 1), end)
  }
}
