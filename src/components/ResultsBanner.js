import React, { useState, useRef, useEffect } from 'react';

const ResultsBanner = ({ itemsPerPage, currentPage, count, total, onSortChange, sortParams = { sort_name: null, sort_dir: null } }) => {
  const startCount = (currentPage - 1) * itemsPerPage + 1;
  let endCount = startCount + count - 1;

  // Use `sortParams` with a fallback in case it's undefined
  let selectedSortValue = 'default';
  if (sortParams && sortParams.sort_name === 'rent' && sortParams.sort_dir === 'desc') {
    selectedSortValue = 'highToLow';
  } else if (sortParams && sortParams.sort_name === 'rent' && sortParams.sort_dir === 'asc') {
    selectedSortValue = 'lowToHigh';
  }

  if (endCount > total) {
    endCount = total;
  }

  onSortChange = onSortChange || (() => { });

  return (
    <div className="results-banner">
      <span>{`${startCount}-${endCount} of ${total} results`}</span>
      <div className="sort-dropdown">
        Sort :
        <select onChange={onSortChange} value={selectedSortValue}>
          <option value="default">Default</option>
          <option value="highToLow">High to Low</option>
          <option value="lowToHigh">Low to High</option>
        </select>
      </div>
    </div>
  );
};

export default ResultsBanner;
