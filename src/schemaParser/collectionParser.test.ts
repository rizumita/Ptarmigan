import { collectionParser } from './schemaParser'
import { ParseSuccess } from '../parser/parseResult'
import { CollectionType } from '../schema/CollectionType'
import { DocumentType } from '../schema/documentType'
import { Fake } from '../schema/fake'

describe('Parsing collection', () => {
  test.each([
    [
      `collection users { document User { } }`,
      new CollectionType(['collection', 'users', [new DocumentType(['document', 'User'])]])
    ],
    [
      `collection users { document User }`,
      new CollectionType(['collection', 'users', [new DocumentType(['document', 'User'])]])
    ],
    [
      `collection users{document User}`,
      new CollectionType(['collection', 'users', [new DocumentType(['document', 'User'])]])
    ],
    [
      `collection users{document User{}}`,
      new CollectionType(['collection', 'users', [new DocumentType(['document', 'User'])]])
    ],
    [
      `collection users {
  fake: 100
  document User {
    collection notes {
      document Note
    }
  }
}`,
      new CollectionType([
        'collection',
        'users',
        [
          new Fake(['fake', '100']),
          new DocumentType([
            'document',
            'User',
            new CollectionType(['collection', 'notes', [new DocumentType(['document', 'Note'])]])
          ])
        ]
      ])
    ],
    [
      `collection users {fake: 100 document User{collection notes{document Note}}}`,
      new CollectionType([
        'collection',
        'users',
        [
          new Fake(['fake', '100']),
          new DocumentType([
            'document',
            'User',
            new CollectionType(['collection', 'notes', [new DocumentType(['document', 'Note'])]])
          ])
        ]
      ])
    ]
  ])('is succeeded', (input, value) => expect(collectionParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
