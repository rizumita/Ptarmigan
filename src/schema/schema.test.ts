import { ParseSuccess } from '../parser/parseResult'
import { Collection } from './collection'
import { Constant } from './constant'
import { Document } from './document'
import { ArrayAttribute } from './field/arrayAttribute'
import { DictionaryFieldType } from './field/dictionaryFieldType'
import { FakeAttribute } from './field/fakeAttribute'
import { Field } from './field/field'
import { ValueFieldType } from './field/valueFieldType'
import { Generate } from './generate'
import { Info } from './info'
import { Locale } from './locale'
import { ProjectId } from './projectId'
import { Schema } from './schema'

describe('Schema', () => {
  const schema = `info description = My Project

projectId = MyProject

const myself = rizumita
locale = ja

collection users {
  document User {
    firstName: string%name.firstName
    field: {
      name: string%random.word
    }
    collection notes {
      document Note {
        tags: string%random.word[20]
      }
    }

    generate 100
    generate {
      "rizumita" : { "firstName" : "Ryoichi", "lastName" : "Izumita" }
    }
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
          new Collection('users', [
            new Document('User', [
              new Field('firstName', new ValueFieldType('string', new FakeAttribute('name.firstName'), null)),
              new Field(
                'field',
                new DictionaryFieldType([
                  new Field('name', new ValueFieldType('string', new FakeAttribute('random.word'), null)),
                ])
              ),
              new Generate(100),
              new Generate('{ "rizumita" : { "firstName" : "Ryoichi", "lastName" : "Izumita" } }'),
              new Collection('notes', [
                new Document('Note', [
                  new Field(
                    'tags',
                    new ValueFieldType('string', new FakeAttribute('random.word'), new ArrayAttribute(20))
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
