import { ParseSuccess } from '../../parser/parseResult'
import { FakeGenerate } from './fakeGenerate'

describe('FakeGenerate', () => {
  test.each([['generate 20', new FakeGenerate(20)]])('parse', (input, value) =>
    expect(FakeGenerate.parser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )
})
