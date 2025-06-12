import { Router } from "express";
const route = Router();
import Authrouter from "./auth.route";
import Blogrouter from "./blog.route";
route.use("/auth", Authrouter);
route.use('/blog',Blogrouter)

export default route;
