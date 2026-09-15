import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, Mail, KeyRound, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Login: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const emailInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Assim que o COMPONENTE for montado, focar no input com a referencia criada.
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Se o usuário já estiver logado, redireciona diretamente para Home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoadingSubmit(true);

    try {
      await login(email, senha);
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.message || "Falha na autenticação. Verifique seus dados",
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "36px",
          position: "relative",
        }}
      >
        {/* Header Icon */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              padding: "16px",
              borderRadius: "50%",
              marginBottom: "14px",
            }}
          >
            <Lock size={32} color="#818cf8" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc" }}>
            Portal de Acesso
          </h1>
          <p
            style={{ fontSize: "0.875rem", color: "#94a3b8", marginTop: "6px" }}
          >
            Autenticação segura via{" "}
            <strong style={{ color: "#10b981" }}>HTTP-Only Cookies</strong>
          </p>
        </div>

        {errorMessage && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                color="#64748b"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                className="form-input"
                style={{ paddingLeft: "38px" }}
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label htmlFor="senha">Senha</label>
            <div style={{ position: "relative" }}>
              <KeyRound
                size={18}
                color="#64748b"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                id="senha"
                type="password"
                className="form-input"
                style={{ paddingLeft: "38px" }}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <div className="spinner"></div>
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>

        {/* Footer info sobre segurança */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: "0.8rem",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          <ShieldCheck size={16} color="#10b981" />
          <span>Sua sessão é protegida contra ataques XSS.</span>
        </div>
      </div>
    </div>
  );
};
