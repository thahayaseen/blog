import { HttpResponse, HttpStatus } from "@/constants";
import { IBlogServices } from "@/services/interface/Iblog.service";
import { createHttpError } from "@/utils/httpError.utill";
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "types/userjwt";

export class Blogcontroller {
  constructor(private blogservice: IBlogServices) {}
  async getAllblogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, drafted } = req.query;
      console.log((req as UserRequest).user);
      
      const allblogs = await this.blogservice.getAllBlogs(
        Number(page),
        Number(limit),
        String((req as UserRequest).user.id),
        drafted == "true"
      );
      res.status(HttpStatus.OK).json({
        blogs: allblogs.blogs,
        totalpage: allblogs.totalPages,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
  async addBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const userid = (req as UserRequest).user.id;
      const { title, content } = req.body;
      if (!req.file) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Image requried");
      }
      const addblog = await this.blogservice.createBlogs(
        userid,
        {
          title: title.trim(),
          content: content.trim(),
        },
        req.file
      );
      res.status(HttpStatus.CREATED).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body;
      const { blogid } = req.params;
      const up = await this.blogservice.updateBlog(
        { title, content },
        blogid,
        (req as UserRequest).user.id
      );
      res.status(HttpStatus.OK).json({
        succcess:true,
        message:'Updated'
      })
    } catch (error) {}
  }
  async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogid } = req.params;
      if (!blogid) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Course id not found");
      }
      const deleteBlog = await this.blogservice.deleteBlog(
        blogid,
        (req as UserRequest).user.id
      );
      res.status(HttpStatus.OK).json({
        success: false,
        message: "Blog deleted success",
      });
    } catch (error) {
      next(error);
    }
  }
  async publishBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogid } = req.params;
      if (!blogid) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Course id not found");
      }
      await this.blogservice.blogPublish((req as UserRequest).user.id, blogid);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Successfully published",
      });
    } catch (error) {
      next(error)
    }
  }
  async userGetBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const Blogs = await this.blogservice.getAllBlogs(
        Number(page),
        Number(limit),
        undefined,
        true
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Blog loaded",
        data: Blogs.blogs,
        total: Blogs.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }
  async getBlogByid(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogid } = req.params;
      const data = await this.blogservice.getBlog(blogid);
      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
