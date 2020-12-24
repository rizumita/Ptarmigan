import { ParseSuccess } from './parseResult'
import { RegExpParser } from './regExpParser'

describe('RegExpParser', () => {
  test.each([
    ['a', 'a', 'a', ''],
    ['ab', 'abc', 'ab', 'c']
  ])('parse succeeded', (regExp, input, value, next) =>
    expect(new RegExpParser(regExp).parse(input)).toStrictEqual(new ParseSuccess(value, next))
  )
})
