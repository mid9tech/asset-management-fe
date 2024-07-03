"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, Fragment } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage(page: number): void;
}

const Pagination: FC<PaginationProps> = (props) => {
  const { totalPages, currentPage, setCurrentPage } = props;
  const handleChangePage = (value: number) => {
    if (value <= 0) {
      setCurrentPage(1);
    } else {
      if (value > totalPages) {
        setCurrentPage(totalPages);
      } else {
        setCurrentPage(value);

      }
    }
  };

  const onClickNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const onClickPrev = () => {
    setCurrentPage(currentPage - 1);
  };
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 7; // Adjust the number of pages to show

    if (totalPages <= maxPagesToShow) {
      // If total pages is less than maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Otherwise, show a truncated list with ellipses
      pageNumbers.push(1);
      if (currentPage > 4) pageNumbers.push('...');

      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 3) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };
  const pageNumbers = getPageNumbers();
  const handleEllipsisClick = (index: number) => {
    if (index < pageNumbers.indexOf(currentPage)) {
      handleChangePage(currentPage - 7)
    } else {
      handleChangePage(currentPage + 7)
    }
  };
  const renderedTags = pageNumbers?.map((value, index) => {
    const isActive = currentPage === value;
    const classNames = `cursor-pointer flex items-center justify-center px-3 h-8 leading-tight border-gray border hover:bg-gray-100 hover:text-gray-700 ${isActive ? "bg-nashtech text-white" : "hover:bg-nashtech hover:text-white"
      }`;

    if (value === "...") {
      return (
        <li key={index} onClick={() => handleEllipsisClick(index)}>
          <div className={classNames}>...</div>

        </li>
      );
    }
    return (
      <li key={index} onClick={() => handleChangePage(parseInt(value.toString()))}>
        <div className={classNames}>{value}</div>
      </li>
    );
  })
  return (
    <Fragment>
      <nav aria-label="Page navigation example" className="mt-4">
        <ul className="flex -space-x-px text-sm justify-end">
          <li>
            <button
              disabled={currentPage === 1}
              onClick={() => onClickPrev()}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-nashtech border border-gray rounded-l-md hover:bg-gray-100 hover:text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray' : ''}`}>
              Previous
            </button>
          </li>
          {renderedTags}
          <li>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onClickNext()}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-nashtech border border-gray rounded-r-md hover:bg-gray-100 hover:text-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-gray' : ''}`}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};
export default Pagination;
