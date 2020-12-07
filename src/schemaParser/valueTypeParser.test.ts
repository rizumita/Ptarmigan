import { valueTypeParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { ValueType } from '../schema/valueType'

describe('Parsing value type', () => {
  test.each([
    ['type Name = string', new ValueType(['type', 'Name', 'string'])],
    ['type Name = string@name.first', new ValueType(['type', 'Name', 'string', 'name.first'])],
    ['type Name  =  string', new ValueType(['type', 'Name', 'string'])],
    ['type Name=string', new ValueType(['type', 'Name', 'string'])]
  ])('is succeeded', (input, value) => expect(valueTypeParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([
    ['type Name =', '/^\\b[\\w\\.]+/ is not match', ''],
    ['type Name = \nstring', '/^\\b[\\w\\.]+/ is not match', '\nstring']
  ])('is failed', (input, message, next) =>
    expect(valueTypeParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
