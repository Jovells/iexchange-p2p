import React, { FC, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import InputWithSelect from '@/components/ui/InputWithSelect';
import InputSelect from '@/components/ui/InputSelect';
import Button from '@/components/ui/Button';
import MerchantProfile from '@/components/merchant/MerchantProfile';
import { DollarSign, Euro } from 'lucide-react';
import { useRouter } from 'next/navigation';

const currencies = [
    { symbol: 'GHS', name: 'Ghanaian Cedi', icon: <DollarSign className="w-4 h-4" /> },
    { symbol: 'USD', name: 'US Dollar', icon: <DollarSign className="w-4 h-4" /> },
    { symbol: 'EUR', name: 'Euro', icon: <Euro className="w-4 h-4" /> },
    { symbol: 'GBP', name: 'British Pound', icon: <DollarSign className="w-4 h-4" /> },
];

const paymentMethods = [
    { value: 'MOMO', label: 'MTN Mobile Money' },
    { value: 'access bank', label: 'Access Bank' },
    { value: 'Telecel cash', label: 'Telecel Cash' },
];

interface Props {
    data: any;  // Consider replacing 'any' with a specific type
    toggleExpand: () => void;
    orderType: string;
}

const CreateOrder: FC<Props> = ({ data, toggleExpand, orderType }) => {
    const prevOrderType = useRef(orderType);
    const searchParams = useSearchParams();
    const navigate = useRouter()

    const trade = searchParams.get("trade") || "Buy";
    const crypto = searchParams.get("crypto") || "USDT";


    useEffect(() => {
        if (prevOrderType.current !== orderType) {
            toggleExpand();
            prevOrderType.current = orderType;
        }
    }, [orderType, toggleExpand]);

    return (
        <div className='w-full border-0 lg:border rounded-xl p-0 lg:p-6 min-h-[400px] flex flex-col flex-col-reverse lg:grid lg:grid-cols-2 bg-white lg:bg-gray-200'>
            <div className='bg-transparent rounded-xl p-0 pt-6'>
                <MerchantProfile />
            </div>
            <div className='bg-white rounded-xl p-0 lg:p-6 space-y-3 pt-6'>
                <InputWithSelect
                    label={orderType.toLowerCase() === "buy" ? "You Pay" : "You Sell"}
                    initialCurrency="USD"
                    currencies={currencies}
                    onValueChange={(value) => console.log(value)}
                    readOnly={false}
                    placeholder="Enter amount"
                    selectIsReadOnly={true}
                />
                <InputWithSelect
                    label="You Receive"
                    initialCurrency="USD"
                    currencies={currencies}
                    onValueChange={(value) => console.log(value)}
                    readOnly={false}
                    placeholder="Enter amount"
                    selectIsReadOnly={true}
                />
                <InputSelect
                    label=""
                    initialValue=""
                    options={paymentMethods}
                    onValueChange={(value) => console.log(value)}
                />
                <div className='grid grid-cols-2 gap-8 pt-4'>
                    <Button
                        text="Cancel"
                        className="bg-[#EAEBEC] text-black rounded-xl px-4 py-2"
                        onClick={toggleExpand}
                    />
                    <Button
                        text={`${trade} ${crypto}`}
                        className="bg-[#2D947A] text-white rounded-xl px-4 py-2"
                        onClick={() => navigate.push("order")}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateOrder;
