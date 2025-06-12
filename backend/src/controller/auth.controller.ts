import { HttpResponse, HttpStatus } from "@/constants";
import { IauthInterface } from "@/services/interface/Iauth.service";
import { createHttpError } from "@/utils/httpError.utill";
import { NextFunction, Request, Response } from "express";

export class authcontroller {
  constructor(private authService: IauthInterface) {}
  async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const data = await this.authService.create({
        email,
        name,
        password,
      });
      res.status(HttpStatus.CREATED).json({
        uid: data.userid,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
  async OtpVarify(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, userid } = req.body;
      console.log(otp,userid);
      
      await this.authService.varifyUser(userid, otp);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "user varified",
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await this.authService.signIn(email, password);
      res.cookie("refreshTocken", data.refreshTocken);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "login success",
        access: data.accessTocken,
        user: data.user,
      });
    } catch (error) {
      next(error);
    }
  }
  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.query;
      console.log(uid, "uid");

      if (!uid) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          HttpResponse.INVALID_CREDENTIALS
        );
      }
      await this.authService.resendOtp(String(uid));
    } catch (error) {
      next(error);
    }
  }
  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as Partial<IUser>;
      if (!data.gid) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          HttpResponse.UNAUTHORIZED
        );
      }
      const { accessTocken, refreshTocken } =
        await this.authService.googleLogin(data);
      res.cookie("refreshToken", refreshTocken);
      res.status(HttpStatus.OK).json({
        success: true,
        accessTocken,
      });
    } catch (error) {
      next(error);
    }
  }
}
