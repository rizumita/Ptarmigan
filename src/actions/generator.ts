import * as admin from 'firebase-admin'
import { Document } from '../schema/document'
import { Schema } from '../schema/schema'
import assert from 'assert'
import { firestore } from 'firebase-admin/lib/firestore'
import Firestore = firestore.Firestore
import { Collection } from '../schema/collection'
import { Constant } from '../schema/constant'
import * as faker from 'faker'
import DocumentData = firestore.DocumentData

export class Generator {
  schema: Schema
  db: Firestore

  constructor(schema: Schema) {
    assert(schema.projectId?.value != null)

    this.schema = schema

    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
    admin.initializeApp({ projectId: schema.projectId.value })
    process.stdout.write('Project id: ' + schema.projectId.value)
    this.db = admin.firestore()
  }

  async generate(): Promise<void> {
    // faker.setLocale(this.schema.locale.name)

    for (const collection of this.schema.collections) {
      await this.generateDocuments(collection, '')
    }
  }

  private async generateDocuments(collection: Collection, basePath: string) {
    const collectionPath = basePath + '/' + collection.path

    for (const document of collection.documents) {
      for (const generate of document.generates) {
        const docs: { [key: string]: any } = generate.docs()

        for (let id in docs) {
          const docData = docs[id]
          id = Constant.isConstant(id) ? this.schema.getConstant(id) : id
          const doc = this.db.collection(collectionPath).doc(id)
          await doc.set(docData)

          for (const subCollection of document.collections) {
            await this.generateDocuments(subCollection, collectionPath + '/' + id)
          }
        }
      }
    }
  }
}
