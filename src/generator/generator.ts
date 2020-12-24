import * as admin from 'firebase-admin'
import { DocumentId } from '../schema/documentId'
import { AutoIncrementFieldType } from '../schema/field/autoIncrementFieldType'
import { Schema } from '../schema/schema'
import assert from 'assert'
import { firestore } from 'firebase-admin/lib/firestore'
import Firestore = firestore.Firestore
import { Collection } from '../schema/collection'

export class Generator {
  schema: Schema
  db: Firestore

  constructor(schema: Schema) {
    assert(schema.projectId?.value != null)

    this.schema = schema

    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
    admin.initializeApp({ projectId: schema.projectId.value })

    process.stdout.write('Project id: ' + schema.projectId.value + '\n')

    this.db = admin.firestore()
  }

  async generate(): Promise<void> {
    process.stdout.write('generating...\n')
    eval(`var faker = require('faker');faker.locale = "${this.schema.locale.name}"`)

    for (const collection of this.schema.collections) {
      await this.generateDocuments(collection, '')
    }
  }

  private async generateDocuments(collection: Collection, basePath: string) {
    const collectionPath = basePath + '/' + collection.path

    for (const document of collection.documents) {
      const documentType = this.schema.documentType.find(value => value.name == document.name)
      const predefinedFields = documentType?.fields ?? []
      const documentId = document.id ?? documentType?.id ?? new DocumentId(new AutoIncrementFieldType('string', 1))
      const idLength = documentId.length

      for (const generate of document.generates) {
        const docLength = generate.length
        const length = Math.min(idLength, docLength)

        const docs: { [key: string]: any }[] = generate.docs(document.fields.concat(predefinedFields))

        for (let i = 0; i < length; i++) {
          const id = documentId.id(v => String(this.schema.getConstant(v)))
          const data = docs[i]
          const doc = this.db.collection(collectionPath).doc(id)
          await doc.set(data)

          for (const subCollection of document.collections) {
            await this.generateDocuments(subCollection, collectionPath + '/' + id)
          }
        }
      }
    }
  }
}
