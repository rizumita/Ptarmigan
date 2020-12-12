import { ParseSuccess } from '../parser/parseResult'
import { Collection } from './collection'
import { Document } from './document'
import { ArrayAttribute } from './field/arrayAttribute'
import { DictionaryFieldType } from './field/dictionaryFieldType'
import { FakeAttribute } from './field/fakeAttribute'
import { Field } from './field/field'
import { ValueFieldType } from './field/valueFieldType'
import { Generate } from './generate'

describe('Document', () => {
  test.each([
    ['document User', new Document('User', [])],
    ['document User{}', new Document('User', [])],
    ['document User {}', new Document('User', [])],
    ['document User { }', new Document('User', [])],
    [
      `document User {
        name: string%name.firstName
        tags: string%random.word[20]
        dict: {
          name: string%random.word
        }
        generate 20
        generate {
          "rizumita" : { "id": 0, "name": "Ryoichi Izumita"}
        }
        collection notes {
          document Note
        }
      }`,
      new Document('User', [
        new Field('name', new ValueFieldType('string', new FakeAttribute('name.firstName'), null)),
        new Field('tags', new ValueFieldType('string', new FakeAttribute('random.word'), new ArrayAttribute(20))),
        new Field(
          'dict',
          new DictionaryFieldType([
            new Field('name', new ValueFieldType('string', new FakeAttribute('random.word'), null)),
          ])
        ),
        new Generate(20),
        new Generate('{ "rizumita" : { "id": 0, "name": "Ryoichi Izumita"} }'),
        new Collection('notes', [new Document('Note', [])]),
      ]),
    ],
  ])('parse', (input, value) => expect(Document.parser(2).parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
