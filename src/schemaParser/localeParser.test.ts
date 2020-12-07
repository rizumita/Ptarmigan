import { localeParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { Locale } from '../schema/locale'

describe('Parsing locale', () => {
  test.each([
    ['locale = ja', new Locale(['locale', 'ja'])],
    ['locale=ja', new Locale(['locale', 'ja'])],
    ['locale  =  ja', new Locale(['locale', 'ja'])]
  ])('is succeeded', (input, value) => expect(localeParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([
    ['locale =', '/^\\b[\\w\\.]+/ is not match', ''],
    ['locale=\nja', '/^\\b[\\w\\.]+/ is not match', '\nja']
  ])('is failed', (input, message, next) =>
    expect(localeParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
