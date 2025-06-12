import { env } from "./env.config";
// if(!env.NodeMailEmail){
//   throw new Error('sender Email not found')
// }
// if(env.MAILPASS){
//   throw new Error('Email pass not found')
// }
export default {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.NodeMailEmail,
    pass: env.MAILPASS,
  },
};
