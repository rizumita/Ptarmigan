import { ParseSuccess } from '../../parser/parseResult'
import { ArrayAttribute } from './arrayAttribute'
import { DictionaryFieldType } from './dictionaryFieldType'
import { FakerAttribute } from './fakerAttribute'
import { Field } from './field'
import { ValueFieldType } from './valueFieldType'

describe('DictionaryFieldType', () => {
  test.each([
    [
      `{
          name: string%{{random.word}}
          date: timestamp%{{date.recent}}[10]
        }`,
      new DictionaryFieldType([
        new Field('name', new ValueFieldType('string', new FakerAttribute('random.word'))),
        new Field('date', new ArrayAttribute(new ValueFieldType('timestamp', new FakerAttribute('date.recent')), 10)),
      ]),
    ],
    [
      `{
          name: string%{{random.word}}
        }`,
      new DictionaryFieldType([new Field('name', new ValueFieldType('string', new FakerAttribute('random.word')))]),
    ],
  ])('pares', (input, value) =>
    expect(DictionaryFieldType.parser(2).parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )
})
