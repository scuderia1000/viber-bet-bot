import { Db, MongoClient } from 'mongodb';
import logger from '../../util/logger';
import { DB } from '../../const';

export const connectDb = async (dbName: string = DB.DEFAULT_NAME): Promise<Db> => {
  const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;
  const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const connection = await client.connect();
  const db = connection.db(dbName);
  console.log('Connected successfully to DB server');
  return db;
};

export default connectDb;
