import { MongoClient, type Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'om_technical';

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable. See .env.example.');
}

// Fail fast instead of hanging when the database is unreachable — public
// pages catch connection errors and fall back to empty state rather than
// blocking the response (or, at build time, the whole `next build`).
const options = { serverSelectionTimeoutMS: 5000 };

// Cache the client across hot-reloads in dev and across invocations in
// serverless prod, so we don't open a new connection per request.
const globalForMongo = globalThis as unknown as { _mongoClientPromise?: Promise<MongoClient> };

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  clientPromise = globalForMongo._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri, options).connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
