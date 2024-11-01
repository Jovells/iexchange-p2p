'use client'

import React from 'react';
import Button from '../ui/Button';
import { useModal } from '@/common/contexts/ModalContext';
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  title?: string;
  modalType?: "success" | "error" | "info" | "warning";
  icon?: React.ReactNode | string;
  description?: string;
  buttonClick?: () => Promise<void>;
  buttonText?: string;
}

const ModalAlert: React.FC<Props> = ({
  modalType,
  icon,
  description,
  title,
  buttonClick,
  buttonText,
}) => {
  const [loading, setLoading] = React.useState(false);
  const { hideModal } = useModal();

  const handleClick = async () => {
    if (buttonClick) {
      try {
        setLoading(true);
        await buttonClick();
        setLoading(false);
        hideModal();
      } catch (error) {
        setLoading(false);
        console.error("Button click handler failed:", error);
      }
    } else {
      hideModal();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800">
      <div className="w-full flex flex-row justify-end">
        <button
          onClick={hideModal}
          aria-label="Close modal"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <X />
        </button>
      </div>
      <div className="flex p-10 flex-col justify-center items-center gap-8 shadow-xl rounded-xl py-10 w-[500px] min-h-[250px]">
        {icon ? (
          typeof icon === "string" ? (
            <img src={icon} alt="icon" className="h-28 w-28" />
          ) : (
            icon
          )
        ) : (
          modalType && (
            <div className={`h-20 w-20 flex items-center justify-center rounded-full`}>
              {modalType === "success" && (
                <Image width={50} height={50} src="/images/light/success.png" alt="success" className="h-16 w-16" />
              )}
              {modalType === "error" && (
                <Image width={50} height={50} src="/images/light/error.png" alt="error" className="h-16 w-16" />
              )}
              {modalType === "warning" && (
                <Image width={50} height={50} src="/images/light/warning.png" alt="warning" className="h-16 w-16" />
              )}
              {modalType === "info" && (
                <Image width={50} height={50} src="/images/light/info.png" alt="info" className="h-16 w-16" />
              )}
            </div>
          )
        )}
        <h1 className="text-center text-lg text-black dark:text-white">{title}</h1>
        <p className="text-md text-gray-400 dark:text-gray-300 text-center px-6">{description}</p>
        <div className="flex gap-2">
          <Button
            loading={loading}
            text={buttonText}
            onClick={handleClick}
            className="bg-transparent border rounded-xl border-gray-200 dark:border-gray-600 px-10 py-1 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalAlert;
