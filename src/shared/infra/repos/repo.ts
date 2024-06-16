import { Collection, MongoClient, type Document } from 'mongodb';

export abstract class Repo<T extends Document = Document> {
  abstract collectionName: string;
  
  client = new MongoClient(process.env.MONGODB_URL as string);

  get collection(): Collection<T> {
    const db = this.client.db();
    return db.collection(this.collectionName);
  }
}
