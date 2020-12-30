import { ParseSuccess } from '../parser/parseResult'
import { Depend } from './depend'
import path from 'path'

describe('Depend', () => {
  test.each([
    ['depend subSchema.txt', new Depend('subSchema.txt')],
    ['depend ./subSchema.txt', new Depend('./subSchema.txt')],
  ])('parse', (input, value) => expect(Depend.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test('validate with succeeded', () =>
    expect(() => new Depend('depend.test.ts').getPath(path.dirname(module.filename))).not.toThrow())

  test('validate with failure', () =>
    expect(() => new Depend('notExist.ts').getPath(path.dirname(module.filename))).toThrow())
})
