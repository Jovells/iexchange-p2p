'use client'

import { X } from "lucide-react";
import Button from "../ui/Button";
import InputWithSelect from "../ui/InputWithSelect";
import { cryptoTokens } from "@/common/data/currencies";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import CediH from "@/common/abis/CediH";
import OptimisticP2P from "@/common/abis/OptimisticP2P";
import { useModal } from "@/common/contexts/ModalContext";
import ModalAlert from "../modals";
import { useContracts } from "@/common/contexts/ContractContext";
import { useState } from "react";
import toast from "react-hot-toast";

interface MerchantModalProps {
    hideModal: () => void;
    action: "verify" | "stake";
}

const MerchantModal: React.FC<MerchantModalProps> = ({ hideModal, action }) => {
    const { writeContractAsync } = useWriteContract();
    const account = useAccount();
    const [isStaking, setIsStaking] = useState(false);
    const { showModal } = useModal()
    const {p2p, tokens} = useContracts();


    const { data: allowance } = useReadContract({
        abi: CediH,
        address: tokens[0].address,
        functionName: "allowance",
        args: [account.address!, p2p.address],
    })

    const handleStake = async () => {
        setIsStaking(true);
        const id = toast.loading("Staking...");
        try {
            const stakeAmount = BigInt(1500 * 1e18);
            if (allowance! < stakeAmount) {
                const approveHash = await writeContractAsync({
                    abi: CediH,
                    address: tokens[0].address,
                    functionName: "approve",
                    args: [p2p.address, stakeAmount],
                });
                console.log("Approved:", approveHash);
            }
            else {
                console.log("Already Approved")
            }


            const registerHash = await writeContractAsync({
                abi: OptimisticP2P,
                address: p2p.address,
                functionName: "registerMerchant",
            });
            console.log("Registered:", registerHash);
            const content = <ModalAlert buttonText="Done" buttonClick={async () => { }} modalType="success" title="Successfully Staked" description="You have successfully secured a merchant placement." icon="../../images/icons/success.png" />
            showModal(content)
            
        } catch (error) {
            toast.error("Error staking", { id });
            console.error("Error handling stake:", error);
        }
        finally{
            toast.dismiss(id);
            setIsStaking(false);
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
                        initialCurrency="CEDIH"
                        currencies={cryptoTokens as unknown as { symbol: string; name: string, icon: JSX.Element; id: `0x${string}` }[]}
                        onValueChange={(value) => console.log(value)}
                        value="1500"
                        readOnly
                        placeholder="Enter amount"
                        selectIsReadOnly
                    />
                    <Button
                        text="Proceed"
                        loading={isStaking}
                        className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2 mt-6 w-full"
                        onClick={handleStake}
                    />
                </>
            )}
        </div>
    );
}

export default MerchantModal;
