import { HttpResponse, HttpStatus } from "@/constants";
import formatZodErrors from "@/utils/zod.util";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const Zodvalidate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("ok", req.body);
      schema.parse({ ...req.body });

      next();
    } catch (error) {
      console.log("not ok");

      if (error instanceof ZodError) {
        console.error(error);
        res.status(HttpStatus.BAD_REQUEST).json({
          error: HttpResponse.INVALID_CREDENTIALS,
          details: formatZodErrors(error),
        });
        return;
      }
    }
  };
