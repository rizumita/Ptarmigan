import { colDocParser, constParser, itemParser, typeParser } from './schemaParser'
import { ParseSuccess } from './parser/parseResult'

describe('Item parser', () => {
  test.each([
    ['project = MyProject', ['project', 'MyProject'], ''],
    ['project = my project', ['project', 'my project'], '']
  ])('succeeded parsing item', (input, value, next) =>
    expect(itemParser.parse(input)).toStrictEqual(new ParseSuccess(value, next))
  )

  test.each([
    ['const Ver = v1', ['const', 'Ver', 'v1']],
    ['const Ver  =  v2', ['const', 'Ver', 'v2']]
  ])('succeeded parsing const', (input, value) =>
    expect(constParser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    ['type Name = string', ['type', 'Name', 'string']],
    ['type Name  =  string', ['type', 'Name', 'string']],
    [
      `type User = {
    id: ID
    name: Name
  }
  `,
      [
        'type',
        'User',
        [
          ['id', 'ID'],
          ['name', 'Name']
        ]
      ]
    ]
  ])('succeeded parsing type', (input, value) =>
    expect(typeParser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
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
      ['collection', 'users', ['document', 'User', ['collection', 'notes', ['document', 'Note']]]]
    ]
  ])('succeeded parsing collection and document', (input, value) =>
    expect(colDocParser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )
})
