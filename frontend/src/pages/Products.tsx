import "./Products.css";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Pagination } from "../components/Pagination";
import {
  Package,
  RefreshCw,
  Layers,
  DollarSign,
  Tag,
  CheckCircle2,
  Search,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from "lucide-react";
import { apiFecth } from "../services/api";
import type { Product, PaginatedResponse } from "../types/product";

export const Products: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isServerPaginated, setIsServerPaginated] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimerRef = useRef<number | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (
    targetPage = page,
    targetLimit = limit,
    targetSearch = searchQuery,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const searchParam = encodeURIComponent(targetSearch.trim());
      const response = await apiFecth<PaginatedResponse | Product[]>(
        `/products?page=${targetPage}&limit=${targetLimit}&search=${searchParam}`,
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
  }, [page, limit, searchQuery]);

  // LIMPEZA DO TIMER REF AO DESMONTAR O COMPONENTE
  // Notebook
  useEffect(() => {
    return () => {
      if (searchTimerRef.current !== null) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // LÓGICA DE DEBOUNCE PARA BUSCA COM useRef
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (searchTimerRef.current !== null) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = window.setTimeout(() => {
      setPage(1);
      setSearchQuery(value);
    }, 400);
  };

  const displayedProducts = isServerPaginated
    ? products
    : products.slice((page - 1) * limit, page * limit);
  // slice -> utilizado para recortar um pedaço de uma lista

  // Função que altera a página atual
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages],
  );

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
  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const stockMetrics = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        totalValue: 0,
        averagePrice: 0,
        mostExpensive: null,
        cheapest: null,
        criticalStockCount: 0,
      };
    }

    let totalValue = 0;
    let totalPriceSum = 0;
    let criticalStockCount = 0;
    let mostExpensiveProduct = products[0];
    let cheapestProduct = products[0];

    products.forEach((p) => {
      const price = Number(p.preco);
      const stock = Number(p.quantidade_estoque);

      totalValue += price * stock;
      totalPriceSum += price;

      if (stock < 5) {
        criticalStockCount += 1;
      }

      // BUSCANDO QUAL O PRODUTO DE MAIOR VALOR
      const currentMaxPrice = Number(mostExpensiveProduct.preco);
      if (price > currentMaxPrice) {
        mostExpensiveProduct = p;
      }

      // BUSCANDO QUAL O PRODUTO DE MENOR VALOR
      const currentMinPrice = Number(cheapestProduct.preco);
      if (price < currentMinPrice) {
        cheapestProduct = p;
      }
    });

    const averagePrice = totalPriceSum / products.length;

    return {
      totalValue,
      averagePrice,
      mostExpensive: mostExpensiveProduct,
      cheapest: cheapestProduct,
      criticalStockCount,
    };
  }, [products]);

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

      {/* PAINEL DE MÉTRICAS DE ESTOQUE */}
      <div className="stock-metrics-grid">
        <div className="glass-card stock-metric-card">
          <div className="stock-metric-header">
            <span className="stock-metric-label">VALOR EM ESTOQUE</span>
            <TrendingUp size={18} color="#34d399" />
          </div>

          <div className="stock-metric-value">
            <span>
              R${" "}
              {stockMetrics?.totalValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="glass-card stock-metric-card">
          <div className="stock-metric-header">
            <span className="stock-metric-label">PREÇO MÉDIO</span>
            <DollarSign size={18} color="#818cf8" />
          </div>

          <div className="stock-metric-value">
            <span>
              R${" "}
              {stockMetrics?.averagePrice.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="glass-card stock-metric-card">
          <div className="stock-metric-header">
            <span className="stock-metric-label">MAIS CARO</span>
            <ArrowUpRight size={18} color="#facc15" />
          </div>

          <div className="stock-metric-name">
            <span>{stockMetrics.mostExpensive?.nome}</span>
          </div>

          <div className="stock-metric-price stock-metric-price--green">
            <span>
              R${" "}
              {stockMetrics.mostExpensive?.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="glass-card stock-metric-card">
          <div className="stock-metric-header">
            <span className="stock-metric-label">MAIS BARATO</span>
            <ArrowDownRight size={18} color="#38bdf8" />
          </div>

          <div className="stock-metric-name">
            <span>{stockMetrics.cheapest?.nome}</span>
          </div>

          <div className="stock-metric-price stock-metric-price--green">
            <span>
              R${" "}
              {stockMetrics.cheapest?.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="glass-card stock-metric-card">
          <div className="stock-metric-header">
            <span className="stock-metric-label">ESTOQUE CRÍTICO</span>
            <AlertTriangle size={18} color="#38bdf8" />
          </div>

          <div
            className={`stock-critical-value ${stockMetrics.criticalStockCount > 0
              ? "stock-critical-value--danger"
              : "stock-critical-value--success"
              } `}
          >
            <span>{stockMetrics?.criticalStockCount} item(ns)</span>
          </div>
        </div>
      </div>

      {/* BARRA DE PESQUISA COM DEBOUNCE */}
      <div className="glass-card stock-search-card">
        <div className="stock-search-wrapper">
          <Search size={18} color="#64748b" className="stock-search-icon" />

          <input
            value={searchTerm}
            type="text"
            className="form-input stock-search-input"
            placeholder="Pesquise um produto..."
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
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
