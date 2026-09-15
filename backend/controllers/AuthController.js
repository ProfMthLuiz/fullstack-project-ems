import AuthService from "../services/AuthService.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

class AuthController {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      const { accessToken, refreshToken, user } = await AuthService.login(email, senha);

      res.cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000 // 15 minutos
      });

      res.cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
      });

      return res.json({ message: "Usuário logado", user });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await AuthService.getMe(req.user.id);
      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;

      const result = await AuthService.verifyEmail(token);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      const result = await AuthService.refresh(refreshToken);

      res.cookie("accessToken", result.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000
      });

      return res.json({ message: "Token atualizado com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      res.clearCookie("accessToken", COOKIE_OPTIONS);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);

      return res.json({ message: "Logout realizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();

