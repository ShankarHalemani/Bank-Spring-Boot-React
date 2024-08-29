import React from "react";
import PageSize from "./PageSize";

const Pagination = ({ pager, onPageChange }) => {
  if (!pager) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pager.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="row justify-content-between align-items-center">
      <div className="col-md-3" style={{ maxWidth: "200px" }}>
        <div className="form-group">
          <PageSize sizer={{ pageSize: pager.pageSize, setPageSize: pager.setPageSize }} />
        </div>
      </div>

      <div className="col-md-6">
        <ul className="pagination justify-content-center mb-0">
          <li className={`page-item ${pager.pageNumber === 0 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => pager.pageNumber > 0 && onPageChange(pager.pageNumber - 1)}>
              Previous
            </button>
          </li>
          {pageNumbers.map((page) => (
            <li key={page} className={`page-item ${page === pager.pageNumber + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(page - 1)}>
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${pager.pageNumber === pager.totalPages - 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => pager.pageNumber < pager.totalPages - 1 && onPageChange(pager.pageNumber + 1)}>
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
