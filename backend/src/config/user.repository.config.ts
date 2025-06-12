import { BlogRepository } from './../repositories/implementaion/blog.repository';
import { userModel } from "@/model/user.model";
import { userRepository } from "./../repositories/implementaion/user.repository";
import { MailServices } from "@/services/implemetation/nodemail.service";
import nodemailProvider from '@/provider/implementation/nodeMail.provider' 
export const UserRepository = new userRepository();
export const nodemailProvide=new nodemailProvider()
export const Blogrepository=new BlogRepository()