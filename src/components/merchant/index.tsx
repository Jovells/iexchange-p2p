'use client'

import React, { useCallback, useEffect, useState } from 'react';
import Button from '../ui/Button';
import { useModal } from '@/common/contexts/ModalContext';
import MerchantModal from "./MerchantModal";
import { useRouter } from "next/navigation";
import { useContracts } from "@/common/contexts/ContractContext";
import { POST_AD_PAGE } from "@/common/page-links";
import useIsMerchant from "@/common/hooks/useIsMerchant";
import { useUser } from "@/common/contexts/UserContext";
import { getImage } from "@/lib/utils";

const BecomeAMerchant = () => {
  const { isMerchant, isLoading } = useIsMerchant();
  const router = useRouter();
  const { openAuthModal } = useUser();
  const { isConnected } = useUser();
  const { showModal, hideModal } = useModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = useCallback(() => {
    if (!isConnected) {
      openAuthModal?.();
      return;
    }

    if (isMerchant) {
      router.push(POST_AD_PAGE);
      return;
    }

    const content = <MerchantModal hideModal={hideModal} action="stake" />;
    showModal(content);
  }, [isConnected, isMerchant, showModal, hideModal]);

  const exportIcon = getImage("export.svg");
  const addIcon = getImage("add-circle.svg");

  if (isLoading) {
    return null;
  }

  return (
    <Button
      text={isMerchant ? "Post an Ad" : "Become a Merchant"}
      icon={isMerchant ? addIcon : exportIcon}
      iconPosition="left"
      className="transition duration-300 bg-[#01A2E4] text-white hover:bg-[#0191C8]"
      onClick={handleClick}
      loading={isLoading}
    />
  );
};

export default BecomeAMerchant;
