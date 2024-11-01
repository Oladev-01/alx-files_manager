import redisClient from '../utils/redis';
import DbClient from '../utils/db';

class AppController {
  static async getStatus(req, res) {
    const redis = redisClient.isAlive();
    const db = DbClient.isAlive();

    res.status(200).json({ redis, db });
  }

  static async getStats(req, res) {
    const users = await DbClient.nbUsers();
    const files = await DbClient.nbFiles();
    res.status(200).json({ users, files });
  }
}

module.exports = AppController;
