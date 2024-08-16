import ExpandableTable from '@/components/data-grid'
import { useSearchParams } from 'next/navigation';
import React, { FC } from 'react'
import CreateOrder from './create-order';

const columns: any = [
    {
        key: 'advertisers',
        label: 'Advertisers',
        render: (row: any) => <span className="font-bold">{row.advertisers}</span>,
    },
    {
        key: 'price',
        label: 'Price',
    },
    {
        key: 'funds',
        label: 'Available Funds',
        render: (row: any) => <span className="italic">{row.funds}</span>,
    },
    {
        key: 'payment',
        label: 'Payment Options',
        render: (row: any) => <span className="italic">{row.payment}</span>,
    },
];

interface Props {
    orderType: string;
}
const P2POrder: FC<Props> = ({ orderType }) => {
    const searchParams = useSearchParams()

    const trade = searchParams.get("trade") || "Buy"
    const crypto = searchParams.get("crypto") || "USDT"

    const data = [
        { advertisers: 'John Doe', price: 28, funds: 'New York', payment: 'New York' },
        { advertisers: 'Jane Smith', price: 34, funds: 'San Francisco', payment: 'New York' },
        { advertisers: 'Michael Johnson', price: 45, funds: 'Chicago', payment: 'New York' },
    ];

    const actions = [
        { label: trade + " " + crypto, onClick: (row: any) => console.log(row) }
    ]

    return (
        <div className='w-full'>
            <ExpandableTable
                columns={columns}
                data={data}
                actions={actions}
                isLoading={false}
            >
                {(row, toggleExpand) => (
                    <CreateOrder data={row} toggleExpand={toggleExpand} orderType={trade} />
                )}
            </ExpandableTable>
        </div>
    )
}

export default P2POrder