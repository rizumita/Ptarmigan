import { ParseSuccess } from '../../parser/parseResult'
import { FakerFieldType } from './fakerFieldType'

describe('fakerFieldType', () => {
  test.each([
    ['string%random.word&unique', new FakerFieldType('string', 'random.word', true), ''],
    ['string%random.word()', new FakerFieldType('string', 'random.word()', false), ''],
  ])('parse', (input, value, next) =>
    expect(FakerFieldType.parser.parse(input)).toStrictEqual(new ParseSuccess(value, next))
  )

  test.each([
    [new FakerFieldType('string', 'random.word()', false)],
    [new FakerFieldType('timestamp', 'date.recent', true)],
  ])('get data', fieldType => expect(fieldType.data()).not.toBeNull())
})
