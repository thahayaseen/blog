import JwtService from "@/services/implemetation/jwt.service";

import { env } from "./env.config";
const accesskey =
  env.JWT_ACCESS_SECRET || "jkdfha;keypoqiweljfpadohivpasiud7iurqw";
const refresh = env.JWT_ACCESS_SECRET || "qqr3io4rhnfpq349ufr89q3oui489";
const accessTime = env.AccessTime || (15 as number);
const refreshTime = env.RefresTime || 7;
export const jwtTockenProvider = new JwtService(
  accesskey,
  accessTime,
  refresh,
  refreshTime
);
