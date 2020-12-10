import { schemaParser } from './schemaParser'
import { ParseSuccess } from '../parser/parseResult'
import { Info } from '../schema/info'
import { Constant } from '../schema/constant'
import { ValueType } from '../schema/valueType'
import { CollectionType } from '../schema/collectionType'
import { DocumentType } from '../schema/documentType'
import { Locale } from '../schema/locale'
import { Fake } from '../schema/fake'
import { Schema } from '../schema/schema'
import { ProjectId } from '../schema/projectId'
import { Generate } from '../schema/generate'

describe('parse item', () => {
  const schema = `info description = My Project

projectId = MyProject

const myself = rizumita
locale = ja

collection users {
  document {
    firstName: string@name.firstName
    lastName: string@name.lastName

    collection notes {
      document {
        title: string@name.title

        fake 20
      }
    }

    fake 100
    generate {
      "$myself" : { "firstName" : "Ryoichi", "lastName" : "Izumita" }
    }
  }
}
`

  test('parse schema', () =>
    expect(schemaParser.parse(schema)).toStrictEqual(
      new ParseSuccess(
        new Schema([
          new Info(['description', 'My Project']),
          new ProjectId('MyProject'),
          new Constant(['myself', 'rizumita']),
          new Locale('ja'),
          new CollectionType([
            'users',
            [
              new DocumentType([
                new ValueType(['firstName', 'string', 'name.firstName']),
                new ValueType(['lastName', 'string', 'name.lastName']),
                new Fake(100),
                new Generate('{ "$myself": { "firstName" : "Ryoichi", "lastName" : "Izumita" } }'),
                new CollectionType([
                  'notes',
                  [new DocumentType([new ValueType(['title', 'string', 'name.title']), new Fake(20)])],
                ]),
              ]),
            ],
          ]),
        ]),
        ''
      )
    ))
})
