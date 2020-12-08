import { GenerateAction, parseSchema } from './generateAction'
import * as fs from 'fs'

describe('GenerateAction', () => {
  test('parseSchema', () => {
    const file = fs.realpathSync('./src/actions/test.pt')
    const schema = parseSchema(file)
    console.log(schema)
    expect(schema).not.toBeNull()
  })
})
