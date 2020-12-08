import { TypedValue } from '../parser/typedParser'

export class Generate implements TypedValue {
  json: JSON

  constructor(value: string) {
    this.json = JSON.parse(value)
  }
}
