import { isArray } from 'util'
import { ParseSuccess } from '../../parser/parseResult'
import { ArrayAttribute } from './arrayAttribute'
import { AutoIncrementAttribute } from './autoIncrementAttribute'
import { DictionaryFieldType } from './dictionaryFieldType'
import { EnumeratedAttribute } from './enumeratedAttribute'
import { FakerAttribute } from './fakerAttribute'
import { Field } from './field'
import { ValueFieldType } from './valueFieldType'

describe('Field', () => {
  test.each([
    ['title: string', new Field('title', new ValueFieldType('string'))],
    [
      'title: string%{{name.title}}',
      new Field('title', new ValueFieldType('string', new FakerAttribute('name.title'))),
    ],
    [
      'title: string%{{name.title}}[10]',
      new Field('title', new ValueFieldType('string', new FakerAttribute('name.title')), new ArrayAttribute(10)),
    ],
    [
      `dict: {
          name: string
        }`,
      new Field('dict', new DictionaryFieldType([new Field('name', new ValueFieldType('string'))])),
    ],
  ])('parse', (input, value) => expect(Field.parser(2).parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([
    [new Field('id', new ValueFieldType('string')), false, 0],
    [new Field('id', new ValueFieldType('string', new FakerAttribute('random.word'))), false, 1],
    [
      new Field('id', new ValueFieldType('string', new FakerAttribute('random.word')), new ArrayAttribute(10)),
      true,
      10,
    ],
    [new Field('id', new ValueFieldType('string', new EnumeratedAttribute([1, 2])), new ArrayAttribute(10)), true, 2],
    [
      new Field(
        'id',
        new DictionaryFieldType([new Field('name', new ValueFieldType('int', new AutoIncrementAttribute(1)))]),
        new ArrayAttribute(10)
      ),
      true,
      10,
    ],
  ])('get data', (field, isArray, length) => {
    const data = field.data
    expect(Array.isArray(data)).toEqual(isArray)
    if (Array.isArray(data)) {
      expect(data).toHaveLength(length)
    } else if (length == 1) {
      expect((data as { [key: string]: unknown })['id']).not.toBeNull()
    } else {
      expect(data).toBeNull()
    }
  })
})
