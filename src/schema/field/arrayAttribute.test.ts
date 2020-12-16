import { ParseSuccess } from '../../parser/parseResult'
import { ArrayAttribute } from './arrayAttribute'
import { ValueFieldType } from './valueFieldType'

describe('ArrayAttribute', () => {
  test.each([
    ['string[]', 0],
    ['string[0]', 0],
    ['string[100]', 100],
  ])('parse number or null', (input, value) =>
    expect(ArrayAttribute.parser(ValueFieldType.parser).parse(input)).toStrictEqual(
      new ParseSuccess(new ArrayAttribute(new ValueFieldType('string'), value), '')
    )
  )

  test.each([['string[-1]']])("can't parse negative value", input =>
    expect(() => ArrayAttribute.parser(ValueFieldType.parser).parse(input)).toThrow('')
  )
})
