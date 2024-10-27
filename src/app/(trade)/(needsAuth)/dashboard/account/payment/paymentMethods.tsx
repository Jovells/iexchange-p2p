import Loader from '@/components/loader/Loader';
import Button from '@/components/ui/Button';
import React from 'react';

interface PaymentMethod {
    method: string;
    name: string;
    number: string;
    details: string;
}

interface Props {
    isFetching: boolean;
    methods: any | null;
}

const PaymentMethods: React.FC<Props> = ({ isFetching, methods }) => {
    if (isFetching) {
        return (
            <div className="flex w-full justify-center py-6">
                <Loader loaderType="text" />
            </div>
        );
    }

    if (!methods || methods.length === 0) {
        return (
            <div className="flex w-full justify-center text-center text-black dark:text-white py-6">
                <p>No payment methods added yet</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4 text-black dark:text-white">
            {methods.map((method: any, index: any) => (
                <div
                    key={index}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-[8px] p-4 flex flex-col gap-4 bg-white dark:bg-gray-800 transition-all sm:flex-row sm:justify-between"
                >
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-between text-sm">
                        <div className="flex flex-col sm:w-1/4">
                            <span className="text-gray-500">Method</span>
                            <span>{method.method}</span>
                        </div>
                        <div className="flex flex-col sm:w-1/4">
                            <span className="text-gray-500">Account Name</span>
                            <span>{method.name}</span>
                        </div>
                        <div className="flex flex-col sm:w-1/4">
                            <span className="text-gray-500">Account Number</span>
                            <span>{method.number}</span>
                        </div>
                        <div className="flex flex-col sm:w-1/4">
                            <span className="text-gray-500">Additional Details</span>
                            <span>{method.details}</span>
                        </div>
                        <div className="flex flex-col items-end justify-center sm:w-1/4">
                        <Button text="Remove" className='bg-red-500' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PaymentMethods;
