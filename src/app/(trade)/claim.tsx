import { useModal } from '@/common/contexts/ModalContext';
import { useUser } from '@/common/contexts/UserContext';
import ClaimModal from '@/components/modals/ClaimModal';
import Button from "@/components/ui/Button";
import React from "react";
import { FaFaucet } from "react-icons/fa";

interface Props {
  className: string;
}
const Claim: React.FC<Props> = ({ className }) => {
  const { isConnected, openAuthModal } = useUser();
  const { showModal, hideModal } = useModal();

  const showClaimModal = () => {
    if (isConnected) {
      const modal = <ClaimModal />;
      showModal(modal);
    } else {
      openAuthModal?.();
    }
  };
  return (
    <Button
      // icon={<FaFaucet />}
      iconPosition="left"
      text="Faucet"
      onClick={showClaimModal}
      className={`bg-gradient-to-r transition duration-300 bg-[#01A2E4] hover:bg-[#0191C8] text-white rounded px-4 py-2 font-bold  border-blue-300 dark:border-[#01a2e4] ${className}`}
    />
  );
};

export default Claim;