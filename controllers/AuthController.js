import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import DbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  // eslint-disable-next-line consistent-return
  static async getConnect(req, res) {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith('Basic')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const b64Cred = authHeaders.split(' ')[1];
    const decodedCred = Buffer.from(b64Cred, 'base64').toString('utf-8');
    const [email, password] = decodedCred.split(':');
    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const hashedPwd = sha1(password);
    try {
      const user = await DbClient.db.collection('users').findOne({ email, password: hashedPwd });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const token = uuidv4();
      await redisClient.set(`auth_${token}`, user._id.toString(), 86400);

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
    }
  }

  static async getDisconnect(req, res) {
    const getToken = req.headers['x-token'];
    console.log(req.headers);
    if (!getToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await redisClient.del(getToken);
    return res.status(204).json();
  }
}

module.exports = AuthController;
