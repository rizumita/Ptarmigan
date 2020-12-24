import { ParseSuccess } from '../parser/parseResult'
import { Constant } from './constant'

describe('Constant', () => {
  test.each([
    ['const Ver = v1', new Constant('Ver', 'v1')],
    ['const Ver  =  v2', new Constant('Ver', 'v2')],
    ['const Ver=v2', new Constant('Ver', 'v2')],
  ])('parse', (input, value) => expect(Constant.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
