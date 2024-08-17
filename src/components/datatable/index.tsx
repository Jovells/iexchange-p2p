import { ReactNode, useState } from 'react';

type Row = {
    [key: string]: any;
};

type Action = {
    label: string;
    onClick: (row: Row) => void;
};

interface Column {
    key: string;
    label: string;
    render?: (row: Row) => ReactNode;
}

interface GridTableProps {
    columns: Column[];
    data: Record<string, any>[];
    itemsPerPage?: number;
    actions?: Action[];
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
                                {column.label}
                            </div>
                        ))}
                        {/* {actions && (
                            <div className="hidden p-2 text-white font-semibold">
                                Actions
                            </div>
                        )} */}
                    </div>

                    {/* Table Body */}
                    {paginatedData.map((row, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] border-b px-4 py-2"
                        >
                            {columns.map((column) => (
                                <div key={column.key} className="col-span-1 text-gray-600">
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
                                                // handleRowClick(index);
                                            }}
                                            className={`text-black text-sm px-4 py-3 rounded-xl`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
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
