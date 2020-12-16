import { ParseSuccess } from '../../parser/parseResult'
import { ArrayAttribute } from './arrayAttribute'
import { DictionaryFieldType } from './dictionaryFieldType'
import { EnumeratedFieldType } from './enumeratedFieldType'
import { FakerFieldType } from './fakerFieldType'
import { Field } from './field'

describe('DictionaryFieldType', () => {
  test('simple match', () =>
    expect(DictionaryFieldType.parser(2).parse(`{name: string}`)).toStrictEqual(
      new ParseSuccess(new DictionaryFieldType([new Field('name', new EnumeratedFieldType('string', []))]), '')
    ))

  test.each([
    [
      `{
          name: string%random.word
          date: timestamp%date.recent[10]
        }`,
      new DictionaryFieldType([
        new Field('name', new FakerFieldType('string', 'random.word')),
        new Field('date', new ArrayAttribute(new FakerFieldType('timestamp', 'date.recent'), 10)),
      ]),
    ],
    [
      `{
          name: string
        }`,
      new DictionaryFieldType([new Field('name', new EnumeratedFieldType('string', []))]),
    ],
    [
      `{
          name: string%random.word
        }`,
      new DictionaryFieldType([new Field('name', new FakerFieldType('string', 'random.word'))]),
    ],
  ])('parse', (input, value) =>
    expect(DictionaryFieldType.parser(2).parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )
})
