import PrRedis from "@/provider/implementation/redis.provider";
import { authService } from "@/services/implemetation/auth.service";
import RedisUseCases from "@/services/implemetation/redis.service";
import {
  Blogrepository,
  nodemailProvide,
  UserRepository,
} from "./user.repository.config";
import { MailServices } from "@/services/implemetation/nodemail.service";
import { BcryptProvider } from "@/provider/implementation/bcrypt.provider";
import JwtService from "@/services/implemetation/jwt.service";
import { env } from "./env.config";
import { BlogService } from "@/services/implemetation/blog.service";
export const AuthService = new authService();
export const redisProvider = new PrRedis();
export const redisService = new RedisUseCases(redisProvider);
export const mailService = new MailServices(nodemailProvide);
export const BcryptService = new BcryptProvider();
export const Blogservice = new BlogService(Blogrepository, UserRepository);
