import { Token } from "@/common/api/types";
import { useContracts } from "@/common/contexts/ContractContext";
import { useUser } from "@/common/contexts/UserContext";
import Loader from "@/components/loader/Loader";
import ToolTip from "@/components/toolTip";
import Button from "@/components/ui/Button";
import { useCopyToClipboard } from "@/lib/utils";
import { formatUnits } from "ethers";
import { Copy } from "lucide-react";
import { useReadContract } from "wagmi";

interface CryptoButtonProps {
  token: Token;
  selectedCrypto?: Token;
  column?: boolean;
}

const CryptoButton: React.FC<CryptoButtonProps> = ({ token, selectedCrypto, column = true }) => {
  const { tokens } = useContracts();
  const CopyToClipboard = useCopyToClipboard();
  const { address } = useUser();
  const enabled = !!address && token.id !== "0x0";
  const {
    data: balance,
    isLoading,
    queryKey,
  } = useReadContract({
    address: token.id as `0x${string}`,
    abi: tokens[0].abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled },
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
      <span className={`flex ${column ? "flex-col" : "items-center"} `}>
        <span className="">
          {token.symbol}
          {enabled && (
            <ToolTip text="Copy token address to clipboard">
              <Button
                onClick={() => CopyToClipboard(token.id, "Token Address copied to clipboard")}
                title="Copy to clipboard"
                className="hover:bg-[#01a2e4] hover:text-white  transition duration-300 ease-in-out"
              >
                <Copy size={12} />
              </Button>
            </ToolTip>
          )}
        </span>
        {enabled && (
          <p className="bg-gray-100 text-xs text-gray-400  rounded-[3.5px] px-1 py-0.5 dark:bg-gray-700 ">
            {!isLoading ? "Balance: " + formattedBalance : <Loader size="xs" className="text-xs" loaderType="text" />}
          </p>
        )}
      </span>
    </span>
  );
}; 

export default CryptoButton;
