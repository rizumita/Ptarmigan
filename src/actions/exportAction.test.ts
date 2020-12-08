import { ExportAction, parseSchema } from './exportAction'
import * as fs from 'fs'

describe('ExportAction', () => {
  test('parseSchema', () => {
    const file = fs.realpathSync('./src/actions/test.pt')
    const schema = parseSchema(file)
    console.log(schema)
    expect(schema).not.toBeNull()
  })
})
