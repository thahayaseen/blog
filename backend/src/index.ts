import expres from "express";
const app = expres();
import { connectDB } from "./config";
import { errorHandler } from "./middleware/error-handle.middleware";
import ApiRoute from "@/router/main.route";
import morgan from "morgan";
import cors from "cors";
connectDB();
app.use(morgan("dev"));
app.use(cors({
  origin: 'http://localhost:5173', // React app URL
  credentials: true, // allow cookies to be sent
}));
app.use(expres.static("public"));
app.use(expres.json());
app.use("/api", ApiRoute);
app.use(errorHandler);
app.listen(4050, () => {
  console.log("server on");
});
