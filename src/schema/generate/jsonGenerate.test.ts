import { ParseSuccess } from '../../parser/parseResult'
import { JsonGenerate } from './jsonGenerate'

describe('JsonGenerate', () => {
  test.each([
    ['generate [{ "$Var": "test" }]', new JsonGenerate('[ { "$Var": "test" } ]')],
    ['generate [ { "title": "my note" } ]', new JsonGenerate('[ { "title": "my note" } ]')],
    ['generate[{"b":"c"}]', new JsonGenerate('[ { "b": "c" } ]')],
  ])('parse', (input, value) => expect(JsonGenerate.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
