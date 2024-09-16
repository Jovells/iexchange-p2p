import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiTether, SiBinance } from 'react-icons/si';

import { DollarSign, Euro } from "lucide-react";

export const currencies = [
    { id: "0x01", symbol: 'GHS', name: 'Ghanaian Cedi', icon: <DollarSign className="w-4 h-4" /> },
    { id: "0x02", symbol: 'USD', name: 'US Dollar', icon: <DollarSign className="w-4 h-4" /> },
    { id: "0x03", symbol: 'EUR', name: 'Euro', icon: <Euro className="w-4 h-4" /> },
    { id: "0x04", symbol: 'GBP', name: 'British Pound', icon: <DollarSign className="w-4 h-4" /> },
];


export const cryptoTokens = [
    { id: "0x01", symbol: 'BTC', name: 'Bitcoin', icon: <FaBitcoin className="w-4 h-4" /> },
    { id: "0x02", symbol: 'ETH', name: 'Ethereum', icon: <FaEthereum className="w-4 h-4" /> },
    { id: "0x03", symbol: 'USDT', name: 'Tether', icon: <SiTether className="w-4 h-4" /> },
    { id: "0x04", symbol: 'BNB', name: 'Binance Coin', icon: <SiBinance className="w-4 h-4" /> },
];