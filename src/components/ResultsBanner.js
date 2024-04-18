import React, { useState, useRef, useEffect } from 'react';

const ResultsBanner = ({ itemsPerPage, currentPage, count, total, onSortChange, sortParams = { sort: null } }) => {
  const startCount = (currentPage - 1) * itemsPerPage + 1;
  let endCount = startCount + count - 1;

  // Use `sortParams` with a fallback in case it's undefined
  let selectedSortValue = 'default';
  if (sortParams.sort === '-listprice') {
    selectedSortValue = 'highToLow';
  } else if (sortParams.sort === 'listprice') {
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
