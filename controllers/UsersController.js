import DbClient from '../utils/db';

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
}

module.exports = UsersController;
