import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import adminRoutes from "./routes/admin.js";
import { initializeSocket } from "./socket/socket.js";

dotenv.config();

import { cloudinaryConnect } from "./config/cloudinary.js";
import { connectDB } from "./config/databse.js";
import { corsOptions } from "./config/cors.js";

const app = express();
const server = http.createServer(app);
export const userSocketIDs = new Map();

const port = process.env.PORT || 3000;

connectDB();
cloudinaryConnect();
initializeSocket(server);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

server.listen(port, () => {
  console.log(`app running on ${port}`);
});
