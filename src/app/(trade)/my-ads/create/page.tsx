'use client'

import Tabs from '@/components/tabs'
import Button from '@/components/ui/Button'
import InputSelect from '@/components/ui/InputSelect'
import InputWithSelect from '@/components/ui/InputWithSelect'
import Input from '@/components/ui/input'
import React, { useState } from 'react'
import RenderAddedPaymentMethod from './RenderAddedPaymentMethod'
import { useContracts } from '@/common/contexts/ContractContext'
import { useQuery } from '@tanstack/react-query'
import { fetchCurrencies } from '@/common/api/fetchCurrencies'
import { fetchTokens } from '@/common/api/fetchTokens'
import { fetchPaymentMethods } from '@/common/api/fetchPaymentMethods'
import { offerTypes, TIME_LIMITS } from '@/common/api/constants'
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract } from 'wagmi'
import storeAccountDetails from '@/common/api/storeAccountDetails'
import Loader from '@/components/loader/Loader'

const CreateAd = () => {
    const [activeTab, setActiveTab] = useState<"buy" | "sell" >("buy");
    const {p2p, indexerUrl} = useContracts();
    const router = useRouter();
    const account = useAccount();
    const [submitting, setSubmitting] = useState(false);
    const {writeContractAsync} = useWriteContract()

    const {data: currencies } = useQuery({
        queryKey: ['currencies'],
        queryFn: () => fetchCurrencies(indexerUrl)
    })
    const {data: tokens } = useQuery({
        queryKey: ['tokens'],
        queryFn: () => fetchTokens(indexerUrl)
    })
    const {data: paymentMethods } = useQuery({
        queryKey: ['paymentMethods'],
        queryFn: () => fetchPaymentMethods(indexerUrl)
    })

    const addPaymentMethod =  () =>{}
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        console.log('submitting', submitting);
        const formData = new FormData(e.currentTarget);
        const data = {
            token: formData.get('token') as `0x${string}`,
            currency: formData.get('currency') as string,
            amount: Number(formData.get('amount')),
            minOrder: BigInt(formData.get('minOrder') as string) * BigInt(10**18),
            maxOrder: BigInt(formData.get('maxOrder') as string) * BigInt(10**18),
            paymentMethod: formData.get('paymentMethod') as string,
            accountName: formData.get('accountName') as string,
            accountNumber: formData.get('accountNumber') as string,
            timeLimit: Number(formData.get('timeLimit')),
            terms: formData.get('terms') as string,
            depositAddress: formData.get('depositAddress') as `0x${string}`,
            rate: BigInt(formData.get('rate') as string),
            offerType: formData.get('offerType') as string,
        };
        console.log('data', data);
        const { token, currency, minOrder, maxOrder, paymentMethod, accountName, accountNumber, timeLimit, terms, depositAddress, rate, offerType } = data;
        const accountDetails = {
            name: accountName,
            number: accountNumber,
            address: account?.address?.toLowerCase() as string,
        }
        
        const handleContractWrite = async () => {

            try {
                const accountHash = await storeAccountDetails(accountDetails);
                const args = [
                    token,
                    currency,
                    paymentMethod ,
                    rate,
                    minOrder,
                    maxOrder,
                    accountHash,
                    depositAddress,
                    offerTypes[activeTab],
                ];
                console.log('args', args, activeTab);

            const response = await writeContractAsync({
                address: p2p.address,
                functionName: "createOffer",
                abi: p2p.abi,
                args: [
                    token,
                    currency,
                    paymentMethod ,
                    rate,
                    minOrder,
                    maxOrder,
                    accountHash,
                    depositAddress,
                    offerTypes[activeTab],
                ],
            });
            console.log('Transaction successful:', response);
            router.push('/my-ads'); // Redirect or handle success
            } catch (error) {
            console.error('Transaction failed:', error);
            // Handle error (e.g., show a notification)
            } finally {
            setSubmitting(false);
            }
        };

        await handleContractWrite();
    }

    if (!currencies || !tokens || !paymentMethods) {
        return <Loader/>;
    }

    return (
        <div className='container mx-auto p-0 py-4'>
            <div className="my-4 flex flex-col gap-4">
                <Tabs onTabChange={setActiveTab as any} />
                <div className='flex flex-col gap-2'>
                    <h1>Create Advert</h1>
                    <p className='text-gray-400'>Please fill in the information to proceed to post an Ad.</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="shadow-lg border border-gray-200 p-10 py-10 bg-white rounded-xl flex flex-col gap-10">
                <div className='flex flex-col gap-8'>
                    <h1 className='text-blue-500 font-bold'>Type and Price</h1>
                    <div className='flex flex-row items-start justify-center gap-6'>
                        <InputSelect name='token' options={tokens?.map(token =>({
                            label: token.name,
                            value: token.id
                            })) || []} label='Asset' />
                            
                        <InputSelect name='currency' options ={currencies?.map(currency => ({
                            label: currency.currency,
                            symbol: currency.currency,
                            name: currency.currency,
                            value: currency.currency
                        })) || []} label='Fiat' />
                        <Input name='rate' label='Rate' />
                    </div>
                </div>
                <div className='flex flex-col gap-8'>
                    <h1 className='text-blue-500 font-bold'>Amount and Method</h1>
                    <div className='flex flex-col gap-2'>
                       
                    </div>
                    <div className='flex flex-col gap-3'>
                        <span className='text-gray-700 font-light'>Order Limit</span>
                        <div className='flex flex-row items-start gap-6'>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-start justify-center gap-6'>
                                    <Input name='minOrder' label="Minimum" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-start justify-center gap-6'>
                                    <Input name = "maxOrder" label="Maximum" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <span className='text-gray-700 font-light'>Payment Methods</span>
                        <div className='flex flex-row items-start gap-6'>
                            <div className="flex-1">
                                <InputSelect name = "paymentMethod" options={paymentMethods?.map(method => ({
                                    label: method.method,
                                    value: method.method
                                })) || []} label='Method' />
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-start justify-center gap-6'>
                                    <Input name ='accountName' label="Account Name" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-start justify-center gap-6'>
                                    <Input name = "accountNumber" label="Account Number" />
                                </div>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <Button
                                type='button'
                                text="Add Payment Method"
                                icon='/images/icons/add-circle.png'
                                iconPosition="right"
                                className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2 w-fit mb-6"
                                onClick={()=>addPaymentMethod()}
                            />
                            <RenderAddedPaymentMethod paymentMethod={[]} handleDelete={() => { }} />
                        </div>
                        
                        <InputSelect name = "timeLimit" options={ TIME_LIMITS.map(timeLimit => ({
                            label: timeLimit.label,
                            value: timeLimit.value
                        })) || []} label='Payment Time Limit' />
                         <span className='text-gray-700 font-light'>Deposit Address</span>
                        <div className='flex flex-row items-start justify-center gap-6'>
                            <Input defaultValue={account.address} name = "depositAddress" label="Deposit Address" />
                        </div>
                        <div className='flex flex-col gap-4 my-4'>
                            <span className='text-sm text-gray-500'>Terms (Optional)</span>
                            <textarea name = "terms" rows={10} className='resize-none w-full border border-gray-200 rounded-xl' />
                        </div>
                    </div>
                    <div className="flex flex-row justify-end gap-6">
                        <Button
                            type='button'
                            text="Cancel"
                            iconPosition="right"
                            className="bg-transparent border border-gray-300 text-black rounded-xl px-4 py-2 w-fit"
                            onClick={()=>{ router.back()}}
                        />
                        <Button
                        loading={submitting}
                            text="Add Post"
                            icon='/images/icons/add-circle.png'
                            iconPosition="right"
                            className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2 w-fit"
                            type='submit'
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateAd