import { ParseSuccess } from '../parser/parseResult'
import { Info } from './info'

describe('Info', () => {
  test.each([
    ['info description = MyProject', new Info('description', 'MyProject'), ''],
    ['info description = my project', new Info('description', 'my project'), ''],
    ['info description=my project', new Info('description', 'my project'), ''],
    ['info description = /foo/bar/baz', new Info('description', '/foo/bar/baz'), ''],
  ])('parse', (input, value) => expect(Info.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
