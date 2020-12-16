import { ParseSuccess } from '../../parser/parseResult'
import { AutoIncrementFieldType } from './autoIncrementFieldType'

describe('AutoIncrementAttribute', () => {
  test.each([
    ['int%{auto}', 1, ''],
    ['int % {auto:1}', 1, ''],
  ])('parse', (input, value, next) =>
    expect(AutoIncrementFieldType.parser.parse(input)).toStrictEqual(
      new ParseSuccess(new AutoIncrementFieldType('int', value), next)
    )
  )

  test.each([
    [1, [1, 2]],
    [100, [100, 101]],
  ])('get data', (value, data) => {
    const attr = new AutoIncrementFieldType('string', value)
    expect([attr.data(), attr.data()]).toEqual(data)
  })
})
