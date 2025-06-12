import { diskStorage } from "multer";
import path from "path";
export const storage = diskStorage({
  destination: function (req, file, cb) {
   cb(null, path.join("public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
