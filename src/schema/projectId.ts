import * as P from '../parser/parser'
import { IParser } from '../parser/iParser'
import { spaces } from '../parser/utilityParsers'

export class ProjectId {
  value: string

  constructor(value: string) {
    this.value = value
  }

  static get parser(): IParser<ProjectId> {
    const projectIdKey = P.string('projectId')
    const separator = P.triple(spaces, P.string('='), spaces)
    const key = P.double(projectIdKey, separator)
    const projectIdPattern = P.match(/[\S]+/)
    return P.map(P.triple(key, projectIdPattern, P.end()), v => new ProjectId(v[1]))
  }
}
