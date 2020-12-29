import { firestore } from 'firebase-admin/lib/firestore'
import Timestamp = firestore.Timestamp

export function parseFieldType(value: unknown, type: string): unknown {
  if (typeof value === 'string') {
    if (type === 'int') {
      return parseInt(value)
    } else if (type === 'float' || type === 'double') {
      return parseFloat(value)
    } else if (type === 'bool' || type === 'boolean') {
      return value === 'true'
    }
  }

  if (value instanceof Date && type === 'timestamp') {
    return Timestamp.fromDate(value)
  }

  return value
}
