import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const PaginationComponent = ({ totalResults, itemsPerPage, onPageChange, page }) => {


  const pageCount = Math.ceil(totalResults / itemsPerPage);

  return (
    <Stack 
    className='pagination-component'
    spacing={2}>
      <Pagination
        count={pageCount}
        page={page}
        onChange={(event, value) => onPageChange(value)}
        shape="rounded"
        siblingCount={0} // Adjust this as needed for mobile
      />
    </Stack>
  );
};

export default PaginationComponent;
