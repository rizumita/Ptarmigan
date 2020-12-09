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
import { Schema } from '../schema/schema'
import { ProjectId } from '../schema/projectId'

describe('parse item', () => {
  const schema = `
info description = My Project

projectId = MyProject
const Ver = v1
locale = ja

type ID: int@unique
type Name: string@name.firstName
type Title: string@name.title

type User: {
  id: ID
  name: Name
}

type Note: {
  id: ID
  title: Title
}

collection users {
  fake 100
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
        new Schema([
          new Info(['description', 'My Project']),
          new ProjectId('MyProject'),
          new Constant(['Ver', 'v1']),
          new Locale('ja'),
          new ValueType(['ID', 'int', 'unique']),
          new ValueType(['Name', 'string', 'name.firstName']),
          new ValueType(['Title', 'string', 'name.title']),
          new ComplexType([
            'User',
            [
              ['id', 'ID'],
              ['name', 'Name']
            ]
          ]),
          new ComplexType([
            'Note',
            [
              ['id', 'ID'],
              ['title', 'Title']
            ]
          ]),
          new CollectionType([
            'users',
            [new Fake(100), new DocumentType(['User', new CollectionType(['notes', [new DocumentType(['Note'])]])])]
          ])
        ]),
        ''
      )
    ))
})
