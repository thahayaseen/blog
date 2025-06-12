import dotenv from "dotenv";
dotenv.config();
console.log(process.env.REDIS_URL,'redis url is ');

export const env = {
  get PORT() {
    return process.env.PORT || 4000;
  },
  get MONGO_URL() {
    return process.env.MONGO_URL;
  },
  get JWT_ACCESS_SECRET() {
    console.log(process.env.JWT_REFRESH_SECRET);

    return process.env.JWT_ACCESS_SECRET;
  },
  get JWT_REFRESH_SECRET() {
    console.log(process.env.JWT_REFRESH_SECRET);

    return process.env.JWT_REFRESH_SECRET;
  },
  get Redis_url() {
    return process.env.REDIS_URL;
  },
  get AccessTime() {
    return Number(process.env.ACCESSTIME);
  },
  get RefresTime() {
    return Number(process.env.REFRESHTIME);
  },
  get MAILPASS() {
    return process.env.MAILPASS;
  },
  get NodeMailEmail(){
    return process.env.NODEMAILEMAIL
  },
  get BCRYPTSALT(){
    return process.env.BCRYPTSALT
  }
};
