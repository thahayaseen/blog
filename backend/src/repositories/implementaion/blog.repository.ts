import { ObjectId } from "mongoose";

import { IBlog } from "types/Imodels";
import { BaseRepository } from "../base.repositories";
import { IBlogRepository } from "../interface/blog.repository";
import Blog from "@/model/blog.model";

export class BlogRepository
  extends BaseRepository<IBlog>
  implements IBlogRepository
{
  constructor() {
    super(Blog);
  }


}
