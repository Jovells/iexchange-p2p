'use client'

import { X } from "lucide-react";
import Button from "../ui/Button";
import InputWithSelect from "../ui/InputWithSelect";
import { currencies } from "@/common/data/currencies";
import { useWriteContract } from "wagmi";
import CediH from "@/common/abis/CediH";
import { MORPH_CEDIH_ADDRESS, MORPH_P2P_ADDRESS } from "@/common/contracts";
import OptimisticP2P from "@/common/abis/OptimisticP2P";

const MerchantModal = ({ hideModal, action }: { hideModal: () => void; action: string }) => {
    const { writeContractAsync, data: hash } = useWriteContract();

    const handleStake = async () => {
        const stakeAmount = BigInt(1500 * 1e18)
        const approveHash = await writeContractAsync({
            abi: CediH,
            address: MORPH_P2P_ADDRESS,
            functionName: "approve",
            args: [MORPH_CEDIH_ADDRESS, stakeAmount],
        });

        console.log("approveHash", approveHash);

        const hash = await writeContractAsync({
            abi: OptimisticP2P,
            address: MORPH_P2P_ADDRESS,
            functionName: "registerMerchant",
        });
        console.log("p2phash", hash);
    }

    return (
        <div className='w-full lg:w-[500px] h-auto bg-[#ffffff] p-8 rounded-xl shadow-md border-2-gray-500'>
            <div className='flex justify-end'>
                <X onClick={hideModal} className='cursor-pointer' />
            </div>
            {action === "verify" && (
                <>
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-gray-700 text-lg'>Let’s Verify Your identification</h2>
                        <p className='text-gray-500 text-sm'>Please provide all neccesary infomartion. Note that all your information is Safe.</p>
                    </div>
                    <Button
                        text="Proceed"
                        className="bg-[#000000] text-white hover:bg-gray-600 rounded-xl px-4 py-2 mt-12 w-full"
                        onClick={() => { }}
                    />
                </>
            )}
            {action === "stake" && (
                <>
                    <div className='flex flex-col gap-6 mb-4'>
                        <h2 className='text-gray-700 text-lg'>Merchant Stake</h2>
                        <p className='text-gray-500 text-sm'>Stake any currency up to 10USDT to Continue the Process of becoming a Merchant.</p>
                    </div>
                    <InputWithSelect
                        label="Stake Amount"
                        initialCurrency="GHS"
                        currencies={currencies}
                        onValueChange={(value) => console.log(value)}
                        value="1500"
                        readOnly={true}
                        placeholder="Enter amount"
                        selectIsReadOnly={true}
                    />
                    <Button
                        text="Proceed"
                        className="bg-[#000000] text-white hover:bg-gray-600 rounded-xl px-4 py-2 mt-6 w-full"
                        onClick={handleStake}
                    />
                </>
            )}
        </div>
    )
}

export default MerchantModal