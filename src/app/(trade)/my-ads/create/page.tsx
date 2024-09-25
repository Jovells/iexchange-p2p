'use client'

import Tabs from '@/components/tabs'
import Button from '@/components/ui/Button'
import InputSelect from '@/components/ui/InputSelect'
import Input from '@/components/ui/input'
import React, { useState } from 'react'
import RenderAddedPaymentMethod from './RenderAddedPaymentMethod'
import { useContracts } from '@/common/contexts/ContractContext'
import { useQuery } from '@tanstack/react-query'
import { fetchCurrencies } from '@/common/api/fetchCurrencies'
import { fetchTokens } from '@/common/api/fetchTokens'
import fetchContractPaymentMethods from '@/common/api/fetchContractPaymentMethods'
import { offerTypes, TIME_LIMITS } from '@/common/api/constants'
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract } from 'wagmi'
import storeAccountDetails from '@/common/api/storeAccountDetails'
import Loader from '@/components/loader/Loader'
import { z } from 'zod'
import toast from 'react-hot-toast'
import useWriteContractWithToast from '@/common/hooks/useWriteContractWithToast'

const formSchema = z.object({
  token: z.string().startsWith('0x'),
  currency: z.string().min(1, 'Currency is required'),
  minOrder: z.bigint().positive('Minimum order must be positive'),
  maxOrder: z.bigint().positive('Maximum order must be positive'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  timeLimit: z.number().positive('Time limit must be positive'),
  terms: z.string().optional(),
  depositAddress: z.string().startsWith('0x'),
  rate: z.bigint().positive('Rate must be positive'),
  offerType: z.enum(['buy', 'sell']),
}).refine((data) => data.minOrder <= data.maxOrder, {
  message: "Minimum order cannot be higher than maximum order",
  path: ["minOrder"],
});

type FormData = z.infer<typeof formSchema>

const CreateAd = () => {
    const [activeTab, setActiveTab] = useState<"buy" | "sell" >("buy");
    const {p2p, indexerUrl} = useContracts();
    const router = useRouter();
    const account = useAccount();
    const [submitting, setSubmitting] = useState(false);
    const {writeContractAsync} = useWriteContractWithToast()
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

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
        queryFn: () => fetchContractPaymentMethods(indexerUrl)
    })

    const addPaymentMethod =  () =>{}
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        const id = toast.loading('Creating Ad...');
        const formData = new FormData(e.currentTarget);
        const data = {
            token: formData.get('token') as `0x${string}`,
            currency: formData.get('currency') as string,
            minOrder: BigInt(formData.get('minOrder') as string) * BigInt(10**18),
            maxOrder: BigInt(formData.get('maxOrder') as string) * BigInt(10**18),
            paymentMethod: formData.get('paymentMethod') as string,
            accountName: formData.get('accountName') as string,
            accountNumber: formData.get('accountNumber') as string,
            timeLimit: Number(formData.get('timeLimit')),
            terms: formData.get('terms') as string,
            depositAddress: formData.get('depositAddress') as `0x${string}`,
            rate: BigInt(formData.get('rate') as string),
            offerType: activeTab,
        };

        try {
            formSchema.parse(data);
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                const fieldErrors: Partial<Record<keyof FormData, string>> = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        fieldErrors[err.path[0] as keyof FormData] = err.message;
                    }
                });
                setErrors(fieldErrors);
                setSubmitting(false);
                toast.error('Please correct the errors in the form', { id });
                return;
            }
        }

        const { token, currency, minOrder, maxOrder, paymentMethod, accountName, accountNumber, timeLimit, terms, depositAddress, rate, offerType } = data;
        console.log('create-data', data);
        const accountDetails = {
            name: accountName,
            number: accountNumber,
            terms: terms,
            timeLimit: timeLimit,
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
                    //swap is necessary
                    activeTab === 'buy' ? offerTypes.sell : offerTypes.buy,
                ];
                console.log('args', args, activeTab);

            const response = await writeContractAsync({
                loadingMessage: 'Creating Ad...',
                successMessage: 'Ad created successfully',
                toastId: id,
            },{
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
            toast.success('Ad created successfully', { id });
            router.push('/my-ads'); // Redirect or handle success
            } catch (error) {
            console.error('Transaction failed:', error);
            toast.error('Failed to create ad. Please try again.', { id });
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
                    <h1 className='text-[#01a2e4] font-bold'>Type and Price</h1>
                    <div className='flex flex-row items-start   justify-start gap-6'>
                        <div className='flex flex-col'>
                            <InputSelect name='token' options={tokens?.map(token =>({
                                label: token.name,
                                value: token.id
                                })) || []} label='Asset' />
                            {errors.token && <span className="text-red-500 text-sm">{errors.token}</span>}
                        </div>
                        <div className='flex flex-col'>
                            <InputSelect name='currency' options ={currencies?.map(currency => ({
                                label: currency.currency,
                                symbol: currency.currency,
                                name: currency.currency,
                                value: currency.currency
                            })) || []} label='Fiat' />
                            {errors.currency && <span className="text-red-500 text-sm">{errors.currency}</span>}
                        </div>
                        <div className='flex flex-col'>
                            <Input name='rate' label='Rate' />
                            {errors.rate && <span className="text-red-500 text-sm">{errors.rate}</span>}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-8'>
                    <h1 className='text-[#01a2e4] font-bold'>Amount and Method</h1>
                    <div className='flex flex-col gap-3'>
                        <span className='text-gray-700 font-light'>Order Limit</span>
                        <div className='flex flex-row items-start gap-6'>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-col'>
                                    <Input name='minOrder' label="Minimum" />
                                    {errors.minOrder && <span className="text-red-500 text-sm">{errors.minOrder}</span>}
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-col'>
                                    <Input name="maxOrder" label="Maximum" />
                                    {errors.maxOrder && <span className="text-red-500 text-sm">{errors.maxOrder}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <span className='text-gray-700 font-light'>Payment Methods</span>
                        <div className='flex flex-row items-start gap-6'>
                            <div className="flex-1 flex flex-col">
                                <InputSelect name="paymentMethod" options={paymentMethods?.map(method => ({
                                    label: method.method,
                                    value: method.method
                                })) || []} label='Method' />
                                {errors.paymentMethod && <span className="text-red-500 text-sm">{errors.paymentMethod}</span>}
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-col'>
                                    <Input name='accountName' label="Account Name" />
                                    {errors.accountName && <span className="text-red-500 text-sm">{errors.accountName}</span>}
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-col'>
                                    <Input name="accountNumber" label="Account Number" />
                                    {errors.accountNumber && <span className="text-red-500 text-sm">{errors.accountNumber}</span>}
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
                        
                        <div className='flex flex-col'>
                            <InputSelect name="timeLimit" options={ TIME_LIMITS.map(timeLimit => ({
                                label: timeLimit.label,
                                value: timeLimit.value
                            })) || []} label='Payment Time Limit' />
                            {errors.timeLimit && <span className="text-red-500 text-sm">{errors.timeLimit}</span>}
                        </div>
                         <span className='text-gray-700 font-light'>Deposit Address</span>
                        <div className='flex flex-col'>
                            <Input defaultValue={account.address} name="depositAddress" label="Deposit Address" />
                            {errors.depositAddress && <span className="text-red-500 text-sm">{errors.depositAddress}</span>}
                        </div>
                        <div className='flex flex-col gap-4 my-4'>
                            <span className='text-sm text-gray-500'>Terms (Optional)</span>
                            <textarea name="terms" rows={10} className='resize-none w-full border p-5 border-gray-200 rounded-xl' />
                            {errors.terms && <span className="text-red-500 text-sm">{errors.terms}</span>}
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