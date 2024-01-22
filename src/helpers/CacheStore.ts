import redis = require("redis");
import * as _ from "lodash";

let redisClient: any = null;

export module CacheStore {
  export let connect = async () => {
    try {
      redisClient = await redis.createClient({
        url: _.get(process.env, "CACHESTORE_CONNECTION_STRING"),
      });
      redisClient.on("connect", () => {
        console.log("Connected successfully to the Redis store");
        return true;
      });
      redisClient.on("error", (err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  };
  export let get = async (key) => {
    return new Promise((resolve, reject) => {
      redisClient.get(key, (err, val) => {
        if (err){
          reject(JSON.stringify({msg : 'CACHE_ERROR'}))
        }
        else if( val == null) {
          resolve(0);
        } else {
          resolve(JSON.parse(val));
        }
      });
    });
  };
  export let set = async (key, value, ttl?) => {
    if (!ttl || !_.isNumber(ttl)) ttl = 1 * 24 * 60 * 60; //60 days
    try {
      let val = await redisClient.setex(key,ttl, JSON.stringify(value));
      console.log("value token", val);
      return val;
    } catch (error) {
      throw error;
    }
  };
  export let update = async (key, value, ttl?) => {
    if (!ttl || ttl == 0 || !_.isNumber(ttl)) ttl = 1 * 24 * 60 * 60; //60 days
    try {
      let exist_val = redisClient.get(key);
      exist_val = exist_val?JSON.parse(exist_val):{};
      await redisClient.setex(key,ttl, JSON.stringify(_.assign(exist_val, value)));
      return true;
    } catch (error) {
      throw error;
    }
  };
  export let setHash = async (hash, key, value) => {
    try {
      let val = await redisClient.hset(hash, key, value);
      return val;
    } catch (error) {
      throw error;
    }
  };

  export let getHashVal = async (hash, key) => {
    if (key) {
      try {
        let val = await redisClient.hget(hash, key);
        return val;
      } catch (error) {
        throw error;
      }
    } else {
      try {
        let val = await redisClient.hgetall(hash);
        return val;
      } catch (error) {
        throw error;
      }
    }
  };

  export let remove = async (key) => {
    try {
      let val = await redisClient.del(key);
      return val;
    } catch (error) {
      throw error;
    }
  };
}
