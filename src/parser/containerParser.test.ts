import { ParseSuccess } from './parser'
import * as P from './parser'

describe('Parsing by container parser', () => {
  test.each([['{ 1 2 3 }', '{ 1 2 3 }']])('is succeeded',
    (input, value) => expect(P.container(P.seq([P.string('{'), P.string(' 1 2 3 '), P.string('}')])).parse(input))
      .toStrictEqual(new ParseSuccess(value, '')))
})
