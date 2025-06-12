import { Request } from "express";

export interface UserRequest extends Request {
  user: {
    id: string;
    // name: string;
    email: string;
    role: "user" | "admin" | "moderator";
  };
}
