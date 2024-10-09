import React, {
  useState,
  ReactNode,
  useImperativeHandle,
  forwardRef,
  ReactElement,
  useEffect,
} from 'react';
import Loader from '../loader/Loader';
import { X } from 'lucide-react';
import { Offer } from '@/common/api/types';
import { offerTypes } from "@/common/constants";

type Column = {
  key: string;
  label: string;
  render?: (row: Offer) => ReactNode;
};

type Action = {
  label: ((row: Offer) => ReactNode) | string;
  onClick: (row: Offer) => void;
};

type ExpandableTableProps = {
  columns: Column[];
  data: any[];
  actions?: Action[];
  styles?: React.CSSProperties;
  isLoading: boolean;
  children: (row: any, toggleExpand: () => void) => ReactElement;
  page?: number;
  pageSize?: number;
  totalRecords?: number;
  onPageChange: (page: number) => void;
};

const ExpandableTable = forwardRef(
  (
    {
      columns,
      data,
      actions = [],
      styles,
      isLoading,
      children,
      page = 1,
      pageSize = 50,
      totalRecords = data.length,
      onPageChange,
    }: ExpandableTableProps,
    ref
  ) => {
    const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window?.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window?.innerWidth <= 768);
      };
      window?.addEventListener('resize', handleResize);
      return () => {
        window?.removeEventListener('resize', handleResize);
      };
    }, []);

    const handleRowClick = (index: number) => {
      if (expandedRowIndex === index) {
        closeExpandedRow();
        return;
      }
      setExpandedRowIndex(index);
    };

    const closeExpandedRow = () => {
      setExpandedRowIndex(null);
    };

    useImperativeHandle(ref, () => ({
      closeExpandedRow,
    }));

    const columnGridTemplate = `repeat(${columns.length + (actions.length > 0 ? 1 : 0)
      }, minmax(0, 1fr))`;

    const totalPages = Math.ceil(data.length / pageSize);

    return (
      <div className="w-full overflow-x-auto  rounded-[8px]">
        <div className={`min-w-full `} style={styles}>
          {/* Column Headers */}
          {!isMobile && (
            <div
              className="grid grid-cols-12 gap-4 p-4 border border-gray-200 dark:border-gray-600  dark:bg-gray-900 rounded-xl text-white text-sm font-light"
              style={{ gridTemplateColumns: columnGridTemplate }}
            >
              {columns.map(column => (
                <div key={column.key} className="col-span-1 text-black dark:text-white">
                  {column.label}
                </div>
              ))}
              {actions.length > 0 && <div className="col-span-1 w-full flex justify-end"></div>}
            </div>
          )}

          {isLoading && <Loader loaderType="text" className="mt-20" />}

          {!isLoading && data && data.length > 0 && (
            <>
              {isMobile ? (
                <div>
                  {data.map((row: Offer, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-700 mb-4 p-4 rounded-lg border-b border-[#C3D5F173] dark:border-gray-600"
                    >
                      {columns.map(column => (
                        <div key={column.key} className="mb-2 text-black dark:text-white">
                          <span>
                            {column.render ? column.render(row) : (row[column.key as keyof Offer] as ReactNode)}
                          </span>
                        </div>
                      ))}
                      {actions.length > 0 && (
                        <div className="mt-4 flex justify-end">
                          {actions.map((action, actionIndex) => {
                            let label = typeof action.label === "function" ? action.label(row) : action.label;

                            return (
                              <button
                                key={actionIndex}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleRowClick(index);
                                  action.onClick(row);
                                }}
                                className={`${
                                  row.offerType === offerTypes.buy ? "bg-[#2D947A]" : "bg-[#F14E4E]"
                                } text-white text-sm px-4 py-3 rounded-xl`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                  {expandedRowIndex !== null && (
                    <BottomUpModal
                      closeExpandedRow={closeExpandedRow}
                      data={data}
                      expandedRowIndex={expandedRowIndex}
                      children={children}
                    />
                    // <div
                    //   className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
                    //   onClick={closeExpandedRow}>
                    //   <div
                    //     className="bg-white dark:bg-gray-800 w-full p-4 rounded-t-xl max-h-[500px] overflow-auto"
                    //     onClick={(e) => e.stopPropagation()}>
                    //     {children(data[expandedRowIndex], closeExpandedRow)}
                    //   </div>
                    // </div>
                  )}
                </div>
              ) : (
                <div>
                  {data.map((row, index) => (
                    <React.Fragment key={index}>
                      {expandedRowIndex !== index && (
                        <div
                          className={`grid grid-cols-12 gap-4 p-4 ${
                            index + 1 === data.length ? "border-b" : "border-b"
                          } border-gray-200 dark:border-gray-600  cursor-pointer`}
                          style={{ gridTemplateColumns: columnGridTemplate }}
                        >
                          {columns.map(column => (
                            <div key={column.key} className="col-span-1 text-black dark:text-white">
                              {column.render ? column.render(row) : (row[column.key] as ReactNode)}
                            </div>
                          ))}
                          {actions.length > 0 && (
                            <div className="col-span-1 w-full flex justify-end">
                              {actions.map((action, actionIndex) => {
                                const label = typeof action.label === "function" ? action.label(row) : action.label;
                                return (
                                  <button
                                    key={actionIndex}
                                    onClick={e => {
                                      e.stopPropagation();
                                      action.onClick(row);
                                      handleRowClick(index);
                                    }}
                                    className={`${
                                      row.offerType === offerTypes.buy ? "bg-[#2D947A]" : "bg-[#F14E4E]"
                                    } text-white text-sm px-4 py-3 rounded-xl min-w-[130px]`}
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                      {expandedRowIndex === index && (
                        <div className="col-span-full py-4 border-b border-[#C3D5F124] dark:border-gray-600">
                          {children(row, closeExpandedRow)}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}

          {!isLoading && data && data.length === 0 && (
            <div className="p-4 text-center text-black dark:text-white">No records to show</div>
          )}

          {data && data.length > 0 && (
            <div className="flex justify-center py-3">
              <div className="flex items-center mx-4 gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => onPageChange(page - 1)}
                  className="px-4 py-2 bg-transparent cursor-pointer rounded disabled:opacity-50 text-black dark:text-white"
                >
                  Prev
                </button>
                {totalPages >= 1 && (
                  <>
                    <button
                      onClick={() => onPageChange(1)}
                      className={`px-4 py-2 rounded-[8px] border ${
                        page === 0 ? "bg-[#01A2E4] text-white hover:bg-[#01A2E4]" : "bg-transparent text-blue-600"
                      } hover:bg-blue-200 transition-colors duration-200`}
                    >
                      1
                    </button>
                    {totalPages > 3 && page > 2 && <span className="px-2">...</span>}
                  </>
                )}

                {Array.from({ length: Math.min(2, totalPages) }, (_, index) => {
                  const pageNum = Math.max(2, page - 2) + index;

                  if (pageNum <= totalPages && pageNum > 1) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum - 1)}
                        className={`px-4 py-2 rounded-[8px] border ${
                          page === pageNum - 1
                            ? "bg-[#01A2E4] text-white hover:bg-[#01A2E4]"
                            : "bg-transparent text-blue-600"
                        } hover:bg-blue-200 transition-colors duration-200`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}

                {totalPages > 3 && page < totalPages - 1 && <span className="px-2">...</span>}
                {totalPages > 1 && (
                  <button
                    onClick={() => onPageChange(totalPages - 1)}
                    className={`px-4 py-2 rounded-[8px] border ${
                      page === totalPages - 1
                        ? "bg-[#01A2E4] text-white hover:bg-[#01A2E4]"
                        : "bg-transparent text-blue-600"
                    } hover:bg-blue-200 transition-colors duration-200`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  disabled={page + 1 === totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="px-4 py-2 bg-transparent cursor-pointer rounded disabled:opacity-50 text-black dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ExpandableTable;


interface ModalProps {
  closeExpandedRow: () => void;
  data: any[];
  expandedRowIndex: number;
  children: (data: any, closeExpandedRow: () => void) => ReactNode;
}

const BottomUpModal: React.FC<ModalProps> = ({ closeExpandedRow, data, expandedRowIndex, children }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
      // onClick={closeExpandedRow}
    >
      <div className="flex flex-col bg-white dark:bg-gray-800 w-full rounded-t-xl max-h-[500px]">
        <div className='p-4 py-6 border-b border-gray-600 flex flex-row justify-between items-center'>
          <h1 className='text-white'>Buy</h1>
          <X className='text-black dark:text-white' onClick={closeExpandedRow} />
        </div>
        <div
          className="p-4  overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children(data[expandedRowIndex], closeExpandedRow)}
        </div>
      </div>
    </div>
  );
};
