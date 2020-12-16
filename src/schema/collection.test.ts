import { ParseSuccess } from '../parser/parseResult'
import { Collection } from './collection'
import { Document } from './document'
import { DocumentId } from './documentId'
import { ArrayAttribute } from './field/arrayAttribute'
import { AutoIncrementAttribute } from './field/autoIncrementAttribute'
import { DictionaryFieldType } from './field/dictionaryFieldType'
import { EnumeratedAttribute } from './field/enumeratedAttribute'
import { FakerAttribute } from './field/fakerAttribute'
import { Field } from './field/field'
import { ValueFieldType } from './field/valueFieldType'
import { FakeGenerate } from './generate/fakeGenerate'
import { JsonGenerate } from './generate/jsonGenerate'

describe('Collection', () => {
  test.each([
    [
      'collection users { document User { } }',
      new Collection('users', new DocumentId(new AutoIncrementAttribute(1)), [new Document('User', [])]),
    ],
    ['collection users { id: $var }', new Collection('users', new DocumentId(new EnumeratedAttribute(['$var'])), [])],
    [
      `collection users {
  id: {auto}
  document User {
    firstName: string%{{name.firstName}}
    field: {
      name: string%{{random.word}}
    }
    collection notes {
      id: {{random.uuid}}
      document Note {
        tags: string%{{random.word}}[20]
      }
    }

    generate 100
    generate [
      { "firstName" : "Ryoichi", "lastName" : "Izumita" }
    ]
  }
}`,
      new Collection('users', new DocumentId(new AutoIncrementAttribute(1)), [
        new Document('User', [
          new Field('firstName', new ValueFieldType('string', new FakerAttribute('name.firstName'))),
          new Field(
            'field',
            new DictionaryFieldType([
              new Field('name', new ValueFieldType('string', new FakerAttribute('random.word'))),
            ])
          ),
          new FakeGenerate(100),
          new JsonGenerate('[ "firstName" : "Ryoichi", "lastName" : "Izumita" } ]'),
          new Collection('notes', new DocumentId(new FakerAttribute('random.uuid')), [
            new Document('Note', [
              new Field(
                'tags',
                new ArrayAttribute(new ValueFieldType('string', new FakerAttribute('random.word')), 20)
              ),
            ]),
          ]),
        ]),
      ]),
    ],
  ])('parse', (input, value) => expect(Collection.parser(4).parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
