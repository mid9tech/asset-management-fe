"use client";
import { FC, Fragment } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage(page: number): void;
}

const Pagination: FC<PaginationProps> = (props) => {
  const { totalPages, currentPage, setCurrentPage } = props;

  const handleChangePage = (value: number) => {
    setCurrentPage(value);
  };

  const onClickNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const onClickPrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const renderedTags = Array.from({ length: totalPages || 1 }, (_, index) => {
    const isActive = currentPage === index + 1;
    const classNames = `flex items-center justify-center px-3 h-8 leading-tight border-gray border hover:bg-gray-100 hover:text-gray-700 ${
      isActive ? "bg-nashtech text-white" : "hover:bg-nashtech hover:text-white"
    }`;

    return (
      <li key={index} onClick={() => handleChangePage(index + 1)}>
        <a href="#" className={classNames}>
          {index + 1}
        </a>
      </li>
    );
  });
  console.log(`current page ${currentPage} total page: ${totalPages}`);
  

  return (
    <Fragment>
      <nav aria-label="Page navigation example" className="mt-4">
        <ul className="flex -space-x-px text-sm justify-end">
          <li>
            <button
              disabled={currentPage === 1}
              onClick={() => onClickPrev()}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-nashtech border border-gray rounded-l-md hover:bg-gray-100 hover:text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Previous
            </button>
          </li>
          {renderedTags}
          <li>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onClickNext()}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-nashtech border border-gray rounded-r-md hover:bg-gray-100 hover:text-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};
export default Pagination;
