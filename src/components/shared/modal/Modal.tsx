'use client'

import { useModal } from "@/common/contexts/ModalContext";
import { classnames } from "@/common/helpers";

const ModalManager: React.FC = () => {
  const { modalContent, modalProps, hideModal } = useModal();

  if (modalContent === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-700 opacity-75"
        onClick={hideModal}
      ></div>
      <div
        className={classnames("rounded-lg z-20 p-6", {
          "bg-black border border-gray-100 border-opacity-50 text-white":
            modalProps?.hasPadding,
        })}
      >
        <span
          className="absolute top-0 right-0 p-4 cursor-pointer"
          onClick={hideModal}
        >
          &times;
        </span>
        {modalContent}
      </div>
    </div>
  );
};

export default ModalManager;