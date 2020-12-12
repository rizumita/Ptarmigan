import { ParseSuccess } from '../../parser/parseResult'
import { DictionaryFieldType } from './dictionaryFieldType'
import { FakeAttribute } from './fakeAttribute'
import { Field } from './field'
import { ValueFieldType } from './valueFieldType'

describe('Field', () => {
  test.each([
    ['title: string', new Field('title', new ValueFieldType('string', null, null))],
    [
      'title: string%name.title',
      new Field('title', new ValueFieldType('string', new FakeAttribute('name.title'), null)),
    ],
    [
      `dict: {
          name: string
        }`,
      new Field('dict', new DictionaryFieldType([new Field('name', new ValueFieldType('string', null, null))])),
    ],
  ])('parse', (input, value) => expect(Field.parser(2).parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
