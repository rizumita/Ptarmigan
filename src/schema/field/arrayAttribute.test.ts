import { ParseSuccess } from '../../parser/parseResult'
import { ArrayAttribute } from './arrayAttribute'
import { EnumeratedFieldType } from './enumeratedFieldType'
import * as P from '../../parser/parser'

describe('ArrayAttribute', () => {
  test.each([
    ['string[]', 0],
    ['string[0]', 0],
    ['string[100]', 100],
  ])('parse number or null', (input, value) =>
    expect(
      ArrayAttribute.parser(P.map(P.match(/^([^/\s[\]}]+)/), v => new EnumeratedFieldType(v, []))).parse(input)
    ).toStrictEqual(new ParseSuccess(new ArrayAttribute(new EnumeratedFieldType('string'), value), ''))
  )

  test.each([['string[-1]']])("can't parse negative value", input =>
    expect(() =>
      ArrayAttribute.parser(P.map(P.match(/^([^/\s[\]}]+)/), v => new EnumeratedFieldType(v, []))).parse(input)
    ).toThrow('')
  )
})
