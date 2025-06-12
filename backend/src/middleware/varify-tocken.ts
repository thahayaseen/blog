import { Request, Response, NextFunction } from "express";

import { HttpResponse } from "@/constants/responce-message.constants";
import { HttpStatus } from "@/constants/status.constant";
import { createHttpError } from "@/utils/httpError.utill";
import { UserRequest } from "@/utils/httpInterface.utill";
import { jwtTockenProvider } from "@/config/jwt.confit";

export default function (userLevel: "user" | "admin" | "moderator") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      console.log("Authorization Header:", authHeader);

      if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN);
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN);
      }

      const payload = jwtTockenProvider.verifyToken(token) as {
        id: string;
        email: string;
        // role: "user" | "admin" | "moderator";
      };
      // payload.role = "user";
      if (!payload) {
        console.log("Invalid token payload");
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          HttpResponse.TOKEN_EXPIRED
        );
      }

      // if (payload.role !== userLevel) {
      //   throw createHttpError(
      //     HttpStatus.UNAUTHORIZED,
      //     HttpResponse.UNAUTHORIZED
      //   );
      // }

      (req as UserRequest).user = {
        id: payload.id,
        email: payload.email,
        // role: payload.role,
      };

      // console.log("User payload:", req.user);

      req.headers["x-user-payload"] = JSON.stringify(payload);
      next();
    } catch (error) {
      next(error);
    }
  };
}
