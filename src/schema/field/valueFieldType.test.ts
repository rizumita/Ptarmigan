import { ParseSuccess } from '../../parser/parseResult'
import { AutoIncrementAttribute } from './autoIncrementAttribute'
import { EnumeratedAttribute } from './enumeratedAttribute'
import { FakerAttribute } from './fakerAttribute'
import { ReferenceAttribute } from './referenceAttribute'
import { ValueFieldType } from './valueFieldType'

describe('ValueFieldType', () => {
  test.each([
    ['string', 'string', null, ''],
    ['string%{{random.word}}', 'string', new FakerAttribute('random.word'), ''],
    ['timestamp%{{date.recent}}', 'timestamp', new FakerAttribute('date.recent'), ''],
    ['string%{{random.word}}[10]', 'string', new FakerAttribute('random.word'), '[10]'],
    ['string%{auto}[10]', 'string', new AutoIncrementAttribute(1), '[10]'],
    ['string%(abc)[10]', 'string', new EnumeratedAttribute(['abc']), '[10]'],
    ['string@/categories/Category', 'string', new ReferenceAttribute('/categories/Category'), ''],
    ['string@/categories/Category[20]', 'string', new ReferenceAttribute('/categories/Category'), '[20]'],
  ])('parse', (input, type, attr, next) =>
    expect(ValueFieldType.parser.parse(input)).toStrictEqual(new ParseSuccess(new ValueFieldType(type, attr), next))
  )

  test.each([
    [new ValueFieldType('timestamp', new FakerAttribute('date.recent'))],
    [new ValueFieldType('timestamp', new FakerAttribute('date.past'))],
    [new ValueFieldType('timestamp', new FakerAttribute('date.future'))],
  ])('get data', type => expect(type.data()).toEqual(''))
})
