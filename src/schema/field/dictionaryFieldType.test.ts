import { ParseSuccess } from '../../parser/parseResult'
import { ArrayAttribute } from './arrayAttribute'
import { DictionaryFieldType } from './dictionaryFieldType'
import { FakeAttribute } from './fakeAttribute'
import { Field } from './field'
import { ValueFieldType } from './valueFieldType'

describe('DictionaryFieldType', () => {
  test.each([
    [
      `{
          name: string%random.word
          date: timestamp%date.recent[10]
        }`,
      new DictionaryFieldType([
        new Field('name', new ValueFieldType('string', new FakeAttribute('random.word'), null)),
        new Field('date', new ValueFieldType('timestamp', new FakeAttribute('date.recent'), new ArrayAttribute(10))),
      ]),
    ],
  ])('pares', (input, value) =>
    expect(DictionaryFieldType.parser(2).parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )
})
