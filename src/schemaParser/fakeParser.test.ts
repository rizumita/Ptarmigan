import { fakeParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { Fake } from '../schema/fake'

describe('Parsing fake', () => {
  test.each([
    ['fake 10', new Fake(10)],
    ['fake   10', new Fake(10)]
  ])('is succeeded', (input, value) => expect(fakeParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([['fake', ' is not match', '/^[\\w\\.]+/ is not match']])('is failed', (input, message, next) =>
    expect(fakeParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
