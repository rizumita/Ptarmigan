import * as admin from 'firebase-admin'
import { Schema } from '../schema/schema'
import assert from 'assert'
import { firestore } from 'firebase-admin/lib/firestore'
import Firestore = firestore.Firestore
import { CollectionType } from '../schema/CollectionType'
import { InvalidSchemaError } from '../schema/invalidSchemaError'
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
    if (collection.fake != null) {
    }

    if (collection.generate != null) {
      const docs: { [id: string]: any } = collection.generate.json

      for (let id in docs) {
        const doc = docs[id]
        id = Constant.isConstant(id) ? this.schema.getConstant(id) : id
        await this.db
          .collection(basePath + '/' + collection.path)
          .doc(id)
          .set(doc)

        if (collection.document.collection == null) return

        await this.generateCollection(collection.document.collection, basePath + '/' + collection.path + '/' + id)
      }
    }
  }
}
