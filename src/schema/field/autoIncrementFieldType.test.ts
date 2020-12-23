import { ParseSuccess } from '../../parser/parseResult'
import { AutoIncrementFieldType } from './autoIncrementFieldType'

describe('AutoIncrementAttribute', () => {
  test.each([
    ['int%auto', 1, ''],
    ['int % auto', 1, ''],
    ['int%{auto}', 1, ''],
    ['int % {auto:1}', 1, ''],
  ])('parse int', (input, value, next) =>
    expect(AutoIncrementFieldType.parser.parse(input)).toStrictEqual(
      new ParseSuccess(new AutoIncrementFieldType('int', value), next)
    )
  )

  test.each([['bool % {auto}'], ['bool%{auto:1}']])('parse bool', input => {
    const result = AutoIncrementFieldType.parser.parse(input)
    const value = result.tryValue().data()
    expect(typeof value === 'boolean').toBeTruthy()
  })

  test.each([
    [1, [1, 2]],
    [100, [100, 101]],
  ])('get data', (value, data) => {
    const attr = new AutoIncrementFieldType('string', value)
    expect([attr.data(), attr.data()]).toEqual(data)
  })
})
