import { Token } from "@/common/api/types";
import { useContracts } from "@/common/contexts/ContractContext";
import { useUser } from "@/common/contexts/UserContext";
import Loader from "@/components/loader/Loader";
import Button from "@/components/ui/Button";
import { useCopyToClipboard } from "@/lib/utils";
import { formatUnits } from "ethers";
import { ClipboardCopy, ClipboardCopyIcon } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { useReadContract } from "wagmi";

interface CryptoButtonProps {
  token: Token;
  selectedCrypto?: Token;
  setSelectedCrypto?: Dispatch<SetStateAction<Token | undefined>>;
}

const CryptoButton: React.FC<CryptoButtonProps> = ({ token, selectedCrypto, setSelectedCrypto }) => {
  const { tokens, currentChain } = useContracts();
  const CopyToClipboard = useCopyToClipboard();
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
    <span
      // onClick={e => {
      //   console.log("crytobuton qj", token);
      //   setSelectedCrypto?.(oldToken => {
      //     if (oldToken?.symbol === token.symbol) return undefined;
      //     return token;
      //   });
      // }}
      className={`px-1.5  w-full rounded-[7px] text-md flex items-center justify-between space-x-2 ${
        selectedCrypto?.symbol === token.symbol ? "  text-[#01a2e4]" : "text-black dark:text-gray-300"
      } hover:bg-gray-100 dark:hover:bg-gray-600  transition duration-300 ease-in-out`}
    >
      <span className="flex items-center space-x-2">
        <span className="">{token.symbol}</span>
        <p className="bg-gray-100 text-xs rounded-[3.5px] px-2 py-0.5 dark:bg-gray-700 ">
          {!isLoading ? "Balance: " + formattedBalance : <Loader size="xs" className="text-xs" loaderType="text" />}
        </p>
      </span>
      <Button
        onClick={() => CopyToClipboard(token.id, "Token Address copied to clipboard")}
        title="Copy to clipboard"
        className="hover:bg-[#01a2e4] hover:text-white  transition duration-300 ease-in-out"
      >
        <ClipboardCopyIcon size={16} />
      </Button>
    </span>
  );
}; 

export default CryptoButton;
