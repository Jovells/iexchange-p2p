import CryptoButton from '@/app/(trade)/cryptoButton'
import { useModal } from '@/common/contexts/ModalContext'
import useMarketData from '@/common/hooks/useMarketData'
import { Wallet, X } from 'lucide-react'
import React from 'react'
import CryptoWithBalanceList from './cryptoWithBalanceList'

const Balances = () => {
    const { showModal, hideModal } = useModal()
    const { tokens:marketDataToken } = useMarketData();


    const modalHandler = () => {
        showModal(
            <div className='w-full  min-h-[250px] bg-gray-800 rounded-xl'>
                <div className="border-b border-gray-700 flex flex-row justify-between p-4">
                    <div>Balance</div>
                    <X onClick={hideModal} />
                </div>
                <div className="p-0">
                    {marketDataToken && marketDataToken.map(crypto => (
                        <div
                            key={crypto.id}
                            className="px-4 py-3 cursor-pointer dark:text-gray-300"
                        >
                            <CryptoWithBalanceList column={false} token={crypto} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    return (
        <button onClick={modalHandler} className='flex flex-row items-center border-0 lg:border p-2 py-1.5 rounded-xl gap-3'>
            <Wallet /> <span className='hidden lg:block'>Balances</span>
        </button>
    )
}

export default Balances