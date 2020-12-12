import { ParseSuccess } from '../../parser/parseResult'
import { ArrayAttribute } from './arrayAttribute'
import { FakeAttribute } from './fakeAttribute'
import { ReferenceAttribute } from './referenceAttribute'
import { ValueFieldType } from './valueFieldType'

describe('ValueFieldType', () => {
  test.each([
    ['string', 'string', null, null],
    ['string%random.word', 'string', new FakeAttribute('random.word'), null],
    ['string%random.word[10]', 'string', new FakeAttribute('random.word'), new ArrayAttribute(10)],
    ['string@/categories/Category', 'string', new ReferenceAttribute('/categories/Category'), null],
    [
      'string@/categories/Category[20]',
      'string',
      new ReferenceAttribute('/categories/Category'),
      new ArrayAttribute(20),
    ],
  ])('parse', (input, type, attr, arrayAttr) =>
    expect(ValueFieldType.parser.parse(input)).toStrictEqual(
      new ParseSuccess(new ValueFieldType(type, attr, arrayAttr), '')
    )
  )
})
