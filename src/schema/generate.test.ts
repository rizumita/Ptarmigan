import { ParseSuccess } from '../parser/parseResult'
import { Generate } from './generate'

describe('Generate', () => {
  test.each([
    ['generate 20', new Generate(20)],
    ['generate { "$Var": "test" }', new Generate('{ "$Var": "test" }')],
    ['generate { "$Var": { "title": "my note" } }', new Generate('{ "$Var": { "title": "my note" } }')],
    ['generate{"a":{"b":"c"}}', new Generate('{ "a": { "b": "c" } }')],
  ])('parse', (input, value) => expect(Generate.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
