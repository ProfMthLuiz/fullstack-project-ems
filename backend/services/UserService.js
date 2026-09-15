import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository.js";
import { validateRegister } from "../validators/user.validator.js";
import { generateToken, hashToken } from "../utils/emailToken.util.js";
import EmailService from "./EmailService.js";

class AuthService {

  async forgotPassword(email) {
    const user = await UserRepository.getByEmail(email);

    if (!user) throw new Error("Usuário não encontrado!");

    const token = generateToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1hr

    await UserRepository.saveResetToken(user.id, token, expires);

    await EmailService.send(
      email,
      "Recuperação de senha",
      `<a href="http://localhost:3000/users/reset-password?token=${token}">
        Redefinir Senha
      </a>`
    )
  }

  async resetPassword(token, novaSenha) {
    const user = await UserRepository.findByResetToken(token);

    if (!user) throw new Error("Token inválido!");

    if (new Date(user.token_recuperacao_expira) < new Date()) {
      throw new Error("Token expirado");
    }

    const hash = await bcrypt.hash(novaSenha, 10);

    await UserRepository.updatePassword(user.id, hash);
    await UserRepository.clearResetToken(user.id);
  }

  async getAll() {
    const users = await UserRepository.getAll();

    return users;
  }

  async getById(id) {
    const user = await UserRepository.getById(id);

    if (!user) {
      throw new Error("Usuário não encontrado!");
    }

    return user;
  }

  async create(data) {
    validateRegister(data);

    const { nome, email, senha, role } = data;

    const emailNormalizado = email.toLowerCase().trim();

    const userExists = await UserRepository.getByEmail(emailNormalizado);

    if (userExists) throw new Error("Email já cadastrado!");

    const senhaHash = await bcrypt.hash(senha, 10);
    const token = generateToken();
    const tokenHash = hashToken(token);

    const newUser = await UserRepository.create({
      nome,
      email: emailNormalizado,
      senha: senhaHash,
      role: role,
      token_verificacao: tokenHash,
      token_expiracao: new Date(Date.now() + 1000 * 60 * 60)
    })

    const link = `http://localhost:3000/auth/verify-email?token=${token}`;

    await EmailService.send(
      emailNormalizado,
      "Verifique seu email!",
      `
        <h1>Bem-vindo!</h1>
        <p>Clique no botão abaixo para verificar seu email:</p>
        <a href="${link}">Verificar Email</a>
      `
    )

    return {
      message: "Usuário cadastrado com sucesso!",
      newUser
    }

  }

  async update(id, data) {
    const user = await UserRepository.getById(id);

    if (!user) throw new Error("Usuário não encontrado!");

    await UserRepository.update(id, data);

    return { message: "Usuário atualizado com sucesso!" }
  }

  // SOFT DELETE
  async delete(id) {
    const user = await UserRepository.getById(id);

    if (!user) throw new Error("Usuário não encontrado!");

    await UserRepository.delete(id);

    return { message: "Usuário desativado com sucesso!" }
  }

  async restore(id) {
    const user = await UserRepository.getById(id);

    if (!user) throw new Error("Usuário não encontrado!");

    await UserRepository.restore(id);

    return { message: "Usuário reativado com sucesso!" }
  }

}

export default new AuthService();


