import { ParseSuccess } from '../parser/parseResult'
import { Locale } from './locale'

describe('Locale', () => {
  test.each([
    ['locale = ja', new Locale('ja')],
    ['locale=ja', new Locale('ja')],
    ['locale  =  ja', new Locale('ja')],
  ])('parse', (input, value) => expect(Locale.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
