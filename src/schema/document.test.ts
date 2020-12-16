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

describe('Document', () => {
  test.each([
    ['document User', new Document('User', null, [])],
    ['document User:{auto}{}', new Document('User', new DocumentId(new AutoIncrementAttribute(1)), [])],
    ['document User:$myself {}', new Document('User', new DocumentId(new EnumeratedAttribute(['$myself'])), [])],
    ['document User:{{random.uuid}} { }', new Document('User', new DocumentId(new FakerAttribute('random.uuid')), [])],
    [
      `document User:{auto} {
        name: string%{{name.firstName}}
        tags: string%{{random.word}}[20]
        dict: {
          name: string%{{random.word}}
        }
        generate 20
        generate [
          { "id": 0, "name": "Ryoichi Izumita"}
        ]
        collection notes {
          document Note: {auto}
        }
      }`,
      new Document('User', new DocumentId(new AutoIncrementAttribute(1)), [
        new Field('name', new ValueFieldType('string', new FakerAttribute('name.firstName'))),
        new Field('tags', new ArrayAttribute(new ValueFieldType('string', new FakerAttribute('random.word')), 20)),
        new Field(
          'dict',
          new DictionaryFieldType([new Field('name', new ValueFieldType('string', new FakerAttribute('random.word')))])
        ),
        new FakeGenerate(20),
        new JsonGenerate('[ { "id": 0, "name": "Ryoichi Izumita"} ]'),
        new Collection('notes', [new Document('Note', new DocumentId(new AutoIncrementAttribute(1)), [])]),
      ]),
    ],
  ])('parse', (input, value) => expect(Document.parser(2).parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
