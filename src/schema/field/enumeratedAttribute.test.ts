import { ParseSuccess } from '../../parser/parseResult'
import { EnumeratedAttribute } from './enumeratedAttribute'

describe('EnumeratedAttribute', () => {
  test.each([
    ['(a)', ['a']],
    ['(a|b)', ['a', 'b']],
    ['(a|1)', ['a', 1]],
    ["(a|'2')", ['a', '2']],
  ])('parse', (input, value) =>
    expect(EnumeratedAttribute.parser.parse(input)).toStrictEqual(new ParseSuccess(new EnumeratedAttribute(value), ''))
  )
})
