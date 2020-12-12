import { ParseSuccess } from '../parser/parseResult'
import { Info } from './info'

describe('Info', () => {
  test.each([
    ['info project = MyProject', new Info('project', 'MyProject'), ''],
    ['info project = my project', new Info('project', 'my project'), ''],
    ['info project=my project', new Info('project', 'my project'), ''],
  ])('parse', (input, value) => expect(Info.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
