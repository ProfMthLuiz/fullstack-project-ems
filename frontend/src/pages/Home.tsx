import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  UserCheck,
  Shield,
  Cookie,
  ArrowRight,
  Package,
  Cpu,
} from "lucide-react";

export const Home: React.FC = () => {
  const { user } = useAuth();
  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
      {/* Banner de Boas-vindas */}
      <div
        className="glass-card"
        style={{
          padding: "32px",
          marginBottom: "28px",
          background:
            "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(30, 41, 59, 0.8))",
          border: "1px solid rgba(99, 102, 241, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <span className="badge badge-success">Sessão Ativa</span>
            <span className="badge badge-primary">Cookie Security</span>
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f8fafc" }}>
            Olá, {user?.nome || user?.email}! 👋
          </h1>
          <p
            style={{ color: "#94a3b8", fontSize: "0.95rem", marginTop: "6px" }}
          >
            Você está autenticado com sucesso no sistema usando cookies de
            acesso <strong style={{ color: "#10b981" }}>HTTP-Only</strong>.
          </p>
        </div>

        <Link to="/products" className="btn btn-primary">
          <Package size={18} />
          Ver Tabela de Produtos
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Grid de Informações de Segurança */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {/* Card 1: Como Funciona */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <Cookie size={24} color="#34d399" />
            </div>
            <h3
              style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f8fafc" }}
            >
              HTTP-Only Cookies
            </h3>
          </div>
          <p
            style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}
          >
            Seus tokens JWT não ficam armazenados no <code>localStorage</code>{" "}
            do navegador. Isso impede que scripts maliciosos (ataques XSS)
            roubem sua chave de acesso.
          </p>
        </div>

        {/* Card 2: Restauração da Sessão */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "rgba(99, 102, 241, 0.15)",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <Shield size={24} color="#818cf8" />
            </div>
            <h3
              style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f8fafc" }}
            >
              Persistência no F5
            </h3>
          </div>
          <p
            style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}
          >
            Ao recarregar a página ou reabrir o navegador, a aplicação consulta
            automaticamente a rota <code>/auth/me</code> via credenciais do
            cookie para manter você logado.
          </p>
        </div>

        {/* Card 3: Dados do Perfil */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "rgba(234, 179, 8, 0.15)",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <UserCheck size={24} color="#facc15" />
            </div>
            <h3
              style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f8fafc" }}
            >
              Seus Dados no Sistema
            </h3>
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#94a3b8",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div>
              <strong>ID:</strong>{user?.id}
            </div>
            <div>
              <strong>E-mail:</strong>{user?.email}
            </div>
            <div>
              <strong>Perfil/Role:</strong>{user?.role || "Usuário Padrão"}
            </div>
          </div>
        </div>
      </div>

      {/* Card Informativo Back-end */}
      <div
        className="glass-card"
        style={{
          padding: "24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Cpu size={32} color="#6366f1" />
        <div>
          <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc" }}>
            Conectado à API Node.js / Express
          </h4>
          <p
            style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "2px" }}
          >
            Servidor ativo em <code>http://localhost:3000</code> processando
            requisições com <code>credentials: 'include'</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
