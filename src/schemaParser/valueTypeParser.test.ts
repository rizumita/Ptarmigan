import { valueTypeParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { ValueType } from '../schema/valueType'

describe('Parsing value type', () => {
  test.each([
    ['type Name: string', new ValueType(['Name', 'string'])],
    ['type Name: string@name.first', new ValueType(['Name', 'string', 'name.first'])],
    ['type Name:  string', new ValueType(['Name', 'string'])],
    ['type Name:string', new ValueType(['Name', 'string'])]
  ])('is succeeded', (input, value) => expect(valueTypeParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([
    ['type Name:', '/^[\\w]+/ is not match', ''],
    ['type Name string', 'expect: :', ' string']
  ])('is failed', (input, message, next) =>
    expect(valueTypeParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
