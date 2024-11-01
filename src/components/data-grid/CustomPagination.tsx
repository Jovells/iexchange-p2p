import React, { useEffect } from 'react';

interface CustomPaginationProps {
    totalPages?: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, onPageChange, hasNextPage }) => {

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
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
      <div className="flex items-center space-x-4 justify-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage < 1}
          className="px-4 py-2 bg-transparent cursor-pointer rounded disabled:opacity-50 text-black dark:text-white"
        >
          Prev
        </button>

        <span className="text-lg font-semibold">{currentPage + 1}</span>

        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-transparent cursor-pointer rounded disabled:opacity-50 text-black dark:text-white"
        >
          Next
        </button>
      </div>
    );
};

export default CustomPagination;
