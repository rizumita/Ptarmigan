import { dict, emptyableWord, inCurlyBraces, inParenthesis } from './utilityParsers'
import { ParseSuccess } from '../parser/parseResult'
import * as P from '../parser/parser'

describe('Utility parsers', () => {
  test.each([
    ['()', ''],
    ['(1)', 1]
  ])('inParenthesis', (input, value) =>
    expect(inParenthesis(emptyableWord).parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    ['{}', ''],
    ['{ }', ''],
    ['{1}', 1]
  ])('inCurlyBraces', (input, value) =>
    expect(inCurlyBraces(emptyableWord).parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    ['{{}}', ''],
    ['{ {} }', ''],
    ['{ { 1 } }', 1]
  ])('inCurlyBraces double', (input, value) =>
    expect(inCurlyBraces(inCurlyBraces(emptyableWord)).parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    ['{}', '{}'],
    ['{{}}', '{{}}'],
    ['{ { 1 } }', '{ { 1 } }']
  ])('dict', (input, value) => expect(dict().parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
