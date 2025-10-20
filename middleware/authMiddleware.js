import jwt from "jsonwebtoken";

/**
 * Organization Auth Middleware
 *
 * @param {string} tokenName - Cookie key name (e.g., "orgUserToken")
 * @param {string} resource - Resource to authorize (e.g., "profileOwn")
 * @param {string} action - Action on the resource (e.g., "read", "create", "update", "delete")
 * @returns {Function} Middleware function that takes `req` and returns decoded payload or error object
 */
export const authMiddleware = (tokenName, resource, action) => {
  return async (req) => {
    try {
      const token = req.cookies.get(tokenName)?.value;

      if (!token) {
        return { error: "Unauthorized access: Token missing", status: 401 };
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.error("Token verification failed:", error.message || error);
        return { error: "Unauthorized access: Invalid token", status: 401 };
      }

      // Extract permissions from token
      const permissions = decoded.permissions || [];

      // Check if user has the required resource & action permission
      const hasPermission = permissions.some(
        (perm) => perm.resource === resource && perm.permission.includes(action)
      );

      if (!hasPermission) {
        return {
          error: `Access denied: Missing "${action}" permission on "${resource}"`,
          status: 403,
        };
      }

      return decoded; // Token is valid & user is authorized
    } catch (err) {
      console.error("Auth middleware error:", err);
      return { error: "Internal authorization error", status: 500 };
    }
  };
};
