import Otp from "@/utils/otp";

import { jwtTockenProvider } from "@/config/jwt.confit";
import { IRedis } from "@/provider/interface/redis.provider";

// import redis from "../../config/redis";
export default class RedisUseCases {
  constructor(private otprepos: IRedis) {}
  async exexute(userId: string): Promise<string> {
    const isaldredy = await this.otprepos.getotp(userId);
    if (isaldredy) {
      return String(isaldredy);
    }
    const otpEntity = new Otp(userId);
    await this.otprepos.storeOtp(userId, otpEntity.getOtp(), 500);
    return String(otpEntity.getOtp());
  }
  async reOtp(Id: string): Promise<string> {
    let otp = await this.otprepos.getotp(Id);

    if (!otp) {
      otp = await this.exexute(Id);
    }
    return otp;
  }
  async getotp(Id: string) {
    return await this.otprepos.getotp(Id);
  }
  async storeUser(userid:string,users: IUser,time:number) {
    return await this.otprepos.saveUser(userid,JSON.stringify(users),time);
  }
  async FindData(id: string) {
    return await this.otprepos.getBtId(id);
  }
  async createTockens(userId: string): Promise<string> {
    const data = await this.otprepos.findTockn(userId);
    if (data) {
      return data;
    }
    const token=jwtTockenProvider.accsessToken({userId})
    return this.otprepos.setToken(userId,token);
  }
  async Udelete(id: string) {
    await this.otprepos.deleteUser(id);
  }
  async Otpdelete(id: string) {
    await this.otprepos.deleteOtp(id);
  }
}
