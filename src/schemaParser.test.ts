import { colDocParser, complexTypeParser, constParser, infoParser, schemaParser, valueTypeParser } from './schemaParser'
import { ParseSuccess } from './parser/parseResult'
import { Info } from './schema/info'
import { Constant } from './schema/constant'
import { ValueType } from './schema/valueType'
import { ComplexType } from './schema/complexType'
import { CollectionType } from './schema/CollectionType'
import { DocumentType } from './schema/documentType'
import { Property } from './schema/property'

describe('Item parser', () => {
  test.each([
    ['info project = MyProject', new Info(['info', 'project', 'MyProject']), ''],
    ['info project = my project', new Info(['info', 'project', 'my project']), ''],
    ['info project=my project', new Info(['info', 'project', 'my project']), '']
  ])('succeeded parsing item', (input, value, next) =>
    expect(infoParser.parse(input)).toStrictEqual(new ParseSuccess(value, next))
  )

  test.each([
    ['const Ver = v1', new Constant(['const', 'Ver', 'v1'])],
    ['const Ver  =  v2', new Constant(['const', 'Ver', 'v2'])],
    ['const Ver=v2', new Constant(['const', 'Ver', 'v2'])]
  ])('succeeded parsing const', (input, value) =>
    expect(constParser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    ['type Name = string', new ValueType(['type', 'Name', 'string'])],
    ['type Name  =  string', new ValueType(['type', 'Name', 'string'])],
    ['type Name=string', new ValueType(['type', 'Name', 'string'])]
  ])('succeeded parsing value type', (input, value) =>
    expect(valueTypeParser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    [
      `type User = {
    id: ID
    name: Name
  }
  `,
      new ComplexType([
        'type',
        'User',
        [
          ['id', 'ID'],
          ['name', 'Name']
        ]
      ])
    ]
  ])('succeeded parsing complex type', (input, value) =>
    expect(complexTypeParser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    [
      `
collection users {
  document User {
    collection notes {
      document Note
    }
  }
}
`,
      new CollectionType([
        'collection',
        'users',
        new DocumentType([
          'document',
          'User',
          new CollectionType(['collection', 'notes', new DocumentType(['document', 'Note'])])
        ])
      ])
    ]
  ])('succeeded parsing collection and document', (input, value) =>
    expect(colDocParser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  const schema = `
info project = MyProject

const Ver = v1

type ID = int
type Name = string
type Title = string

type User = {
  id: ID
  name: Name
}

type Note = {
  id: ID
  title: Title
}

collection users {
  document User {
    collection notes {
      document Note
    }
  }
}
`

  test('succeeded parsing schema', () =>
    expect(schemaParser.parse(schema)).toStrictEqual(
      new ParseSuccess(
        [
          new Info(['info', 'project', 'MyProject']),
          new Constant(['const', 'Ver', 'v1']),
          new ValueType(['type', 'ID', 'int']),
          new ValueType(['type', 'Name', 'string']),
          new ValueType(['type', 'Title', 'string']),
          new ComplexType([
            'type',
            'User',
            [
              ['id', 'ID'],
              ['name', 'Name']
            ]
          ]),
          new ComplexType([
            'type',
            'Note',
            [
              ['id', 'ID'],
              ['title', 'Title']
            ]
          ]),
          new CollectionType([
            'collection',
            'users',
            new DocumentType([
              'document',
              'User',
              new CollectionType(['collection', 'notes', new DocumentType(['document', 'Note'])])
            ])
          ])
        ],
        ''
      )
    ))
})
