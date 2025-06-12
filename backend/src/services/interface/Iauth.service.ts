import { IUserModel } from "@/model/user.model";
import { LogintockenRetuern, UsercreateReturn } from "types/auth.userreturn";

export interface IauthInterface {
  create(data: Partial<IUser>): Promise<UsercreateReturn>;
  varifyUser(uid: string, otp: number): Promise<IUserModel>;
  signIn(email: string, password: string): Promise<LogintockenRetuern>;
  resendOtp(userid: string): Promise<string>;
  googleLogin(data: Partial<IUser>): Promise<LogintockenRetuern>;
}
