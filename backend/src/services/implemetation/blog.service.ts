import { IBlogRepository } from "@/repositories/interface/blog.repository";
import { IuserRepository } from "@/repositories/interface/user.repository";
import { Types } from "mongoose";
import { IBlog } from "types/Imodels";

export class BlogService {
  constructor(
    private _blogRepository: IBlogRepository,
    private _userRepository: IuserRepository
  ) {}
  async getAllBlogs(
    page: number=1,
    limit: number=10,
    userId?: string,
    isPublished?: boolean
  ): Promise<{
    blogs: IBlog[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const query: any = { isPublished };
      console.log(userId);
      
      if (userId) {
        query.userId = new Types.ObjectId(userId);
        delete query.isPublished
      }
console.log(query,'qury is ');

      const { data, total } = await this._blogRepository.find(
        query,
        page,
        limit
      );

      const formattedBlogs = data.map((blog) => ({
        ...blog.toObject?.(),
        content: blog.content.slice(0, 100), // Truncate content for previews
      }));

      return {
        blogs: formattedBlogs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || "Error in GetAllBlogs BlogService");
    }
  }
  async createBlogs(
    userId: string,
    blogData: Partial<IBlog>,
    file: Express.Multer.File
  ): Promise<{ msg: string; ok: boolean; blog: IBlog }> {
    const { title, content } = blogData;

    if (!title || !content) {
      throw new Error("Title and content must be provided");
    }

    // const imageUrl = await CloudinaryService.uploadImage(file);
    // if (!imageUrl) {
    //   throw new Error("Image upload failed");
    // }

    const blogPayload = {
      title: title.trim(),
      content: content.trim(),
        imageUrl:file.filename,
      userId,
    };

    const createdBlog = await this._blogRepository.create(blogPayload);

    return {
      ok: true,
      msg: "Blog created successfully",
      blog: createdBlog,
    };
  }
  MakeObjectId(valule: string) {
    return new Types.ObjectId(valule);
  }
  async getBlog(
    blogId: string
  ): Promise<{ ok: boolean; msg: string; blog?: IBlog }> {
    const blog = await this._blogRepository.findById(this.MakeObjectId(blogId));
    if (!blog) {
      throw new Error("Cannot find Blog");
    }
    return { ok: false, msg: "Blog Details fetched successfully", blog };
  }
  async updateBlog(
    blogData: Partial<IBlog>,
    blogId: string,
    userId: string,
    file?: Express.Multer.File
  ): Promise<{ ok: boolean; msg: string; blog?: IBlog }> {
    const user = await this._userRepository.findById(this.MakeObjectId(userId));
    if (!user) {
      throw new Error("Invalid Credential: User not found");
    }

    const updateData: Partial<IBlog> = {
      ...blogData,
      userId,
    };

    if (file) {
      const imageUrl = file.filename;
      if (!imageUrl) {
        throw new Error("Error uploading in image");
      }
      updateData.imageUrl = imageUrl; // Assign uploaded image URL
    }

    const updatedBlog = await this._blogRepository.update(
      this.MakeObjectId(blogId),
      updateData
    );
    if (!updatedBlog) {
      throw new Error("Error updating blog");
    }

    return {
      ok: true,
      msg: "Blog updated successfully",
      blog: updatedBlog,
    };
  }
  async deleteBlog(
    blogId: string,
    userId: string
  ): Promise<{ ok: boolean; msg: string }> {
    const blog = await this._blogRepository.findById(this.MakeObjectId(blogId));

    if (!blog) {
      throw new Error("Blog not found");
    }

    if (
      typeof blog.userId === "object" &&
      blog.userId !== null &&
      "_id" in blog.userId &&
      (blog.userId as any)._id.toString() !== userId
    ) {
      throw new Error("You are not authorized to delete this blog");
    }
    const deleted = await this._blogRepository.delete(
      this.MakeObjectId(blogId)
    );
    if (!deleted) {
      throw new Error("Failed to delete blog");
    }
    return { ok: true, msg: "Blog deleted successfully" };
  }
  async blogPublish(
    userId: string,
    blogId: string
  ): Promise<{ ok: boolean; msg: string }> {
    const user = await this._userRepository.findById(this.MakeObjectId(userId));
    if (!user) {
      throw new Error("User Not Fount");
    }
    const update = await this._blogRepository.update(
      this.MakeObjectId(blogId),
      {
        isPublished: true,
      }
    );
    if (!update) {
      throw new Error("Cannont find the BlogId");
    }
    return { ok: true, msg: "Blog Published Successfully" };
  }
}
