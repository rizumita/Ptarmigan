import { valueTypeParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { ValueType } from '../schema/valueType'

describe('Parsing value type', () => {
  test.each([
    ['name: string', new ValueType(['name', 'string'])],
    ['name: string@name.first', new ValueType(['name', 'string', 'name.first'])],
    ['name :  string', new ValueType(['name', 'string'])],
    ['name:string', new ValueType(['name', 'string'])]
  ])('is succeeded', (input, value) => expect(valueTypeParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([
    ['name:', '/^[\\w]+/ is not match', ''],
    ['name string', 'expect: :', 'string']
  ])('is failed', (input, message, next) =>
    expect(valueTypeParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
