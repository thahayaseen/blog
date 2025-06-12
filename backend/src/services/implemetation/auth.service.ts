import { IUserModel } from "@/model/user.model";
import { IauthInterface } from "../interface/Iauth.service";
import RedisUseCases from "./redis.service";
import PrRedis from "@/provider/implementation/redis.provider";
import { UserRepository } from "@/config/user.repository.config";
import { createHttpError } from "@/utils/httpError.utill";
import { HttpResponse, HttpStatus } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import { LogintockenRetuern, UsercreateReturn } from "types/auth.userreturn";

import { BcryptService, mailService } from "@/config/services.config";
import { redisService } from "@/config/services.config";
import { jwtTockenProvider } from "@/config/jwt.confit";
import { uniqueusername } from "@/utils/username.util";
export class authService implements IauthInterface {
  async create(data: IUser): Promise<UsercreateReturn> {
    const isaldredy = await this.findUserByemail(data.email);
    if (isaldredy) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
    }
    const userid = uuidv4();
    data.username = uniqueusername(data.name);
    data.password = await BcryptService.hash(data.password);
    const save = await redisService.storeUser(userid, data, 30000);
    const otp = await redisService.exexute(userid);
    await mailService.otpsent({
      name: data.name,
      useEmail: data.email,
      otp: otp,
    });
    return { userid };
  }
  async findUserByemail(email: string) {
    return await UserRepository.findOne({
      email: email,
    });
  }
  async varifyUser(uid: string, otp: number): Promise<IUserModel> {
    const userotp = await redisService.getotp(uid);
    if (!userotp) {
      const isthere = await redisService.FindData(uid);
      if (isthere) {
        throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.OTP_EXPIRED);
      }
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);
    }
    if (Number(userotp) != otp) {
      throw createHttpError(
        HttpStatus.UNAUTHORIZED,
        HttpResponse.OTP_INCORRECT
      );
    }
    const userData = await redisService.FindData(uid);
    if (!userData) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    return await UserRepository.create(userData);
  }
  async signIn(email: string, password: string): Promise<LogintockenRetuern> {
    const udata = await this.findUserByemail(email);
    if (!udata || !udata.password) {
      throw createHttpError(HttpStatus.BAD_REQUEST, "User Not found");
    }
    const checkPassword = await BcryptService.compare(password, udata.password);
    if (!checkPassword) {
      throw createHttpError(
        HttpStatus.UNAUTHORIZED,
        HttpResponse.PASSWORD_INCORRECT
      );
    }
    const accessToken = jwtTockenProvider.accsessToken({
      id: udata._id,
      email: udata.email,
    });
    const refreshToken = await jwtTockenProvider.RefreshToken({
      id: udata._id,
      email: udata.email,
    });
    return {
      accessTocken: accessToken,
      refreshTocken: refreshToken,
      user: { name: udata.name, email: udata.email, username: udata.username },
    };
  }
  async resendOtp(userid: string): Promise<string> {
    const user = await redisService.FindData(userid);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    const otp = await redisService.reOtp(userid);
    await mailService.otpsent({
      name: user.name,
      useEmail: user.email,
      otp: otp,
    });
    return userid;
  }
  async googleLogin(data: IUser): Promise<LogintockenRetuern> {
    const isaldredy = await this.findUserByemail(data.email);
    if (isaldredy) {
      if (isaldredy.gid == data.gid) {
        const accessToken = await jwtTockenProvider.accsessToken({
          email: isaldredy.email,
          name: isaldredy.name,
        });
        const refreshToken = await jwtTockenProvider.RefreshToken({
          email: isaldredy.email,
          name: isaldredy.name,
        });
        return { accessTocken: accessToken, refreshTocken: refreshToken };
      } else {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          HttpResponse.UNAUTHORIZED
        );
      }
    } else {
      await UserRepository.create(data);
      const accessToken = await jwtTockenProvider.accsessToken({
        email: data.email,
        name: data.name,
      });
      const refreshToken = await jwtTockenProvider.RefreshToken({
        email: data.email,
        name: data.name,
      });
      return { accessTocken: accessToken, refreshTocken: refreshToken };
    }
  }
}
