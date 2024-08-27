import React from "react";
import PageSize from "./PageSize";

const Pagination = ({ pager, onPageChange }) => {
  if (!pager) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pager.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex align-items-center">
      <PageSize sizer={{ pageSize: pager.pageSize, setPageSize: pager.setPageSize }} />
      <ul className="pagination mb-0 ms-3 col-4">
        <li className={`page-item ${pager.pageNumber === 0 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => pager.pageNumber > 0 && onPageChange(pager.pageNumber - 1)}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((page) => (
          <li
            key={page}
            className={`page-item ${page === pager.pageNumber + 1 ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(page - 1)}
            >
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${pager.pageNumber === pager.totalPages - 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => pager.pageNumber < pager.totalPages - 1 && onPageChange(pager.pageNumber + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
