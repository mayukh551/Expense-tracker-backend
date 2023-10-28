const path = require('path');
const redis = require('redis');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') }) || require('dotenv').config({ path: '../.env' });

// Redis Cloud Connection based on node environment
const node_env = process.env.NODE_ENV;
console.log(node_env);
var client;

if (['production', 'test'].includes(node_env)) {
    console.log('Connection in production');
    client = redis.createClient({ url: process.env.REDIS_URL });
}

else { console.log('in dev'); client = redis.createClient(); }

client.on('error', err => console.log('Redis Client Error', err));

client.connect().then(() => console.log('Connected to Redis'));

module.exports = client;