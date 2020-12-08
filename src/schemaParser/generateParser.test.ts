import { generateParser } from './schemaParser'
import { ParseSuccess } from '../parser/parseResult'
import { Generate } from '../schema/generate'

describe('Parsing generate', () => {
  test.each([
    ['generate { "$Var": { "title": "my note" } }', JSON.parse('{ "$Var": { "title": "my note" } }')],
    ['generate{"a":{"b":"c"}}', JSON.parse('{ "a": { "b": "c" } }')]
  ])('is succeeded', function (input, value) {
    let actual = generateParser.parse(input)

    if (actual instanceof ParseSuccess) {
      const generate = actual.value as Generate
      return expect(generate.json).toStrictEqual(value)
    } else {
      return fail()
    }
  })
})
