import { GenerateAction } from './generateAction'
import * as fs from 'fs'
import { Generator } from './generator'

describe('GenerateAction', () => {
  test('parseSchema', () => {
    const generateSpy = jest.spyOn(Generator.prototype, 'generate').mockReturnThis()

    const file = fs.realpathSync('./src/actions/test.pt')
    const action = new GenerateAction(file, null)
    action.execute()
    expect(generateSpy).toHaveBeenCalled()
  })
})
