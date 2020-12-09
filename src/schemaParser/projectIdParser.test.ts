import { projectIdParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { ProjectId } from '../schema/projectId'

describe('Parsing project id', () => {
  test.each([
    ['projectId = MyProject', new ProjectId('MyProject')],
    ['projectId = MyProject-dev', new ProjectId('MyProject-dev')],
    ['projectId=MyProject', new ProjectId('MyProject')]
  ])('is succeeded', (input, value) => expect(projectIdParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([
    ['projectId =', '/^[\\S]+/ is not match', ''],
    ['projectId: MyProject', 'expect: =', ': MyProject'],
    ['projectId = My Project', '', 'Project']
  ])('is failed', (input, message, next) =>
    expect(projectIdParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
