import * as P from '../parser/parser'
import { IParser } from '../parser/parser'

export const space = P.string(' ')
export const spaces = P.many(space)
export const lineFeed = P.string('\n')
export const whitespaces = P.many(P.or([space, lineFeed]))
export const word = P.matchRegex(/[\w\.]+/)
export const emptyableWord = P.matchRegex(/\w*/)
export const equal = P.string('=')
export const sentence = P.matchRegex(/[\w ]+/)
export const name = P.matchRegex(/[\w]+/)

export function inParenthesis(parser: IParser<any>) {
  const start = P.string('(')
  const end = P.string(')')
  return P.unwrap(P.unwrap(P.seq([P.ignore(start), parser, P.ignore(end)])))
}

export function inCurlyBraces(parser: IParser<any>) {
  const dictStart = P.string('{')
  const dictEnd = P.string('}')
  return P.unwrap(
    P.unwrap(
      P.seq([
        P.ignore(dictStart),
        P.option(P.ignore(whitespaces)),
        parser,
        P.option(P.ignore(whitespaces)),
        P.ignore(dictEnd)
      ])
    )
  )
}

export function dict() {
  return P.match('(?<brace>\\{(?:\\g<brace>|[^\\{\\}])*\\})')
}

export function wrapWSs(parser: IParser<any>) {
  return P.unwrap(P.triple(P.option(P.ignore(whitespaces)), parser, P.option(P.ignore(whitespaces))))
}
