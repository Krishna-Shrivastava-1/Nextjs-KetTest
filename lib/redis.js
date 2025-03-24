import { createClient } from "redis";
const client = createClient({
    url: 'redis://default:S9Om4xXzqW3GiMSIJWgvboAKQYJiQWki@redis-12592.c264.ap-south-1-1.ec2.redns.redis-cloud.com:12592'
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect()
    .then(() => console.log("Connected to Redis"))
    .catch((err) => console.log("Redis Connection Error:", err));

export {client}
