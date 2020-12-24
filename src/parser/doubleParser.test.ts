import { ParseSuccess } from './parser'
import * as P from './parser'

describe('Parsing by double parser', () => {
  test.each([['12', ['1', '2'] as [string, string]]])('is succeeded', (input, value) =>
    expect(P.double(P.string('1'), P.string('2')).parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )
})
