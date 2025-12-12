import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(authHeader)

// console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ success: false, msg: "Authentication failed" });
    }

    const token = authHeader.split(" ")[1].trim();

    if (!token) {
      return res.status(403).json({ success: false, msg: "Token expired or not found" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded);

    req.userId = decoded.userId; // must match payload key
    req.isAdmin = decoded.isAdmin; // optional
    next();
  } catch (error) {
    return res.status(403).json({ success: false, msg: `Token verification failed: ${error.message}` });
  }
};

export default authMiddleware;
