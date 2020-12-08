import { collectionParser } from './schemaParser'
import { ParseSuccess } from '../parser/parseResult'
import { CollectionType } from '../schema/CollectionType'
import { DocumentType } from '../schema/documentType'
import { Fake } from '../schema/fake'
import { Generate } from '../schema/generate'

describe('Parsing collection', () => {
  test.each([
    [`collection users { document User { } }`, new CollectionType(['users', [new DocumentType(['User'])]])],
    [`collection users { document User }`, new CollectionType(['users', [new DocumentType(['User'])]])],
    [`collection users{document User}`, new CollectionType(['users', [new DocumentType(['User'])]])],
    [`collection users{document User{}}`, new CollectionType(['users', [new DocumentType(['User'])]])],
    [
      `collection users {
      document User {
        collection notes {
          document Note
          fake 100
          generate { "uniqueid": { "title": "my note" } }
        }
      }
    }`,
      new CollectionType([
        'users',
        [
          new DocumentType([
            'User',
            new CollectionType([
              'notes',
              [new DocumentType(['Note']), new Fake(100), new Generate('{ "uniqueid": { "title": "my note" } }')]
            ])
          ])
        ]
      ])
    ],
    [
      `collection users {fake 100 document User{collection notes{document Note}}}`,
      new CollectionType([
        'users',
        [new Fake(100), new DocumentType(['User', new CollectionType(['notes', [new DocumentType(['Note'])]])])]
      ])
    ]
  ])('is succeeded', (input, value) => expect(collectionParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
