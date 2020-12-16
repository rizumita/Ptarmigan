import { ParseSuccess } from '../parser/parseResult'
import { Collection } from './collection'
import { Constant } from './constant'
import { Document } from './document'
import { DocumentId } from './documentId'
import { DocumentType } from './documentType'
import { ArrayAttribute } from './field/arrayAttribute'
import { AutoIncrementAttribute } from './field/autoIncrementAttribute'
import { DictionaryFieldType } from './field/dictionaryFieldType'
import { EnumeratedAttribute } from './field/enumeratedAttribute'
import { FakerAttribute } from './field/fakerAttribute'
import { Field } from './field/field'
import { ValueFieldType } from './field/valueFieldType'
import { FakeGenerate } from './generate/fakeGenerate'
import { JsonGenerate } from './generate/jsonGenerate'
import { Info } from './info'
import { Locale } from './locale'
import { ProjectId } from './projectId'
import { Schema } from './schema'

describe('Schema', () => {
  const schema = `
info description = My Project

projectId = MyProject

const myself = rizumita
locale = ja

type User = {
  firstName: string%{{name.firstName}}
  field: {
    name: string%{{random.word}}
  }
}

collection users {
  id: $myself
  document User {
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
}
`

  test('parse', () =>
    expect(Schema.parser.parse(schema)).toStrictEqual(
      new ParseSuccess(
        new Schema([
          new Info('description', 'My Project'),
          new ProjectId('MyProject'),
          new Constant('myself', 'rizumita'),
          new Locale('ja'),
          new DocumentType('User', [
            new Field('firstName', new ValueFieldType('string', new FakerAttribute('name.firstName'))),
            new Field(
              'field',
              new DictionaryFieldType([
                new Field('name', new ValueFieldType('string', new FakerAttribute('random.word'))),
              ])
            ),
          ]),
          new Collection('users', new DocumentId(new EnumeratedAttribute(['$myself'])), [
            new Document('User', [
              new FakeGenerate(100),
              new JsonGenerate('[ { "firstName" : "Ryoichi", "lastName" : "Izumita" } ]'),
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
        ]),
        ''
      )
    ))
})
