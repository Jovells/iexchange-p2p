'use client';

import { useModal } from "@/common/contexts/ModalContext";
import { classnames } from "@/common/helpers";
import { useEffect, useState } from "react";

const ModalManager: React.FC = () => {
  const { modalContent, modalProps, hideModal } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (modalContent) {
      setIsVisible(true);
      // Lock scroll when modal is visible
      document.body.classList.add('overflow-hidden');
    } else {
      setIsVisible(false);
      // Unlock scroll when modal is hidden
      document.body.classList.remove('overflow-hidden');
    }
  }, [modalContent]);

  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  if (!isMounted || modalContent === null) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-end lg:items-center rounded-[8px]"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-gray-700 opacity-75 dark:bg-gray-900 dark:opacity-80"
        aria-hidden="true"
      ></div>

      <div
        className={classnames(
          "relative z-20 transition-transform duration-300 ease-out transform",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
          "w-full sm:w-auto lg:w-[500px] rounded-t-lg lg:rounded-[8px]",
        )}
      >
        {modalContent}
      </div>
    </div>
  );
};

export default ModalManager;
