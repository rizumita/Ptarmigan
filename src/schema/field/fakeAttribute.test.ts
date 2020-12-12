import { ParseSuccess } from '../../parser/parseResult'
import { FakeAttribute } from './fakeAttribute'

describe('FakeAttribute', () => {
  test.each([
    ['%unique', new FakeAttribute('unique'), ''],
    ['%random.word', new FakeAttribute('random.word'), ''],
    ['%random.word ', new FakeAttribute('random.word'), ' '],
  ])('parse`', (input, value, next) =>
    expect(FakeAttribute.parser.parse(input)).toStrictEqual(new ParseSuccess(value, next))
  )
})
