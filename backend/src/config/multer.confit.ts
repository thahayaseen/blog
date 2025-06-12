import { storage } from "@/utils/multer.utill";
import multer from "multer";

export const uploads = multer({
  storage: storage,
  // limits: { fileSize: 5 * 1024 * 1024 },
});
