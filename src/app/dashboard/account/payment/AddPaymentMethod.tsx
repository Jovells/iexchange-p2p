import Loader from '@/components/loader/Loader'
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput'
import { Check, X } from 'lucide-react'
import React, { FC, Fragment, useEffect, useState } from 'react'

type PaymentMethod = {
    id: number;
    name: string;
};

const paymentMethods: PaymentMethod[] = [
    { id: 1, name: 'Credit Card' },
    { id: 2, name: 'PayPal' },
    { id: 3, name: 'Bank Transfer' },
    { id: 4, name: 'Apple Pay' },
    { id: 5, name: 'Google Pay' },
];

interface Props {
    hideModal: () => void
}
const AddPaymentMethod: FC<Props> = ({ hideModal }) => {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [steps, setSteps] = useState(1)

    const handleSearch = () => { }
    const toggleSelection = () => { }

    const handleAdd = () => { }

    useEffect(() => {
        //simulating loading
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);

        if (selectedMethod) {

        }
    }, [])

    return (
        <div className='w-full lg:w-[800px] h-auto bg-white rounded-xl shadow-md border-2 border-gray-500 flex flex-col gap-4'>
            <div className='flex flex-row items-center justify-between border-b px-8 py-6'>
                <h1 className='font-bold'>Payment Method</h1>
                <div className='flex justify-end'>
                    <X onClick={hideModal} className='cursor-pointer' />
                </div>
            </div>
            {isLoading && <Loader className='h-[400px]' />}
            {!isLoading && (
                <div className='gap-4 flex flex-col p-8 pt-4'>
                    {
                        steps === 1 && (
                            <Fragment>
                                <SearchInput
                                    placeholder="Type to search..."
                                    onSearch={handleSearch}
                                    showButton={false}
                                    buttonText="Go"
                                />
                                <ul className="space-y-2">
                                    {paymentMethods.map((method) => (
                                        <li
                                            key={method?.name}
                                            className="flex justify-between items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                                            onClick={() => setSelectedMethod(method?.name)}
                                        >
                                            <span>{method.name}</span>
                                            {selectedMethod === method?.name && (
                                                <div className='bg-black rounded-lg p-1 flex items-center justify-center'>
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                <div className='flex flex-row items-center gap-4 p-4 px-0'>
                                    <Button
                                        text="Cancel"
                                        className="flex-1 bg-transparent text-black border border-gray-500 hover:bg-gray-100rounded-xl px-4 py-2"
                                        onClick={() => {
                                            hideModal()
                                            setSelectedMethod(null)
                                        }}
                                    />
                                    <Button
                                        text="Next"
                                        className="flex-1 bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2"
                                        onClick={() => setSteps(steps + 1)}
                                    />
                                </div>
                            </Fragment>
                        )
                    }
                    {
                        steps === 2 && (
                            <Fragment>
                                <div>
                                    <p>Provide details of your selected payment methods.</p>
                                    <textarea rows={10} className='w-full p-4 border border-gray-300 rounded-xl outline-none resize-none ' />
                                </div>
                                <div className='flex flex-row items-center gap-4 p-4 px-0'>
                                    <Button
                                        text="Back"
                                        className="flex-1 bg-transparent text-black border border-gray-500 hover:bg-gray-100rounded-xl px-4 py-2"
                                        onClick={() => {
                                            setSteps(steps - 1)
                                        }}
                                    />
                                    <Button
                                        text="Add Payment Method"
                                        className="flex-1 bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2"
                                        onClick={handleAdd}
                                    />
                                </div>
                            </Fragment>
                        )
                    }
                </div>
            )}
        </div>
    )
}

export default AddPaymentMethod