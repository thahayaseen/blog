import mongoose from 'mongoose'
import { env } from './env.config'
export async function connectDB() {
  const MONGO_URL = env.MONGO_URL as string;
  if(!MONGO_URL){
    throw new Error('Mongourl Not found')
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to mongodb 🚀");
  } catch (error) {
    console.log("Mongo Error, ", error);
  }
}
