import { Router } from "express";

import { AuthRouterController } from "@/config/controller/authcontrolelr.config";
import { Zodvalidate } from "@/middleware/validate.middleware";
import { signUpSchema } from "@/schema/signup.schema";
import { otpSchema } from "@/schema/otp.schema";
import { signIn } from "@/schema/sigin.schema";
const router = Router();

router.post(
  "/signup",
  Zodvalidate(signUpSchema),
  AuthRouterController.createAccount.bind(AuthRouterController)
);
router.post(
  "/otp",
  Zodvalidate(otpSchema),
  AuthRouterController.OtpVarify.bind(AuthRouterController)
);
router.post(
  "/signin",
  Zodvalidate(signIn),
  AuthRouterController.login.bind(AuthRouterController)
);
router.get('/resendotp',AuthRouterController.resendOtp.bind(AuthRouterController))
export default router;
