import { Blogcontroller } from "./../../controller/blog.controller";
import { authcontroller } from "@/controller/auth.controller";
import { AuthService, Blogservice } from "../services.config";

export const AuthRouterController = new authcontroller(AuthService);

export const BlogController = new Blogcontroller(Blogservice);
