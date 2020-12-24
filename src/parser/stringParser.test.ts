import { ParseFailure, ParseSuccess } from './parseResult'
import { StringParser } from './stringParser'

describe('StringParser', () => {
  test.each([
    ['', '', ''],
    ['test', 'test', ''],
    ['test', 'test and…', ' and…'],
  ])('parse succeeded', (literal, input, next) =>
    expect(new StringParser(literal).parse(input)).toStrictEqual(new ParseSuccess(literal, next))
  )

  test.each([['test', 'aaa', 'expect: test']])('parse failed', (literal, input, message) =>
    expect(new StringParser(literal).parse(input)).toStrictEqual(new ParseFailure<string>(message, input))
  )
})
