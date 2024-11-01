import { MongoClient } from 'mongodb';

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const { DB_HOST } = process.env || 'localhost';
const { DB_PORT } = process.env || 27017;
const { DB_DATABASE } = process.env || 'files_manager';

class DbClient {
  constructor() {
    const url = `mongodb://${DB_HOST}:${DB_PORT}`;
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    this.client.connect()
      .then(() => {
        console.log('connected successfully');
        this.db = this.client.db(DB_DATABASE);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  isAlive() {
    return this.client && this.client.isConnected();
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

export default new DbClient();
