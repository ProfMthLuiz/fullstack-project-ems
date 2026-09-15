import React, { useState, useEffect } from "react";
import { Pagination } from "../components/Pagination";
import {
  Package,
  RefreshCw,
  Layers,
  DollarSign,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { apiFecth } from "../services/api";
import type { Product, PaginatedResponse } from "../types/product";

export const Products: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isServerPaginated, setIsServerPaginated] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (targetPage = page, targetLimit = limit) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFecth<PaginatedResponse | Product[]>(
        `/products?page=${targetPage}&limit=${targetLimit}`,
      );

      const paginatedData = response as PaginatedResponse;
      setProducts(paginatedData.data || []);
      setTotalPages(paginatedData.pagination.totalPages || 1);
      setTotalItems(paginatedData.pagination.totalItems || 0);
      setIsServerPaginated(true);
    } catch (err) {
      console.error(err);
      setError("API offline ou tabela vazia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, limit);
  }, [page, limit]);

  const displayedProducts = isServerPaginated
    ? products
    : products.slice((page - 1) * limit, page * limit);
  // slice -> utilizado para recortar um pedaço de uma lista

  // Função que altera a página atual
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Função que gera a lista de elementos para paginação
  const getPaginationRange = (current: number, total: number) => {
    // Caso tenha até 7 páginas apresente [ 1, 2, 3, 4, 5, 6, 7 ]
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Se estiver nas 3 primeiras páginas [1 2 3 ... 10 11 12]
    if (current <= 3) {
      return [1, 2, 3, "...", total - 2, total - 1, total];
    }

    // Se estiver nas 3 ultimas páginas [1 2 3 ... 10 11 12]
    if (current >= total - 2) {
      return [1, 2, 3, "...", total - 2, total - 1, total];
    }

    // Se estiver no meio [1 ... 5 6 7 ... 12]
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  // Função para selecionar quantos itens visualizar por página
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
      {/* Header da Página */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                background: "rgba(99, 102, 241, 0.15)",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <Package size={24} color="#818cf8" />
            </div>
            <h1
              style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f8fafc" }}
            >
              Tabela de Produtos
            </h1>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "4px" }}>
            Dados obtidos com sucesso do servidor através do token de sessão
            autenticado.
          </p>
        </div>

        <button onClick={() => fetchProducts()} className="btn btn-secondary">
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          Atualizar Dados
        </button>
      </div>

      {/* Tabela de Produtos */}
      {error && (
        <div className="alert-error" style={{ marginBottom: "16px" }}>
          <span>{error}</span>
        </div>
      )}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div
            style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}
          >
            <div
              className="big-spinner"
              style={{ margin: "0 auto 16px" }}
            ></div>
            <p>Carregando produtos autenticados...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Tag size={14} /> ID
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Package size={14} /> Nome do Produto
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Layers size={14} /> Categoria
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <DollarSign size={14} /> Preço
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <CheckCircle2 size={14} /> Estoque
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: "32px",
                        color: "#64748b",
                      }}
                    >
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((product) => (
                    <tr key={product.id}>
                      <td style={{ color: "#64748b", fontWeight: 600 }}>
                        #{product.id}
                      </td>
                      <td style={{ fontWeight: 600, color: "#f8fafc" }}>
                        {product.nome || "Produto sem nome"}
                      </td>
                      <td>
                        <span className="badge badge-primary">
                          {product.categoria || "Geral"}
                        </span>
                      </td>
                      <td style={{ color: "#34d399", fontWeight: 600 }}>
                        R${" "}
                        {Number(product.preco || 0).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <span className="badge badge-success">
                          {product.quantidade_estoque} unid.
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              loading={loading}
              onPageChange={handlePageChange}
              onPaginationRange={getPaginationRange}
              onLimitChange={handleLimitChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
