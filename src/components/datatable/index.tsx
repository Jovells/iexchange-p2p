import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useState } from 'react';
import Loader from '../loader/Loader';

type Row = {
    [key: string]: any;
};

type Action = {
    label?: string;
    onClick: (row: Row) => void;
    classNames?: string;
    icon?: ReactNode;
};

interface Column {
    key: string;
    label: string;
    render?: (row: Row) => ReactNode;
}

interface GridTableProps {
    columns: any[];
    data: Record<string, any>[];
    itemsPerPage?: number;
    actions?: Action[];
    isLoading?: boolean
}

const GridTable: React.FC<GridTableProps> = ({ columns, data, itemsPerPage = 5, actions, isLoading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    console.log("TESSSSSSSS", data)

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-[8px]">
                <div className="min-w-full">
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] bg-black dark:bg-gray-900 rounded-xl p-4">
                        {columns.map((column, idx) => (
                            <div key={idx} className="col-span-1 text-white font-semibold">
                                {column.label}
                            </div>
                        ))}
                        {actions && actions.length > 0 && <div className="col-span-1 w-full flex justify-end"></div>}
                    </div>
                    {isLoading && <Loader loaderType='text' className='py-4' />}
                    {(!isLoading && data) && data.length > 0 && (
                        paginatedData.map((row, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] border-b border-gray-200 dark:border-gray-600  cursor-pointerpx-4 py-2 px-3"
                            >
                                {columns.map((column) => (
                                    <div key={column.key} className="col-span-1 text-black dark:text-white">
                                        {column.render ? column.render(row) : row[column.key]}
                                    </div>
                                ))}

                                {actions && actions.length > 0 && (
                                    <div className="col-span-1 w-full flex justify-end">
                                        {actions.map((action, actionIndex) => (
                                            <button
                                                key={actionIndex}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    action.onClick(row);
                                                }}
                                                className={`text-black text-sm px-4 py-3 rounded-xl ${action.classNames}`}
                                            >
                                                <div className="flex flex-row space-x-1">
                                                    <span>{action.label}</span>
                                                    {action.icon}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {(!isLoading && data) && data.length === 0 && (
                        <div className="p-4 text-center text-black dark:text-white">No records to show</div>
                    )}
                </div>
            </div>
            {
                data && data.length > 0 && (
                    <div className="flex justify-center items-center mt-4 space-x-2">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-transparent cursor-pointer rounded disabled:opacity-50 text-black dark:text-white"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`px-4 py-2 text-white transition-colors duration-200 rounded-[8px] ${currentPage === idx + 1 ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-transparent cursor-pointer rounded disabled:opacity-50 text-black dark:text-white"
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default GridTable;
