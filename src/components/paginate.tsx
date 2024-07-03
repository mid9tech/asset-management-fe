"use client";
import { SelectChangeEvent } from "@mui/material";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FC, Fragment } from "react";

interface Props {
    totalPages: number
    totalItem?: number,
    currentPage: number,
    itemsPerPage?: number
}

const Paginate = ({ totalPages, totalItem, currentPage, itemsPerPage }: Props) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
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
    const handleChangePage = (
        newPage: number,
    ) => {
        const regex = /\D/;

        const params = new URLSearchParams(searchParams);

        if (newPage <= 0) {
            params.set('page', '1');
        }
        if (newPage > totalPages) {
            params.set('page', totalPages.toString());
        }
        params.set('page', newPage.toString());
        if(regex.test(newPage.toString())) {
            params.set('page', '1');
        }
        replace(`${pathname}?${params.toString()}`);
    };
    console.log(getPageNumbers())
    const renderedTags = getPageNumbers().map((value, index) => {
        const isActive = currentPage === value;
        const classNames = `cursor-pointer flex items-center justify-center px-3 h-8 leading-tight border-gray border hover:bg-gray-100 hover:text-gray-700 ${isActive ? "bg-nashtech text-white" : "hover:bg-nashtech hover:text-white"
            }`;

        return (
            <li key={index} onClick={() => handleChangePage(parseInt(value.toString()))}>
                <div className={classNames}>
                    {value}
                </div>
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
                            onClick={() => handleChangePage(currentPage - 1)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight text-nashtech border border-gray rounded-l-md hover:bg-gray-100 hover:text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Previous
                        </button>
                    </li>
                    {renderedTags}
                    <li>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handleChangePage(currentPage + 1)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight text-nashtech border border-gray rounded-r-md hover:bg-gray-100 hover:text-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </Fragment>
    );
};
export default Paginate;
