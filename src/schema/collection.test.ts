import { ParseSuccess } from '../parser/parseResult'
import { Collection } from './collection'
import { Document } from './document'
import { ArrayAttribute } from './field/arrayAttribute'
import { DictionaryFieldType } from './field/dictionaryFieldType'
import { FakerFieldType } from './field/fakerFieldType'
import { Field } from './field/field'
import { FakeGenerate } from './generate/fakeGenerate'
import { JsonGenerate } from './generate/jsonGenerate'

describe('Collection', () => {
  test.each([
    ['collection users { document User { } }', new Collection('users', [new Document('User', null, [])])],
    ['collection users { }', new Collection('users', [])],
    [
      `collection users {
  document User {
    firstName: string%name.firstName
    field: {
      name: string%random.word
    }
    collection notes {  // comment
      document Note {
        tags: string%random.word[20]
      }
    }

    generate 100
    generate [
      { "firstName" : "Ryoichi", "lastName" : "Izumita" }
    ]
  }
}`,
      new Collection('users', [
        new Document('User', null, [
          new Field('firstName', new FakerFieldType('string', 'name.firstName')),
          new Field('field', new DictionaryFieldType([new Field('name', new FakerFieldType('string', 'random.word'))])),
          new FakeGenerate(100),
          new JsonGenerate('[ { "firstName" : "Ryoichi", "lastName" : "Izumita" } ]'),
          new Collection('notes', [
            new Document('Note', null, [
              new Field('tags', new ArrayAttribute(new FakerFieldType('string', 'random.word'), 20)),
            ]),
          ]),
        ]),
      ]),
    ],
  ])('parse', (input, value) => expect(Collection.parser(4).parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
