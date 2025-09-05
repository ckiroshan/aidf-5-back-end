import UnauthorizedError from "../../domain/errors/unauthorized-error.js";

const isAuthenticated = (req, res, next) => {
  console.log("IS_AUTHENTICATED", req.auth().isAuthenticated);
  if (!req.auth().isAuthenticated) {
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};

export default isAuthenticated;