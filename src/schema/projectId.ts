import { TypedValue } from '../parser/typedParser'

export class ProjectId implements TypedValue {
  value: string

  constructor(value: string) {
    this.value = value
  }
}
