import { infoParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { Info } from '../schema/info'

describe('Parsing info', () => {
  test.each([
    ['info project = MyProject', new Info(['info', 'project', 'MyProject']), ''],
    ['info project = my project', new Info(['info', 'project', 'my project']), ''],
    ['info project=my project', new Info(['info', 'project', 'my project']), '']
  ])('is succeeded', (input, value, next) =>
    expect(infoParser.parse(input)).toStrictEqual(new ParseSuccess(value, next))
  )

  test.each([
    ['info project =', '/^[\\w ]+/ is not match', ''],
    ['info project =\nMyProject', '/^[\\w ]+/ is not match', '\nMyProject']
  ])('is failed', (input, message, next) =>
    expect(infoParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
