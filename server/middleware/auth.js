import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
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

  const adminSecretKey = "adminTheLeader";

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

export { isAuthenticated, adminOnly };
