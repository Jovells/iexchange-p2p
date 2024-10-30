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
import CryptoButton from "./cryptoButton";
import Select from "@/components/ui/Select";

interface CryptoSelectorProps {
  tokens: Token[];
  selectedCrypto?: Token;
  setSelectedCrypto: Dispatch<SetStateAction<Token | undefined>>;
  showFaucet?:boolean
}

const CryptoSelector: React.FC<CryptoSelectorProps> = ({ tokens, selectedCrypto, setSelectedCrypto, showFaucet=true }) => {
  return (
    <>
      <div className="hidden sm:flex justify-start items-center space-x-4">
        <Select
          options={[{ id: "0x0", name: "All Tokens", symbol: "All Tokens" }, ...tokens]}
          column={false}
          onValueChange={value => setSelectedCrypto(value?.id === "0x0" ? undefined : value)}
        />
      </div>
      <CryptoSelectorInput
        tokens={tokens}
        selectedCrypto={selectedCrypto}
        setSelectedCrypto={(value: any) => setSelectedCrypto(value)}
      />
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
    </>
  );
};





export default CryptoSelector;
