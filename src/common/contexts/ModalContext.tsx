'use client'

import { createContext, useContext, ReactNode, FC, useState } from "react";

type ModalProps = {
  hasPadding?: boolean;
};
interface ModalContextType {
  showModal: (content: ReactNode, options?: ModalProps) => void;
  hideModal: () => void;
  modalContent: ReactNode | null;
  modalProps?: ModalProps | null;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalProps, setModalProps] = useState<ModalProps | null>(null);

  const showModal = (content: ReactNode, options?: ModalProps) => {
    setModalContent(content);
    if (options) {
      setModalProps(options);
    }
  };

  const hideModal = () => {
    setModalContent(null);
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalContent, modalProps }}>
      {children}
    </ModalContext.Provider>
  );
};