import { IUserModel, userModel } from "@/model/user.model";
import { BaseRepository } from "../base.repositories";
import { Types } from "mongoose";
import { IuserRepository } from "../interface/user.repository";

export class userRepository
  extends BaseRepository<IUserModel>
  implements IuserRepository
{
  constructor() {
    super(userModel);
  }
  async updatePassword(
    userid: string,
    hashedPassword: string
  ): Promise<IUserModel | null> {
    return await this.findByIdAndUpdate(new Types.ObjectId(userid), {
      password: hashedPassword,
    });
  }
}
