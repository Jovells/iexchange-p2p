import React, {
  useState,
  ReactNode,
  useImperativeHandle,
  forwardRef,
  ReactElement,
  useEffect,
  useRef,
} from 'react';
import Loader from '../loader/Loader';
import { X } from 'lucide-react';
import { Offer } from '@/common/api/types';
import { offerTypes } from "@/common/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useUser } from "@/common/contexts/UserContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

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
  requiresAuthToOpen?: boolean;
  columns: Column[];
  data: any[];
  carouselData?: any[];
  actions?: Action[];
  styles?: React.CSSProperties;
  isLoading: boolean;
  children: (row: any, toggleExpand: () => void) => ReactElement;
  page?: number;
  pageSize?: number;
  totalRecords?: number;
  hasNextPage?: boolean;
  onPageChange: (page: number) => void;
};

const ExpandableTable = forwardRef(
  (
    {
      columns,
      data,
      carouselData,
      actions = [],
      requiresAuthToOpen,
      styles,
      isLoading,
      children,
      page = 1,
      pageSize = 50,
      totalRecords = data.length,
      onPageChange,
      hasNextPage,
    }: ExpandableTableProps,
    ref,
  ) => {
    const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window?.innerWidth <= 768);
    const { openConnectModal } = useConnectModal();
    const { isConnected } = useUser();

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window?.innerWidth <= 768);
      };
      window?.addEventListener("resize", handleResize);
      return () => {
        window?.removeEventListener("resize", handleResize);
      };
    }, []);

    const handleRowClick = (index: number) => {
      if (requiresAuthToOpen && !isConnected) {
        return openConnectModal?.();
      }
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

    const columnGridTemplate = `repeat(${columns.length + (actions.length > 0 ? 1 : 0)}, minmax(0, 1fr))`;

    const totalPages = Math.ceil(totalRecords / pageSize);

    return (
      <div className="w-full overflow-x-auto  rounded-[8px]">
        <div className={`min-w-full `} style={styles}>
          {/* Column Headers */}
          {!isMobile && (
            <div
              className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-600  dark:bg-gray-900 rounded-xl text-white text-sm font-light"
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
                  {carouselData && carouselData.length > 0 && (
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={1}
                      centeredSlides={false}
                      loop={true}
                      autoplay={{
                        delay: 10000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      pagination={{
                        bulletActiveClass: "bg-green-500",
                        clickable: true,
                      }}
                      modules={[Autoplay, Pagination, Navigation]}
                    >
                      {carouselData.map((row, index) => (
                        <SwiperSlide key={index}>
                          <div className="pb-5 rounded-xl">
                            <MobileBotRow
                              row={row}
                              index={index}
                              columns={columns}
                              actions={actions}
                              handleRowClick={handleRowClick}
                              expandedRowIndex={expandedRowIndex}
                              children={children}
                              closeExpandedRow={closeExpandedRow}
                              columnGridTemplate={columnGridTemplate}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                  {data.map((row: Offer, index) => (
                    <MobileRow
                      key={index}
                      row={row}
                      index={index}
                      columns={columns}
                      actions={actions}
                      handleRowClick={handleRowClick}
                      expandedRowIndex={expandedRowIndex}
                      children={children}
                      closeExpandedRow={closeExpandedRow}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  {carouselData && carouselData.length > 0 && (
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={1}
                      centeredSlides={true}
                      loop={true}
                      autoplay={{
                        delay: 10000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false,
                      }}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Autoplay, Pagination, Navigation]}
                    >
                      {carouselData.map((row, index) => (
                        <SwiperSlide key={index}>
                          <BotRow
                            row={row}
                            index={index}
                            columns={columns}
                            actions={actions}
                            handleRowClick={handleRowClick}
                            expandedRowIndex={expandedRowIndex}
                            children={children}
                            closeExpandedRow={closeExpandedRow}
                            columnGridTemplate={columnGridTemplate}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                  {data.map((row, index) => (
                    <React.Fragment key={index}>
                      <DesktopRow
                        row={row}
                        index={index}
                        columns={columns}
                        actions={actions}
                        handleRowClick={handleRowClick}
                        expandedRowIndex={expandedRowIndex}
                        children={children}
                        closeExpandedRow={closeExpandedRow}
                        columnGridTemplate={columnGridTemplate}
                      />
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
                      onClick={() => onPageChange(0)}
                      className={`px-4 py-2 rounded-[8px] border ${
                        page === 0 ? "bg-[#01A2E4] text-white hover:bg-[#01A2E4]" : "bg-transparent text-[#01a2e4]"
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
                            : "bg-transparent text-[#01a2e4]"
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
                        : "bg-transparent text-[#01a2e4]"
                    } hover:bg-blue-200 transition-colors duration-200`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  disabled={!hasNextPage}
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
  },
);

export default ExpandableTable;

interface ModalProps {
  closeExpandedRow: () => void;
  data: any[];
  expandedRowIndex: number;
  children: (data: any, closeExpandedRow: () => void) => React.ReactNode;
}

const BottomUpModal: React.FC<ModalProps> = ({ closeExpandedRow, data, expandedRowIndex, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    // Trigger the animation
    setIsVisible(true);

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleClose = () => {
    // Set visibility to false to animate it out before closing
    setIsVisible(false);
    setTimeout(() => closeExpandedRow(), 300); // Wait for the animation to finish before closing
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className={`flex flex-col bg-white dark:bg-gray-800 w-full rounded-t-xl max-h-[500px] transition-transform duration-300 transform ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 py-6 border-b border-gray-600 flex flex-row justify-between items-center">
          <h1 className="text-black dark:text-white">Buy</h1>
          <X className="text-black dark:text-white cursor-pointer" onClick={handleClose} />
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-auto" onClick={e => e.stopPropagation()}>
          {children(data[expandedRowIndex], handleClose)}
        </div>
      </div>
    </div>
  );
};

const ExpandableRow: React.FC<{ expanded: boolean; children: React.ReactNode }> = ({ expanded, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setIsAnimating(true);
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setIsAnimating(true);
      setHeight("0px");
    }
  }, [expanded]);

  const handleTransitionEnd = () => setIsAnimating(false);

  return (
    <div
      className={`col-span-full overflow-hidden transition-all duration-500 ease-in-out border-b border-[#C3D5F124] dark:border-gray-600 ${
        expanded ? "opacity-100" : "opacity-0"
      }`}
      style={{ maxHeight: height }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div ref={contentRef} className="py-4">
        {children}
      </div>
    </div>
  );
};

interface RowProps {
  row: Offer;
  index: number;
  columns: Column[];
  actions: Action[];
  handleRowClick: (index: number) => void;
  expandedRowIndex: number | null;
  children: (row: any, toggleExpand: () => void) => ReactElement;
  closeExpandedRow: () => void;
  columnGridTemplate?: string;
}

const MobileRow: React.FC<RowProps> = ({
  row,
  index,
  columns,
  actions,
  handleRowClick,
  expandedRowIndex,
  children,
  closeExpandedRow,
}) => (
  <div
    key={index}
    className="bg-white dark:bg-gray-700 mb-4 p-4 rounded-xl border-b border-[#C3D5F173] dark:border-gray-600"
  >
    {columns.map(column => (
      <div key={column.key} className="mb-2 text-black dark:text-white">
        <span>{column.render ? column.render(row) : (row[column.key as keyof Offer] as ReactNode)}</span>
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
    {expandedRowIndex === index && (
      <BottomUpModal closeExpandedRow={closeExpandedRow} data={[row]} expandedRowIndex={0} children={children} />
    )}
  </div>
);
const MobileBotRow: React.FC<RowProps> = ({
  row,
  index,
  columns,
  actions,
  handleRowClick,
  expandedRowIndex,
  children,
  closeExpandedRow,
}) => (
  <div key={index} className="bg-white dark:bg-gray-700 mb-4 p-4 rounded-xl border border-primary">
    {columns.map(column => (
      <div key={column.key} className="mb-2 text-black dark:text-white">
        <span>{column.render ? column.render(row) : (row[column.key as keyof Offer] as ReactNode)}</span>
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
    {expandedRowIndex === index && (
      <BottomUpModal closeExpandedRow={closeExpandedRow} data={[row]} expandedRowIndex={0} children={children} />
    )}
  </div>
);

const DesktopRow: React.FC<RowProps> = ({
  row,
  index,
  columns,
  actions,
  handleRowClick,
  expandedRowIndex,
  children,
  columnGridTemplate,
  closeExpandedRow,
}) => (
  <>
    {expandedRowIndex !== index && (
      <div
        className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-600 cursor-pointer`}
        style={{ gridTemplateColumns: columnGridTemplate }}
      >
        {columns.map(column => (
          <div key={column.key} className="col-span-1 text-black dark:text-white">
            {column.render ? column.render(row) : (row[column.key as keyof typeof row] as ReactNode)}
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
                    row.offerType === offerTypes.buy
                      ? "bg-[#2ebd85] hover:bg-[#249d6e]"
                      : "bg-[#F14E4E] hover:bg-[#d13e3e]"
                  } text-white text-sm px-4 py-3 rounded-xl min-w-[130px] transition-colors duration-200`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    )}
    <ExpandableRow expanded={expandedRowIndex === index}>{children(row, closeExpandedRow)}</ExpandableRow>
  </>
);

const BotRow: React.FC<RowProps> = ({
  row,
  index,
  columns,
  actions,
  handleRowClick,
  expandedRowIndex,
  children,
  columnGridTemplate,
  closeExpandedRow,
}) => (
  <>
    {expandedRowIndex !== index && (
      <div
        className={`grid grid-cols-12 gap-4 p-4 mt-2 rounded-xl border border-primary  cursor-pointer `}
        style={{ gridTemplateColumns: columnGridTemplate }}
      >
        {columns.map(column => (
          <div key={column.key} className="col-span-1 text-black dark:text-white">
            {column.render ? column.render(row) : (row[column.key as keyof typeof row] as ReactNode)}
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
                    row.offerType === offerTypes.buy
                      ? "bg-[#2ebd85] hover:bg-[#249d6e]"
                      : "bg-[#F14E4E] hover:bg-[#d13e3e]"
                  } text-white text-sm px-4 py-3 rounded-xl min-w-[130px] transition-colors duration-200`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    )}
    <ExpandableRow expanded={expandedRowIndex === index}>{children(row, closeExpandedRow)}</ExpandableRow>
  </>
);