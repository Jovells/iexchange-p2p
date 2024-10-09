import { Token } from "@/common/api/types";
import { Filter } from "lucide-react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { useContracts } from "@/common/contexts/ContractContext";
import Button from "@/components/ui/Button";
import ClaimModal from "@/components/modals/ClaimModal";
import { useModal } from "@/common/contexts/ModalContext";
import { Dispatch, SetStateAction } from "react";
import Loader from "@/components/loader/Loader";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useUser } from "@/common/contexts/UserContext";
import CryptoSelectorInput from "./cryptoSelectorInput";
import Claim from "./claim";

interface CryptoSelectorProps {
  tokens: Token[];
  selectedCrypto?: Token;
  setSelectedCrypto: Dispatch<SetStateAction<Token | undefined>>;
}

const CryptoSelector: React.FC<CryptoSelectorProps> = ({ tokens, selectedCrypto, setSelectedCrypto }) => {

  return (
    <div className="bg-transparent border-0 lg:border border-gray-200 rounded-[8px] dark:border-gray-700">
      <div className="hidden sm:flex justify-start items-center space-x-4 p-2 px-3">
        {tokens.map(token => (
          <CryptoButton
            key={token.id}
            token={token}
            selectedCrypto={selectedCrypto}
            setSelectedCrypto={setSelectedCrypto}
          />
        ))}
      </div>
      <CryptoSelectorInput tokens={tokens} selectedCrypto={selectedCrypto} setSelectedCrypto={(value: any) => setSelectedCrypto(value)} />
      <Claim className="w-full mt-4 block lg:hidden" />
      {/* <div className="sm:hidden flex flex-row items-center space-x-6">
        <select
          value={selectedCrypto?.symbol}
          onChange={e => setSelectedCrypto(tokens.find(t => t.symbol === e.target.value)!)}
          className="w-full px-6 py-4 rounded-xl text-md bg-white border border-gray-300 text-gray-600 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
        >
          {tokens.map(crypto => (
            <option key={crypto.id} value={crypto.symbol}>
              {crypto.symbol}
            </option>
          ))}
        </select>
      </div> */}
    </div>
  );
};

interface CryptoButtonProps {
  token: Token;
  selectedCrypto?: Token;
  setSelectedCrypto: Dispatch<SetStateAction<Token | undefined>>;
}

const CryptoButton: React.FC<CryptoButtonProps> = ({ token, selectedCrypto, setSelectedCrypto }) => {
  const { tokens } = useContracts();
  const { address } = useUser();
  const {
    data: balance,
    isLoading,
    queryKey,
  } = useReadContract({
    address: token.id as `0x${string}`,
    abi: tokens[0].abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  console.log("qoqueryKey: ", queryKey);

  const formattedBalance = balance ? parseFloat(formatUnits(balance, 18)).toFixed(2) : "0.00";

  return (
    <button
      onClick={() =>
        setSelectedCrypto(oldToken => {
          if (oldToken?.symbol === token.symbol) return undefined;
          return token;
        })
      }
      className={`px-1.5 p-1 rounded-[7px] text-md flex items-center space-x-2 ${
        selectedCrypto?.symbol === token.symbol ? "  text-[#01a2e4]" : "text-black dark:text-gray-300"
      } hover:bg-gray-100 dark:hover:bg-gray-600  transition duration-300 ease-in-out`}
    >
      <span className="">{token.symbol}</span>
      <span className="bg-gray-100 text-xs rounded-[3.5px] px-2 py-0.5 dark:bg-gray-700 ">
        {!isLoading ? "Balance: " + formattedBalance : <Loader size="xs" className="text-xs" loaderType="text" />}
      </span>
    </button>
  );
};

export default CryptoSelector;
