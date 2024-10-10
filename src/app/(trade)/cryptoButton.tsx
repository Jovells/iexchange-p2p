import { Token } from "@/common/api/types";
import { useContracts } from "@/common/contexts/ContractContext";
import { useUser } from "@/common/contexts/UserContext";
import Loader from "@/components/loader/Loader";
import { formatUnits } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { useReadContract } from "wagmi";

interface CryptoButtonProps {
  token: Token;
  selectedCrypto?: Token;
  setSelectedCrypto?: Dispatch<SetStateAction<Token | undefined>>;
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
        setSelectedCrypto?.(oldToken => {
          if (oldToken?.symbol === token.symbol) return undefined;
          return token;
        })
      }
      className={`px-1.5  rounded-[7px] text-md flex items-center space-x-2 ${
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

export default CryptoButton;
