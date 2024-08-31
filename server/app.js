import express from "express";
import userRoutes from "./routes/user.js";
// import fileUpload from "express-fileupload";
import { connectDB } from "./config/databse.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
connectDB();
cloudinaryConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", userRoutes);

app.listen(3000, () => {
  console.log("app running ");
});
