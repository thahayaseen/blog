import { BlogController } from "@/config/controller/authcontrolelr.config";
import { uploads } from "@/config/multer.confit";
import { Zodvalidate } from "@/middleware/validate.middleware";
import varifyTocken from "@/middleware/varify-tocken";
import { blogSchema } from "@/schema/blog/blog.schema";
import { blogUpdateSchema } from "@/schema/blog/blogupdate.schema";
import { Router } from "express";
const router = Router();

router.get(
  "/",
  //   varifyTocken("user"),
  BlogController.userGetBlogs.bind(BlogController)
);
router.get(
  "/my-blogs",
  varifyTocken("user"),
  BlogController.getAllblogs.bind(BlogController)
);
router.get("/:blogid", BlogController.getBlogByid.bind(BlogController));

router.post(
  "/add",
  varifyTocken("user"),
  uploads.single("blogimage"),
  Zodvalidate(blogSchema),
  BlogController.addBlog.bind(BlogController)
);
router.post(
  "/update/:blogid",
  uploads.single("blogimage"),
  varifyTocken("user"),
  Zodvalidate(blogUpdateSchema),
  BlogController.updateBlog.bind(BlogController)
);
router.put(
  "/publish/:blogid",
  varifyTocken("user"),
  BlogController.publishBlog.bind(BlogController)
);
router.delete(
  "/:blogid",
  varifyTocken("user"),
  BlogController.deleteBlog.bind(BlogController)
);

export default router;
