import React, {
  useState,
  ReactNode,
  useImperativeHandle,
  forwardRef,
  ReactElement,
  useEffect,
} from 'react';
import Loader from '../loader/Loader';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Offer } from '@/common/api/types';

type Column = {
  key: string;
  label: string;
  render?: (row: Offer) => ReactNode;
};

type Action = {
  label: string;
  onClick: (row: Offer) => void;
};

type ExpandableTableProps = {
  columns: Column[];
  data: any[] ;
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

    const totalPages = Math.ceil(totalRecords / pageSize);

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-full bg-white" style={styles}>
          {/* Column Headers */}
          {!isMobile && <div
            className="grid grid-cols-12 gap-4 p-4 bg-black rounded-xl text-white text-sm font-semibold"
            style={{ gridTemplateColumns: columnGridTemplate }}
          >
            {columns.map((column) => (
              <div key={column.key} className="col-span-1">
                {column.label}
              </div>
            ))}
            {actions.length > 0 && <div className="col-span-1 w-full flex justify-end"></div>}
          </div>}

          {isLoading && <Loader className='mt-20' />}

          {(!isLoading && data) && data.length > 0 && (
            <>
              {isMobile ? (
                <div>
                  {data.map((row, index) => (
                    <div key={index} className="bg-white mb-4 p-4 rounded-lg border-b">
                      {columns.map((column) => (
                        <div key={column.key} className="mb-2">
                          <span>
                            {column.render
                              ? column.render(row)
                              : (row[column.key as keyof Offer] as ReactNode)}
                          </span>
                        </div>
                      ))}
                      {actions.length > 0 && (
                        <div className="mt-4 flex justify-end">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(index);
                                action.onClick(row);
                              }}
                              className={`${action.label.toLowerCase().includes('buy')
                                ? 'bg-[#2D947A]'
                                : 'bg-[#F14E4E]'
                                } text-white text-sm px-4 py-3 rounded-xl`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {expandedRowIndex !== null && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
                      onClick={closeExpandedRow}>
                      <div
                        className="bg-white w-full p-4 rounded-t-xl max-h-[500px] overflow-auto"
                        onClick={(e) => e.stopPropagation()}>
                        {children(data[expandedRowIndex], closeExpandedRow)}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {data.map((row, index) => (
                    <React.Fragment key={index}>
                      {expandedRowIndex !== index && (
                        <div
                          className="grid grid-cols-12 gap-4 p-4 border-b border-[#C3D5F124] cursor-pointer"
                          style={{ gridTemplateColumns: columnGridTemplate }}
                        >
                          {columns.map((column) => (
                            <div key={column.key} className="col-span-1">
                              {column.render
                                ? column.render(row)
                                : (row[column.key] as ReactNode)}
                            </div>
                          ))}
                          {actions.length > 0 && (
                            <div className="col-span-1 w-full flex justify-end">
                              {actions.map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row);
                                    handleRowClick(index);
                                  }}
                                  className={`${action.label.toLowerCase().includes("buy")
                                      ? "bg-[#2D947A]"
                                      : "bg-[#F14E4E]"
                                    } text-white text-sm px-4 py-3 rounded-xl`}>
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {expandedRowIndex === index && (
                        <div className="col-span-full py-4 border-b border-[#C3D5F124]">
                          {children(row, closeExpandedRow)}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}

          {(!isLoading && data) && data.length === 0 && (
            <div className="p-4 text-center">No records to show</div>
          )}

          {/* Pagination */}
          {
            data && data.length > 0 && (
              <div className="flex justify-center mt-4">
                <button
                  disabled={page === 1}
                  onClick={() => onPageChange(page - 1)}
                  className="px-4 py-2 bg-transparent cursor-pointer rounded disabled:opacity-50"
                >
                  <ChevronLeft />
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="px-4 py-2 bg-transparent cursor-pointer rounded disabled:opacity-50"
                >
                  <ChevronRight />
                </button>
              </div>
            )
          }

        </div>
      </div>
    );
  }
);

export default ExpandableTable;
