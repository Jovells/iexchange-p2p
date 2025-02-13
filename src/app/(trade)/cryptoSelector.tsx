import { Token } from "@/common/api/types";
import CryptoSelectorInput from "./cryptoSelectorInput";
import Claim from "./claim";
import Select from "@/components/ui/Select";

interface CryptoSelectorProps {
  tokens: Token[];
  selectedCrypto?: Token;
  setSelectedCrypto: (crypto: Token | undefined) => void;
  showFaucet?: boolean;
}

const CryptoSelector: React.FC<CryptoSelectorProps> = ({
  tokens,
  selectedCrypto,
  setSelectedCrypto,
  showFaucet = true,
}) => {
  return (
    <>
      <div className="hidden sm:flex justify-start items-center space-x-4">
        <Select
          initialValue={selectedCrypto}
          options={tokens}
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
