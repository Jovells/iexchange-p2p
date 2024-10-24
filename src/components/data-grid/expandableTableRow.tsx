import { Offer } from "@/common/api/types";
import React, { ReactNode, MouseEvent, useRef, useEffect, useState, ReactElement } from "react";

interface Column {
  key: string;
  render?: (row: any) => ReactNode;
}

type Action = {
  label: ((row: Offer) => ReactNode) | string;
  onClick: (row: Offer) => void;
};

interface ExpandableTableRowProps {
  index: number;
  columnGridTemplate: string;
  row: any;
  expandedRowIndex: number | null;
  closeExpandedRow: () => void;
  columns: Column[];
  actions: Action[];
  handleRowClick: (index: number) => void;
  data: any[];
  children: (row: any, toggleExpand: () => void) => ReactElement;
}

export function ExpandableTableRow({
  index,
  columnGridTemplate,
  row,
  columns,
  expandedRowIndex,
  closeExpandedRow,
  actions,
  children,
  handleRowClick,
  data,
}: ExpandableTableRowProps) {
  return (
    <>
      <div
        className={`grid grid-cols-12 gap-4 p-4 ${
          index + 1 === data.length ? "border-b" : "border-b"
        } border-gray-200 dark:border-gray-600 cursor-pointer`}
        style={{
          gridTemplateColumns: columnGridTemplate,
        }}
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
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    action.onClick(row);
                    handleRowClick(index);
                  }}
                  className={`${
                    row.offerType === "buy" ? "bg-[#2ebd85] hover:bg-[#249d6e]" : "bg-[#F14E4E] hover:bg-[#d13e3e]"
                  } text-white text-sm px-4 py-3 rounded-xl min-w-[130px] transition-colors duration-200`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <ExpandableRow expanded={expandedRowIndex === index}>{children(row, closeExpandedRow)}</ExpandableRow>
      {/* {expandedRowIndex === index && (
                        <div className="col-span-full py-4 border-b border-[#C3D5F124] dark:border-gray-600">
                          {children(row, closeExpandedRow)}
                        </div>
                      )} */}
    </>
  );
}

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
