import { ParseSuccess } from '../parser/parseResult'
import { Collection } from './collection'
import { Comment } from './comment'
import { Constant } from './constant'
import { Depend } from './depend'
import { Document } from './document'
import { DocumentId } from './documentId'
import { DocumentType } from './documentType'
import { ArrayAttribute } from './field/arrayAttribute'
import { DictionaryFieldType } from './field/dictionaryFieldType'
import { EnumeratedFieldType } from './field/enumeratedFieldType'
import { FakerFieldType } from './field/fakerFieldType'
import { Field } from './field/field'
import { FakeGenerate } from './generate/fakeGenerate'
import { JsonGenerate } from './generate/jsonGenerate'
import { Info } from './info'
import { Locale } from './locale'
import { ProjectId } from './projectId'
import { Schema } from './schema'

describe('Schema', () => {
  const schema = `
info description = My Project

depend ./subSchema.txt

projectId = MyProject

const myself = rizumita
locale = ja

type User: $myself = {
  firstName: string%name.firstName
  field: {
    name: string%random.word
  }
}

// comment
collection users {
  document User {
    collection notes {
      document Note: random.uuid {
        tags: string%random.word[20]  // comment
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
          new Depend('./subSchema.txt'),
          new ProjectId('MyProject'),
          new Constant('myself', 'rizumita'),
          new Locale('ja'),
          new DocumentType('User', new DocumentId(new EnumeratedFieldType('string', ['$myself'])), [
            new Field('firstName', new FakerFieldType('string', 'name.firstName')),
            new Field(
              'field',
              new DictionaryFieldType([new Field('name', new FakerFieldType('string', 'random.word'))])
            ),
          ]),
          new Comment('This is comm'),
          new Collection('users', [
            new Document('User', null, [
              new FakeGenerate(100),
              new JsonGenerate('[ { "firstName" : "Ryoichi", "lastName" : "Izumita" } ]'),
              new Collection('notes', [
                new Document('Note', new DocumentId(new FakerFieldType('string', 'random.uuid')), [
                  new Field('tags', new ArrayAttribute(new FakerFieldType('string', 'random.word'), 20)),
                ]),
              ]),
            ]),
          ]),
        ]),
        ''
      )
    ))
})
