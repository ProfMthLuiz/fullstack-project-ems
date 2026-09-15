import { verifyAccessToken } from "../config/token.js";

export function authMiddleware(req, res, next) {
  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    token = authHeader.split(" ")[1];
  }

  if (!token) return res.status(401).json({ error: "Token não enviado!" });

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido!" });
  }
}

