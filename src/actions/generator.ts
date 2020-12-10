import * as admin from 'firebase-admin'
import { Schema } from '../schema/schema'
import assert from 'assert'
import { firestore } from 'firebase-admin/lib/firestore'
import Firestore = firestore.Firestore
import { CollectionType } from '../schema/collectionType'
import { Constant } from '../schema/constant'

export class Generator {
  schema: Schema
  db: Firestore

  constructor(schema: Schema) {
    console.log(schema)
    assert(schema.projectId?.value != null)

    this.schema = schema

    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
    admin.initializeApp({ projectId: schema.projectId.value })
    this.db = admin.firestore()
  }

  async generate() {
    for (const collection of this.schema.collections) {
      await this.generateCollection(collection, '')
    }
  }

  private async generateCollection(collection: CollectionType, basePath: string) {
    for (const document of collection.documents) {
      if (document.fake != null) {
      }

      if (document.generate != null) {
        const docs: { [id: string]: any } = document.generate.json

        for (let id in docs) {
          const doc = docs[id]
          id = Constant.isConstant(id) ? this.schema.getConstant(id) : id
          await this.db
            .collection(basePath + '/' + collection.path)
            .doc(id)
            .set(doc)

          if (document.collections.length == 0) continue

          for (let subCollection of document.collections) {
            await this.generateCollection(subCollection, basePath + '/' + collection.path + '/' + id)
          }
        }
      }
    }
  }
}
