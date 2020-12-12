import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { ProjectId } from './projectId'

describe('ProjectId', () => {
  test.each([
    ['projectId = MyProject', new ProjectId('MyProject')],
    ['projectId = MyProject-dev', new ProjectId('MyProject-dev')],
    ['projectId=MyProject', new ProjectId('MyProject')],
  ])('parse successfully', (input, value) =>
    expect(ProjectId.parser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([
    ['projectId =', ' is not match', ''],
    ['projectId: MyProject', ': MyProject is not match', ': MyProject'],
    ['projectId = My Project', ' Project is not match', ' Project'],
  ])('parse unsuccessfully', (input, message, next) =>
    expect(ProjectId.parser.parse(input)).toStrictEqual(new ParseFailure<ProjectId>(message, next))
  )
})
