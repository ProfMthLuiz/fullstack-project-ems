import "./Pagination.css";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onPaginationRange: (current: number, total: number) => (number | string)[];
  onLimitChange: (limit: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  loading = false,
  onPageChange,
  onPaginationRange,
  onLimitChange,
}: PaginationProps) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-container">
      <div className="pagination-counter">
        <p>
          Exibindo <strong>{startItem}</strong> a <strong>{endItem}</strong> de{" "}
          <strong>{totalItems}</strong> produtos
        </p>
      </div>

      <div className="pagination-controls">
        <div className="pagination-nav">
          <div className="pagination-limit">
            <span className="pagination-limit-label">Itens por página:</span>
            <select
              value={itemsPerPage}
              disabled={loading}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="pagination-limit-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="btn btn-secondary pagination-btn-nav"
            title="Primeira Página"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="btn btn-secondary pagination-btn-nav"
            title="Página Anterior"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="pagination-pages-list">
            {onPaginationRange(currentPage, totalPages).map((item, idx) => {
              if (item === "...")
                return (
                  <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                    ...
                  </span>
                );

              const pageNum = item as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  disabled={loading}
                  onClick={() => onPageChange(pageNum)}
                  className={`pagination-btn-page ${isActive ? "is-active" : ""}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="btn btn-secondary pagination-btn-nav"
            title="Próxima Página"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="btn btn-secondary pagination-btn-nav"
            title="Última Página"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
