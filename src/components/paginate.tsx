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

    const handleChangePage = (
        newPage: number,
    ) => {
        const params = new URLSearchParams(searchParams);
        if (newPage <= 0) {
            params.set('page', '1');
        }
        if (newPage > totalPages) {
            params.set('page', totalPages.toString());
        }
        params.set('page', newPage.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const renderedTags = Array.from({ length: totalPages || 1 }, (_, index) => {
        const isActive = currentPage === index + 1;
        const classNames = `cursor-pointer flex items-center justify-center px-3 h-8 leading-tight border-gray border hover:bg-gray-100 hover:text-gray-700 ${isActive ? "bg-nashtech text-white" : "hover:bg-nashtech hover:text-white"
            }`;

        return (
            <li key={index} onClick={() => handleChangePage(index + 1)}>
                <div className={classNames}>
                    {index + 1}
                </div>
            </li>
        );
    });
    return (
        <Fragment>
            <nav aria-label="Page navigation example" className="mt-5">
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
