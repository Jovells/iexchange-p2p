import { Token } from "@/common/api/types";
import { useContracts } from "@/common/contexts/ContractContext";
import { useUser } from "@/common/contexts/UserContext";
import Loader from "@/components/loader/Loader";
import { formatUnits } from "ethers";
import { useReadContract } from "wagmi";

interface CryptoWithBalanceListProps {
    token: Token;
    selectedCrypto?: Token;
    column?: boolean;
}

const CryptoWithBalanceList: React.FC<CryptoWithBalanceListProps> = ({ token }) => {
    const { tokens } = useContracts();
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

    const formattedBalance = balance ? parseFloat(formatUnits(balance, 18)).toFixed(2) : "0.00";

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between">
                {enabled && (
                    <>
                        <div>{token.symbol}</div>
                        <div className="text-gray-400">
                            {!isLoading ? formattedBalance : <Loader size="xs" className="text-xs" loaderType="text" />}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CryptoWithBalanceList;
