import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      req.user = decoded.id;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token is Invalid" });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something Went Wrong While Validating the Token",
    });
  }
};

const adminOnly = (req, res, next) => {
  const token = req.cookies["token"];

  const adminSecretKey = "lord";

  if (!token)
    
    return res.status(403).json({
      success: false,
      message: "Only Admin can access this route",
    });

  const jwtData = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = jwtData.secretKey === adminSecretKey;

  if (!isMatched)
    return res.status(403).json({
      success: false,
      message: "Only Admin can access this route",
    });

  next();
};

const socketAuthenticator = async (socket, next) => {
  try {
    const authToken = socket.request.cookies["token"];
    if (!authToken) {
      return next(new Error("Authentication token is missing"));
    }

    // console.log({ authToken, token: process.env.JWT_SECRET });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment configuration");
      return next(new Error("Internal server error"));
    }

    const decodedData = await jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await UserModel.findById(decodedData.id);
    // console.log({ user, decodedData });

    if (!user) {
      return next(new Error("Invalid token or user does not exist"));
    }

    socket.user = user;
    console.log("User authenticated:", user._id);

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new Error("Authentication token has expired"));
    } else if (error.name === "JsonWebTokenError") {
      return next(new Error("Invalid authentication token"));
    } else {
      console.error("Authentication error:", error);
      return next(new Error("Authentication failed"));
    }
  }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
