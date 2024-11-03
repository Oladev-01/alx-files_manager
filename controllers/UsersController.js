import DbClient from '../utils/db';
import redisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

const sha1 = require('sha1');

class UsersController {
  // eslint-disable-next-line consistent-return
  static async postNew(req, res) {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }
      const userExist = await DbClient.db.collection('users').findOne({ email });
      if (userExist) {
        return res.status(400).json({ error: 'Already exist' });
      }
      const hashedPwd = sha1(password);
      const result = await DbClient.db.collection('users').insertOne({
        email,
        password: hashedPwd,
      });
      console.log(result.insertedId);
      return res.status(201).json({ id: result.insertedId, email });
    } catch (err) {
      console.error(err);
    }
  }

  static async getMe(req, res) {
    const getToken = req.headers['x-token'];
    if (!getToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = await redisClient.get(`auth_${getToken}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await DbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
    return res.status(200).json({ email: user.email, id: userId });
  }
}

module.exports = UsersController;
