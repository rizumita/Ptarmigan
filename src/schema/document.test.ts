import { ParseSuccess } from '../parser/parseResult'
import { Collection } from './collection'
import { Document } from './document'
import { DocumentId } from './documentId'
import { ArrayAttribute } from './field/arrayAttribute'
import { AutoIncrementFieldType } from './field/autoIncrementFieldType'
import { DictionaryFieldType } from './field/dictionaryFieldType'
import { EnumeratedFieldType } from './field/enumeratedFieldType'
import { FakerFieldType } from './field/fakerFieldType'
import { Field } from './field/field'
import { FakeGenerate } from './generate/fakeGenerate'
import { JsonGenerate } from './generate/jsonGenerate'

describe('Document', () => {
  test.each([
    ['document User', new Document('User', null, [])],
    ['document User:{auto}{}', new Document('User', new DocumentId(new AutoIncrementFieldType('string', 1)), [])],
    [
      'document User:$myself {}',
      new Document('User', new DocumentId(new EnumeratedFieldType('string', ['$myself'])), []),
    ],
    [
      'document User:random.uuid { }',
      new Document('User', new DocumentId(new FakerFieldType('string', 'random.uuid')), []),
    ],
    [
      `document User:{auto} {
        name: string%name.firstName
        tags: string%random.word[20]
        dict: {
          name: string%random.word
        }
        generate 20
        generate [
          { "id": 0, "name": "Ryoichi Izumita"}
        ]
        collection notes {
          document Note: {auto}
        }
      }`,
      new Document('User', new DocumentId(new AutoIncrementFieldType('string', 1)), [
        new Field('name', new FakerFieldType('string', 'name.firstName')),
        new Field('tags', new ArrayAttribute(new FakerFieldType('string', 'random.word'), 20)),
        new Field('dict', new DictionaryFieldType([new Field('name', new FakerFieldType('string', 'random.word'))])),
        new FakeGenerate(20),
        new JsonGenerate('[ { "id": 0, "name": "Ryoichi Izumita"} ]'),
        new Collection('notes', [new Document('Note', new DocumentId(new AutoIncrementFieldType('string', 1)), [])]),
      ]),
    ],
  ])('parse', (input, value) => expect(Document.parser(2).parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
