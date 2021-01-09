import { Db, MongoClient } from 'mongodb';
import { DB } from '../const';
import { getLogger } from '../util/logger';

const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
let db: Db;

export const connectDb = async (dbName: string = DB.DEFAULT_NAME): Promise<MongoClient> => {
  try {
    const connection = await client.connect();
    db = connection.db(dbName);
    getLogger().debug('Connected successfully to server');
  } finally {
    await client.close();
  }
  return client;
};

export const getDb = (): Db => db;
