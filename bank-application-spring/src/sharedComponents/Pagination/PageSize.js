import React from "react";

const PageSize = ({ sizer }) => {
  return (
    <select
      className="form-select"
      value={sizer.pageSize}
      onChange={(e) => sizer.setPageSize(Number(e.target.value))}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
    </select>
  );
};

export default PageSize;
