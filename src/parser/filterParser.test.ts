import * as P from './parser'
import { ParseSuccess } from './parser'
import { space, spaces } from './utilityParsers'

describe('Parsing by FilterParser', () => {
  test.each([
    ['a', ['a']],
    ['abc', ['a']],
    ['bcd', []],
  ])('is succeeded', (input, value) =>
    expect(P.filter(P.many(P.match(/./)), v => v == 'a').parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([['a']])('is succeeded', input =>
    expect(P.filter(spaces, v => v == 'a').parse(input)).toStrictEqual(new ParseSuccess<string[]>([], input))
  )
})

describe('Parsing using isNotNull', () => {
  test.each([['a ', ['a']]])('is succeeded', (input, value) =>
    expect(P.filter(P.many(P.or([P.match(/\w/), P.ignore(space)])), P.isNotNull).parse(input)).toStrictEqual(
      new ParseSuccess(value, '')
    )
  )
})
