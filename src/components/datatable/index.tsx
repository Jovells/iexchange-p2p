'use client'
import { useState } from 'react';

interface GridTableProps {
    columns: string[];
    data: Record<string, any>[];
    itemsPerPage?: number;
    actions?: (row: Record<string, any>) => JSX.Element;
}

const GridTable: React.FC<GridTableProps> = ({ columns, data, itemsPerPage = 5, actions }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="min-w-full">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] bg-black rounded-xl px-4">
                        {columns.map((column, idx) => (
                            <div key={idx} className="p-2 text-white font-semibold">
                                {column}
                            </div>
                        ))}
                        {/* {actions && (
                            <div className="p-2 text-white font-semibold border-b">
                                Actions
                            </div>
                        )} */}
                    </div>

                    {/* Table Body */}
                    {paginatedData.map((row, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] border-b px-4"
                        >
                            {columns.map((col, colIdx) => (
                                <div
                                    key={`${idx}-${colIdx}`}
                                    className="py-3"
                                >
                                    {row[col]}
                                </div>
                            ))}
                            {actions && (
                                <div className="p-2">
                                    {actions(row)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                >
                    &larr;
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-3 py-1 border rounded hover:bg-gray-200 ${currentPage === idx + 1 ? 'bg-gray-300' : ''}`}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                >
                    &rarr;
                </button>
            </div>
        </div>
    );
};

export default GridTable;
