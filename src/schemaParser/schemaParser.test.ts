import { schemaParser } from './schemaParser'
import { ParseSuccess } from '../parser/parseResult'
import { Info } from '../schema/info'
import { Constant } from '../schema/constant'
import { ValueType } from '../schema/valueType'
import { ComplexType } from '../schema/complexType'
import { CollectionType } from '../schema/CollectionType'
import { DocumentType } from '../schema/documentType'
import { Locale } from '../schema/locale'
import { Fake } from '../schema/fake'

describe('parse item', () => {
  const schema = `
info project = MyProject

const Ver = v1

locale = ja

type ID = int@unique
type Name = string@name.firstName
type Title = string@name.title

type User = {
  id: ID
  name: Name
}

type Note = {
  id: ID
  title: Title
}

collection users {
  fake: 100
  document User {
    collection notes {
      document Note
    }
  }
}
`

  test('parse schema', () =>
    expect(schemaParser.parse(schema)).toStrictEqual(
      new ParseSuccess(
        [
          new Info(['info', 'project', 'MyProject']),
          new Constant(['const', 'Ver', 'v1']),
          new Locale(['locale', 'ja']),
          new ValueType(['type', 'ID', 'int', 'unique']),
          new ValueType(['type', 'Name', 'string', 'name.firstName']),
          new ValueType(['type', 'Title', 'string', 'name.title']),
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
            [
              new Fake(['Fake', '100']),
              new DocumentType([
                'document',
                'User',
                new CollectionType(['collection', 'notes', [new DocumentType(['document', 'Note'])]])
              ])
            ]
          ])
        ],
        ''
      )
    ))
})
