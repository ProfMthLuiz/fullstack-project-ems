import crypto from "crypto";

// gera um token de 32 bytes, em hexadecimal
export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// gera um HASH do token
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
