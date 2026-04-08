import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token and attach user to request
 * Extracts user from JWT payload and makes it available as req.user
 */
export const protect = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      console.log("❌ [Auth] No token provided in Authorization header");
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route - No token provided",
      });
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure decoded token has required fields
    if (!decoded.id && !decoded._id) {
      console.log("❌ [Auth] Token missing user ID");
      return res.status(401).json({
        success: false,
        message: "Invalid token - Missing user ID",
      });
    }

    // Attach decoded user to request object
    req.user = decoded;
    console.log("✅ [Auth] Token verified for user:", decoded.id || decoded._id);
    next();
  } catch (error) {
    console.error("❌ [Auth] Token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
    });
  }
};

/**
 * Middleware to check if user has specific role(s)
 * Usage: authorize("architect", "admin")
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      console.log("❌ [Authorize] User role not authorized:", {
        userRole,
        allowedRoles: roles,
      });
      return res.status(403).json({
        success: false,
        message: `User role '${userRole}' is not authorized to access this route`,
        allowedRoles: roles,
      });
    }

    console.log("✅ [Authorize] User authorized with role:", userRole);
    next();
  };
};
