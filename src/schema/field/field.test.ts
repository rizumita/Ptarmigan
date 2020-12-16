import { isArray } from 'util'
import { ParseSuccess } from '../../parser/parseResult'
import { ArrayAttribute } from './arrayAttribute'
import { AutoIncrementFieldType } from './autoIncrementFieldType'
import { DictionaryFieldType } from './dictionaryFieldType'
import { EnumeratedFieldType } from './enumeratedFieldType'
import { FakerFieldType } from './fakerFieldType'
import { Field } from './field'

describe('Field', () => {
  test.each([
    ['title: string', new Field('title', new EnumeratedFieldType('string'))],
    ['title: string%name.title', new Field('title', new FakerFieldType('string', 'name.title'))],
    [
      'title: string%name.title[10]',
      new Field('title', new ArrayAttribute(new FakerFieldType('string', 'name.title'), 10)),
    ],
    [
      `dict: {
          name: string
        }`,
      new Field('dict', new DictionaryFieldType([new Field('name', new EnumeratedFieldType('string', []))])),
    ],
  ])('parse', (input, value) => expect(Field.parser(2).parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([
    [new Field('id', new EnumeratedFieldType('string', [])), false, 0],
    [new Field('id', new FakerFieldType('string', 'random.word')), false, 1],
    [new Field('id', new ArrayAttribute(new FakerFieldType('string', 'random.word'), 10)), true, 10],
    [new Field('id', new ArrayAttribute(new EnumeratedFieldType('string', ['1', '2']), 10)), true, 2],
    [
      new Field(
        'id',
        new ArrayAttribute(new DictionaryFieldType([new Field('name', new AutoIncrementFieldType('int', 1))]), 10)
      ),
      true,
      10,
    ],
  ])('get data', (field, isArray, length) => {
    const data = field.data
    expect(Array.isArray(data[1])).toEqual(isArray)
    if (Array.isArray(data[1])) {
      expect(data[1]).toHaveLength(length)
    } else if (length == 1) {
      expect((data[1] as { [key: string]: unknown })['id']).not.toBeNull()
    } else {
      expect(data[1]).toBeNull()
    }
  })
})
