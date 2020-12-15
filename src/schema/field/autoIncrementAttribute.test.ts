import { ParseSuccess } from '../../parser/parseResult'
import { AutoIncrementAttribute } from './autoIncrementAttribute'

describe('AutoIncrementAttribute', () => {
  test.each([
    ['{auto}', 1, ''],
    ['{auto:1}', 1, ''],
  ])('parse', (input, value, next) =>
    expect(AutoIncrementAttribute.parser.parse(input)).toStrictEqual(
      new ParseSuccess(new AutoIncrementAttribute(value), next)
    )
  )

  test.each([
    [1, [1, 2]],
    [100, [100, 101]],
  ])('get data', (value, data) => {
    const attr = new AutoIncrementAttribute(value)
    expect([attr.data(), attr.data()]).toEqual(data)
  })
})
