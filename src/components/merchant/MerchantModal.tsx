'use client'

import { X } from "lucide-react";
import Button from "../ui/Button";
import InputWithSelect from "../ui/InputWithSelect";
import { cryptoTokens, currencies } from "@/common/data/currencies";
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import CediH from "@/common/abis/CediH";
import { MORPH_CEDIH_ADDRESS, MORPH_P2P_ADDRESS } from "@/common/contracts";
import OptimisticP2P from "@/common/abis/OptimisticP2P";
import { useUser } from "@/common/contexts/UserContext";

interface MerchantModalProps {
    hideModal: () => void;
    action: "verify" | "stake";
}

const MerchantModal: React.FC<MerchantModalProps> = ({ hideModal, action }) => {
    const { writeContractAsync } = useWriteContract();
    const account = useAccount();

    const {data: allowance }= useReadContract({
        abi: CediH,
        address: MORPH_CEDIH_ADDRESS,
        functionName: "allowance",
        args: [account.address!, MORPH_P2P_ADDRESS],
    })

    const handleStake = async () => {
        try {
            const stakeAmount = BigInt(1500 * 1e18);
            if (allowance! < stakeAmount) {
                const approveHash = await writeContractAsync({
                    abi: CediH,
                    address: MORPH_CEDIH_ADDRESS,
                    functionName: "approve",
                    args: [MORPH_P2P_ADDRESS, stakeAmount],
                });
                console.log("Approved:", approveHash);
            }
            else{
                console.log("Already Approved")
            }


            const registerHash = await writeContractAsync({
                abi: OptimisticP2P,
                address: MORPH_P2P_ADDRESS,
                functionName: "registerMerchant",
            });
            console.log("Registered:", registerHash);
        } catch (error) {
            console.error("Error handling stake:", error);
        }
    }

    return (
        <div className='w-full lg:w-[500px] h-auto bg-white p-8 rounded-xl shadow-md border-2 border-gray-500'>
            <div className='flex justify-end'>
                <X onClick={hideModal} className='cursor-pointer' />
            </div>
            {action === "verify" && (
                <>
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-gray-700 text-lg'>Let’s Verify Your Identification</h2>
                        <p className='text-gray-500 text-sm'>Please provide all necessary information. Note that all your information is safe.</p>
                    </div>
                    <Button
                        text="Proceed"
                        className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2 mt-12 w-full"
                        onClick={() => { }} // Add functionality if needed
                    />
                </>
            )}
            {action === "stake" && (
                <>
                    <div className='flex flex-col gap-6 mb-4'>
                        <h2 className='text-gray-700 text-lg'>Merchant Stake</h2>
                        <p className='text-gray-500 text-sm'>Stake any currency up to 10 USDT to continue the process of becoming a merchant.</p>
                    </div>
                    <InputWithSelect
                        label="Stake Amount"
                        initialCurrency="ETH"
                        currencies={cryptoTokens}
                        onValueChange={(value) => console.log(value)}
                        value="1500"
                        readOnly
                        placeholder="Enter amount"
                        selectIsReadOnly
                    />
                    <Button
                        text="Proceed"
                        className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2 mt-6 w-full"
                        onClick={handleStake}
                    />
                </>
            )}
        </div>
    );
}

export default MerchantModal;
