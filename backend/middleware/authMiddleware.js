import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// 🧩 Middleware: Verify JWT token
export const protect = async (req, res, next) => {
  try {
    // ✅ Check if token exists in headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user data to req.user
    req.user = decoded;

    // ✅ Continue
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};


// ✅ Admin-only access
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superAdmin")) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// ✅ Coordinator only
export const coordinatorOnly = (req, res, next) => {
  if (req.user && req.user.role === "academicCoordinator") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Coordinators only." });
  }
};

// ✅ Teacher only
export const teacherOnly = (req, res, next) => {
  if (req.user && req.user.role === "teacher") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Teachers only." });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: `Access denied: Role '${req.user.role}' not authorized` });
      }
      next();
    } catch (error) {
      console.error("Authorize Middleware Error:", error.message);
      return res.status(403).json({ message: "Authorization check failed" });
    }
  };
};
