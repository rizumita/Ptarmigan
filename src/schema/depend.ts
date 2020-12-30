import { IParser } from '../parser/iParser'
import * as P from '../parser/parser'
import { spaces } from '../parser/utilityParsers'
import fs from 'fs'
import path from 'path'
import { InvalidSchemaError } from './invalidSchemaError'

export class Depend {
  constructor(dependent: string) {
    this.dependent = dependent
  }

  dependent: string

  static get parser(): IParser<Depend> {
    const key = P.double(P.string('depend'), spaces)
    const value = P.match(/.+/)
    return P.map(P.double(key, value), v => new Depend(v[1]))
  }

  getPath(baseSchemaPath: string): string {
    const basePath = path.dirname(baseSchemaPath)
    const filePath = basePath + '/' + this.dependent
    if (fs.existsSync(filePath)) return filePath
    throw new InvalidSchemaError(`${filePath} does not exist`)
  }
}
