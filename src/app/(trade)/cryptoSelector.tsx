import { Token } from "@/common/api/types";
import { Filter } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { useContracts } from "@/common/contexts/ContractContext";
import Button from "@/components/ui/Button";
import ClaimModal from "@/components/modals/ClaimModal";
import { useModal } from "@/common/contexts/ModalContext";
import { Dispatch, SetStateAction } from "react";
import Loader from "@/components/loader/Loader";


interface CryptoSelectorProps {
  tokens: Token[];
  selectedCrypto?: Token;
  setSelectedCrypto: Dispatch<SetStateAction<Token | undefined>>;
}

const CryptoSelector: React.FC<CryptoSelectorProps> = ({
  tokens,
  selectedCrypto,
  setSelectedCrypto,
}) => {
  const { address } = useAccount();
  const { showModal, hideModal} = useModal();


  const showClaimModal = () =>{
    const modal = <ClaimModal />
    showModal(modal);
}

  return (
    <div className="bg-white border-0 border-gray-200 rounded-xl">
      <div className="hidden sm:flex justify-start items-center space-x-4 p-1 px-3">
        {tokens.map((token) => (
          <CryptoButton
        key={token.id}
        token={token}
        selectedCrypto={selectedCrypto}
        setSelectedCrypto={setSelectedCrypto}
          />
        ))}
        <Button text="Claim" 
        onClick = {showClaimModal}
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl px-4 py-2 font-bold shadow-lg hover:from-yellow-500 hover:to-yellow-700 border border-yellow-300"
        />
      </div>
      <div className="sm:hidden flex flex-row items-center space-x-6">
        <select
          value={selectedCrypto?.symbol}
          onChange={(e) =>
            setSelectedCrypto(tokens.find((t) => t.symbol === e.target.value)!)
          }
          className="w-full px-6 py-2 rounded-xl text-md bg-white border border-gray-300 text-gray-600 outline-none"
        >
          {tokens.map((crypto) => (
            <option key={crypto.id} value={crypto.symbol}>
              {crypto.symbol}
            </option>
          ))}
        </select>

        <Filter className="cursor-pointer w-10 h-10" onClick={() => { }} />
      </div>
    </div>
  );
};

interface CryptoButtonProps {
  token: Token;
  selectedCrypto?: Token;
  setSelectedCrypto: Dispatch<SetStateAction<Token | undefined>>;
}

const CryptoButton: React.FC<CryptoButtonProps> = ({
  token,
  selectedCrypto,
  setSelectedCrypto,
}) => {
    const {tokens} = useContracts()
  const { address } = useAccount();
  const { data: balance , isLoading} = useReadContract({
    address: token.id as `0x${string}`,
    abi: tokens[0].abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {enabled: !!address, }
  });

  console.log( "selector ",tokens[0].address, "balance ", balance, "address" ,address  )


  const formattedBalance = balance ? parseFloat(formatUnits(balance, 18)).toFixed(2) : "0.00";

  return (
    <button
      onClick={() => setSelectedCrypto(oldToken=> {
        if(oldToken?.symbol === token.symbol) return undefined
        return token
      })}
      className={`py-1 px-2 rounded-full text-md flex items-center space-x-2 ${selectedCrypto?.symbol === token.symbol ? "bg-blue-500 text-white" : "text-black"
        }`}
    >
      <span>{token.symbol}</span>
       <span className="bg-gray-200 text-xs text-gray-700 rounded-full px-2 py-1">
      {!isLoading ? "Balance: " + formattedBalance : <Loader loaderType="text"/>}
      </span>
    </button>
  );
};


export default CryptoSelector;