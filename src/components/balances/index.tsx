import CryptoButton from '@/app/(trade)/cryptoButton'
import { useModal } from '@/common/contexts/ModalContext'
import useMarketData from '@/common/hooks/useMarketData'
import { Wallet, X } from 'lucide-react'
import React from 'react'
import Button from "../ui/Button";
import { useUser } from '@/common/contexts/UserContext'

const Balances = () => {
  const { showModal, hideModal } = useModal();
  const { tokens: marketDataToken } = useMarketData();
  const { session } = useUser();
  const isAuthenticated = session?.status === "authenticated";

  if(!isAuthenticated){
    return null;
  }

  const modalHandler = () => {
    showModal(
      <div className="w-full  min-h-[250px]  dark:bg-gray-800  rounded-xl">
        <div className="border-b border-gray-700 flex flex-row justify-between p-4">
          <div>Balances</div>
          <X onClick={hideModal} />
        </div>
        <div className="p-0">
          {marketDataToken &&
            marketDataToken.map(crypto => (
              <div key={crypto.id} className="px-4 py-3 cursor-pointer dark:text-gray-300">
                <CryptoButton isInModal column={false} token={crypto} />
              </div>
            ))}
        </div>
      </div>,
    );
  };
  return (
    <Button
      icon={<Wallet size={18} />}
      iconPosition="left"
      onClick={modalHandler}
      className="border-0 lg:border lg:border-primary  rounded-[8px]"
    >
      <span className="hidden lg:block">Balances</span>
    </Button>
  );
};

export default Balances