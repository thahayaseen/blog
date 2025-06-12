import { RServer } from '../../config/redis.confit';
import { IRedis } from '../interface/redis.provider';


export default class PrRedis implements IRedis {
  private redis;
  constructor() {
    this.redis = RServer;

    this.redis.on("error", (err) => {
      console.error("Redis Error:", err);
    });

    this.redis
      .connect()
      .then(() => {
        console.log("redis connected success");
      })
      .catch((err) => {
        console.log("Redis : ", err);
      });
  }
  async storeOtp(
    userId: string,
    otp: number,
    expirySeconds: number
  ): Promise<void> {
    await this.redis.setEx(`otp:${userId}`, expirySeconds, otp.toString());
  }

  async getotp(userId: string): Promise<string | null> {
    const otp = await this.redis.get(`otp:${userId}`);
    return otp || null;
  }

  async saveUser(
    userid: string,
    users: string,
    expirySeconds: number
  ): Promise<{ userid: string; users: string }> {
    await this.redis.setEx(`user:${userid}`, expirySeconds, users);

    return { userid, users };
  }
  async getBtId(uId: string): Promise<IUser | null> {
    let data = await this.redis.get(`user:${uId}`);

    if (data) {
      const ans: IUser = JSON.parse(data);

      return ans as IUser;
    }
    return null;
  }
  // ✅ Delete OTP
  async deleteOtp(userId: string): Promise<void> {
    await this.redis.del(`otp:${userId}`);
  }
  async setToken(uId: string, token: string): Promise<string> {
    // const Tocken = await jwt.accsessToken({ userid: uId });
    this.redis.setEx(`Userid:${uId}`, 600, token);
    return token;
  }
  async findTockn(uId: string): Promise<string | null> {
    const data = await this.redis.get(`Userid:${uId}`);
    if (!data) {
      return null;
    }
    return data;
  }
  async deleteUser(Id: string): Promise<void> {
    await this.redis.del(`user:${Id}`);
    return;
  }
}
