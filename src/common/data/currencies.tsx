import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiTether, SiBinance } from 'react-icons/si';

import { DollarSign, Euro } from "lucide-react";

export const currencyIcons: { [key: string]: JSX.Element } = {
  GHS: <p className="w-7 h-7 text-sm font-bold flex justify-center items-center bg-primary rounded-full">₵</p>,
  NGN: <p className="w-7 h-7 text-sm font-bold flex justify-center items-center bg-primary rounded-full">₦</p>,
  KES: <p className="w-7 h-7 text-xs font-bold flex justify-center items-center bg-primary rounded-full">KSh</p>,
  USD: <p className="w-7 h-7 text-sm font-bold flex justify-center items-center bg-primary rounded-full">$</p>,
  EUR: <p className="w-7 h-7 text-sm font-bold flex justify-center items-center bg-primary rounded-full">€</p>,
};


export const cryptoTokens = [
    { id: "0x01", symbol: 'BTC', name: 'Bitcoin', icon: <FaBitcoin className="w-4 h-4" /> },
    { id: "0x02", symbol: 'ETH', name: 'Ethereum', icon: <FaEthereum className="w-4 h-4" /> },
    { id: "0x03", symbol: 'USDT', name: 'Tether', icon: <SiTether className="w-4 h-4" /> },
    { id: "0x04", symbol: 'BNB', name: 'Binance Coin', icon: <SiBinance className="w-4 h-4" /> },
];