

import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { auth, IJwtService } from "types/Ijwt.types";
import { createHttpError } from "@/utils/httpError.utill";
import { HttpResponse, HttpStatus } from "@/constants";

interface AuthServises {
  error?: string;
  user?: string;
}

export default class JwtService implements IJwtService {
  constructor(
    private secretKey: string,
    private accTime: number,
    private RefreshKey: string,
    private refreshTime: number
  ) {}
  async exicute(payload: object): Promise<auth> {
    try {
      return {
        access: this.accsessToken(payload),
        refresh: this.RefreshToken(payload),
      };
    } catch (error) {
      throw createHttpError(
        HttpStatus.UNAUTHORIZED,
        error instanceof Error ? error.message : "Unable to varify token"
      );
    }
  }
  accsessToken(payload: object) {
    try {
      return jwt.sign(payload, this.secretKey, {
        expiresIn: `${this.accTime}m`,
      });
    } catch (error) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error instanceof Error
          ? error.message
          : HttpResponse.USER_CREATION_FAILED
      );
    }
  }
  RefreshToken(payload: object) {
    return jwt.sign(payload, this.RefreshKey, {
      expiresIn: `${this.refreshTime}d`,
    });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secretKey) as JwtPayload;
    } catch (error) {
      throw createHttpError(HttpStatus.UNAUTHORIZED,'Cannot varify User')
    }
  }
}
