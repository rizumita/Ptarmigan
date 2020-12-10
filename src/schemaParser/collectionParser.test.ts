import { collectionParser } from './schemaParser'
import { ParseSuccess } from '../parser/parseResult'
import { CollectionType } from '../schema/collectionType'
import { DocumentType } from '../schema/documentType'
import { Fake } from '../schema/fake'
import { Generate } from '../schema/generate'
import { ValueType } from '../schema/valueType'

describe('Parsing collection', () => {
  test.each([
    ['collection users { document { } }', new CollectionType(['users', [new DocumentType([])]])],
    ['collection users{}', new CollectionType(['users', []])],
    ['collection users', new CollectionType(['users', []])],
    ['collection users{document{}}', new CollectionType(['users', [new DocumentType([])]])],
    [
      `collection users {
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
      "rizumita" : { "firstName" : "Ryoichi", "lastName" : "Izumita" }
    }
  }
}`,
      new CollectionType([
        'users',
        [
          new DocumentType([
            new ValueType(['firstName', 'string', 'name.firstName']),
            new ValueType(['lastName', 'string', 'name.lastName']),
            new Fake(100),
            new Generate('{ "rizumita": { "firstName" : "Ryoichi", "lastName" : "Izumita" } }'),
            new CollectionType([
              'notes',
              [new DocumentType([new ValueType(['title', 'string', 'name.title']), new Fake(20)])],
            ]),
          ]),
        ],
      ]),
    ],
    [
      `collection users{document {fake 100 collection notes{document{}}}}`,
      new CollectionType([
        'users',
        [new DocumentType([new Fake(100), new CollectionType(['notes', [new DocumentType(['Note'])]])])],
      ]),
    ],
  ])('is succeeded', (input, value) => expect(collectionParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
