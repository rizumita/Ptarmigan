import { ParseSuccess } from '../../parser/parseResult'
import { ArrayAttribute } from './arrayAttribute'

describe('ArrayAttribute', () => {
  test.each([
    ['[]', 0],
    ['[0]', 0],
    ['[100]', 100],
  ])('parse number or null', (input, value) =>
    expect(ArrayAttribute.parser.parse(input)).toStrictEqual(new ParseSuccess(new ArrayAttribute(value), ''))
  )

  test.each([['[-1]']])("can't parse negative value", input =>
    expect(() => ArrayAttribute.parser.parse(input)).toThrow('')
  )
})
