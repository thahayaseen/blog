import z from "zod";
export const otpSchema = z.object({
  userid: z.string(),
  otp: z.string(),
});
