import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../config/token.js";
import UserRepository from "../repositories/UserRepository.js";
import AuthRepository from "../repositories/AuthRepository.js";
import AuthModel from "../models/AuthModel.js";
import { hashToken } from "../utils/emailToken.util.js"

class AuthService {
  async login(email, senha) {

    const user = await UserRepository.getByEmail(email);

    if (!user) throw new Error("E-mail do usuário não encontrado!");

    // Verificando se a senha enviada pelo usuário é igual a que está salva no BANCO (criptografada)
    const match = await bcrypt.compare(senha, user.senha)

    if (!match) throw new Error("Senha inválida");

    const payload = { id: user.id, email: user.email, tipo: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const auth = new AuthModel({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt
    });

    await AuthRepository.create(auth);

    const userProfile = { id: user.id, nome: user.nome, email: user.email, role: user.role };

    return { message: "Usuário logado", accessToken, refreshToken, user: userProfile };

  }

  async getMe(userId) {
    const user = await UserRepository.getById(userId);
    if (!user) throw new Error("Usuário não encontrado!");
    return user;
  }

  async refresh(token) {
    if (!token) throw new Error("Refresh token obrigatório!")

    const decoded = verifyRefreshToken(token);
    const exists = await AuthRepository.findByToken(token);

    if (!exists) throw new Error("Refresh inválido!")

    const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email, tipo: decoded.role })

    return { accessToken: newAccessToken }
  }

  async verifyEmail(token) {
    const tokenHash = hashToken(token);
    const user = await UserRepository.findByVerificationToken(tokenHash);

    if (!user) throw new Error("Token inválido!");

    if (new Date() > user.token_verificacao_expira) throw new Error("Token expirado!");

    await UserRepository.updateVerification(user.id, {
      email_verificado: 1,
      token_verificacao: null,
      token_verificacao_expira: null
    })

    return { message: "Email verificado com sucesso!" }

  }

  async logout(token) {
    await AuthRepository.deleteByToken(token);

    return { message: "Logout!" }
  }
}

export default new AuthService();
