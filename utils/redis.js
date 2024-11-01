const redis = require('redis');

class redisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => { console.log('this is the error', err); });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return new Promise((res, rej) => {
      this.client.get(key, (err, val) => {
        if (err) {
          rej(err);
        } else {
          res(val);
        }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((res, rej) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          rej(err);
        } else { res(); }
      });
    });
  }

  async del(key) {
    return new Promise((res, rej) => {
      this.client.del(key, (err) => {
        if (err) {
          rej(err);
        } else { res(); }
      });
    });
  }
}

// eslint-disable-next-line new-cap
module.exports = new redisClient();
