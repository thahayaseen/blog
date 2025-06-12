import redis, { createClient } from 'redis'
import { env } from './env.config'
const redisUrl=env.Redis_url
if(!redisUrl){
    throw new Error('Cannot found redis url')
}
export const RServer=createClient({
    url:redisUrl
})