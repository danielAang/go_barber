import jwt from "jsonwebtoken";
import { promisify } from "util";
import authConfig from "../../config/auth";

export default async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ error: "No token provided" });
  }
  const [bearer, token] = authorization.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
