import * as P from './parser'
import { ParseSuccess } from './parser'

describe('Parsing by FlattenParser', () => {
  test.each([
    ['abc', 1, ['a', 'b', 'c', null]],
    ['abcd', 1, ['a', 'b', 'c', ['d']]],
  ])('is succeeded', (input, depth, value) =>
    expect(
      P.flatten(
        P.seq([P.string('a'), P.seq([P.string('b'), P.string('c'), P.option(P.seq([P.string('d')]))])]),
        depth
      ).parse(input)
    ).toStrictEqual(new ParseSuccess(value, ''))
  )
})
