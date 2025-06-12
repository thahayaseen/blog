import { env } from "@/config/env.config";
import bcrypt from "bcrypt";
const BCRYPT = env.BCRYPTSALT;
if (!BCRYPT) {
  throw new Error("Bcrypt env not found");
}
export class BcryptProvider implements IBcryptProvider {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, Number(BCRYPT));
  }
  compare(password: string, hashedpassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedpassword);
  }
}
