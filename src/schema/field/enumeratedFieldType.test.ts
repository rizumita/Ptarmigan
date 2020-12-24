import { ParseSuccess } from '../../parser/parseResult'
import { EnumeratedFieldType } from './enumeratedFieldType'

describe('EnumeratedAttribute', () => {
  test.each([
    ['(a)', ['a']],
    ['(a|b)', ['a', 'b']],
    ['(\\(a\\)|b)', ['\\(a\\)', 'b']],
  ])('parse value', (input, value) =>
    expect(EnumeratedFieldType.valueParser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    ['string%(a)', 'string', ['a']],
    ['string%(a|b)', 'string', ['a', 'b']],
    ['int%(1|2)', 'int', ['1', '2']],
    ['string%(a|2)', 'string', ['a', '2']],
  ])('parse', (input, type, value) =>
    expect(EnumeratedFieldType.parser.parse(input)).toStrictEqual(
      new ParseSuccess(new EnumeratedFieldType(type, value), '')
    )
  )

  test.each([
    [new EnumeratedFieldType('string', ['1', '2']), ['1', '2']],
    [new EnumeratedFieldType('int', ['1', '2']), [1, 2]],
    [new EnumeratedFieldType('double', ['1.5', '2']), [1.5, 2.0]],
  ])('data', (fieldType, data) => expect([fieldType.data(), fieldType.data()]).toEqual(data))
})
