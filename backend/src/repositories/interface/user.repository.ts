import { IUserModel } from "@/model/user.model";
import { BaseRepository } from "../base.repositories";

export interface IuserRepository extends BaseRepository<IUserModel>{
  updatePassword(
    userid: string,
    hashedPassword: string
  ): Promise<IUserModel | null>;
}
