'use client';

import { useModal } from "@/common/contexts/ModalContext";
import { classnames } from "@/common/helpers";
import { useEffect, useState } from "react";

const ModalManager: React.FC = () => {
  const { modalContent, modalProps, hideModal } = useModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || modalContent === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-gray-700 opacity-75 dark:bg-gray-900 dark:opacity-80"
        onClick={hideModal}
        aria-hidden="true"
      ></div>
      <div
        className={classnames(
          "relative rounded-lg z-20 p-6",
          modalProps?.hasPadding
            ? "bg-white border border-gray-300 text-black dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            : ""
        )}
      >
        {/* <button
          className="absolute top-0 right-0 p-4 cursor-pointer"
          onClick={hideModal}
          aria-label="Close modal"
        >
          &times;
        </button> */}
        {modalContent}
      </div>
    </div>
  );
};

export default ModalManager;
