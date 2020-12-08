import { complexTypeParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { ComplexType } from '../schema/complexType'

describe('Parsing complex type', () => {
  test.each([
    ['type User: {}', new ComplexType(['User', []])],
    [
      `type User: {
    id: ID
    name: Name
  }`,
      new ComplexType([
        'User',
        [
          ['id', 'ID'],
          ['name', 'Name']
        ]
      ])
    ]
  ])('is succeeded', (input, value) =>
    expect(complexTypeParser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    ['type User:', 'expect: {', ''],
    [
      `type User: {
    id: ID
    name: Name`,
      'expect: }',
      ''
    ]
  ])('is failed', (input, message, next) =>
    expect(complexTypeParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
