import React, { useEffect } from 'react';

interface CustomPaginationProps {
    totalPages?: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, onPageChange, hasNextPage }) => {

    const handlePrevious = () => {
      if (currentPage > 0) {
        onPageChange(currentPage - 1);
      }
      // scrollToTop()
    };

    const handleNext = () => {
      if (hasNextPage) {
        onPageChange(currentPage + 1);
      }
      // scrollToTop()
    };

    // const handleScroll = () => {
    //     const scrollY = window.scrollY || document.documentElement.scrollTop;
    // };

    // const scrollToTop = () => {
    //     window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth',
    //     });
    // };

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    return (
      <div className="flex items-center space-x-2 justify-center mt-4">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage < 1}
          className="px-4 py-2 bg-transparent disabled:text-gray-400 cursor-pointer rounded disabled:opacity-50 text-black dark:text-white hover:text-primary dark:hover:bg-gray-700"
        >
          First
        </button>
        <button
          onClick={handlePrevious}
          disabled={currentPage < 1}
          className="px-4 py-2 bg-transparent cursor-pointer disabled:text-gray-400  rounded disabled:opacity-50 text-black dark:text-white hover:text-primary dark:hover:bg-gray-700"
        >
          Prev
        </button>

        <span className="text-lg rounded w-8 h-8 flex justify-center items-center border border-primary font-semibold">
          {currentPage + 1}
        </span>

        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-transparent cursor-pointer disabled:text-gray-400 rounded disabled:opacity-50 text-black dark:text-white hover:text-primary dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    );
};

export default CustomPagination;
