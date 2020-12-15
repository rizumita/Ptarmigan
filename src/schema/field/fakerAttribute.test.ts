import { ParseSuccess } from '../../parser/parseResult'
import { FakerAttribute } from './fakerAttribute'

describe('FakerAttribute', () => {
  test.each([
    ['{{random.word}}', new FakerAttribute('random.word'), ''],
    ['{{random.word}} ', new FakerAttribute('random.word'), ' '],
  ])('parse', (input, value, next) =>
    expect(FakerAttribute.parser.parse(input)).toStrictEqual(new ParseSuccess(value, next))
  )
})
