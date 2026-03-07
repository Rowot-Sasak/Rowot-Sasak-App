import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  const dbName = db.databaseName;
  const collections = await db.listCollections().toArray();

  res.json({
    database: dbName,
    collections: collections
  });
}