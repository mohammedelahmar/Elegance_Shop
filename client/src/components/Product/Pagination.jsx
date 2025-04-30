import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;
  
  if (totalPages <= 1) return null;
  
  const renderPaginationItems = () => {
    const items = [];
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    items.push(
      <BootstrapPagination.Item 
        key="prev" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </BootstrapPagination.Item>
    );
    
    // First page
    if (startPage > 1) {
      items.push(
        <BootstrapPagination.Item key={1} onClick={() => onPageChange(1)}>
          1
        </BootstrapPagination.Item>
      );
      
      if (startPage > 2) {
        items.push(<BootstrapPagination.Ellipsis key="ellipsis1" />);
      }
    }
    
    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <BootstrapPagination.Item 
          key={page} 
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </BootstrapPagination.Item>
      );
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<BootstrapPagination.Ellipsis key="ellipsis2" />);
      }
      
      items.push(
        <BootstrapPagination.Item 
          key={totalPages} 
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </BootstrapPagination.Item>
      );
    }
    
    // Next button
    items.push(
      <BootstrapPagination.Item 
        key="next" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </BootstrapPagination.Item>
    );
    
    return items;
  };

  return (
    <BootstrapPagination className="justify-content-center">
      {renderPaginationItems()}
    </BootstrapPagination>
  );
};

export default Pagination;