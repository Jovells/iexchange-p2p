import { offerTypes } from "@/common/constants";
import { Merchant, OfferType } from "@/common/api/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import toast, { Renderable, ToastOptions } from "react-hot-toast";
import { useTheme } from "@/common/contexts/ThemeProvider";
import { getBlock } from "@wagmi/core";
import { config } from "@/common/configs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const formatBlockTimesamp = (timestamp: number | BigInt | string): string => {
  const date = new Date(Number(timestamp) * 1000);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

//esport a function which takes the a number and amount and return a currency value. juse prepend the currenty with the string, and divide the number by 10^18  to two decimal places
export const formatCurrency = (amount: string | number, currency: string, precision?: number): string => {
  if (precision) return `${(Number(amount) / 10 ** 18).toPrecision(precision)}` + (currency ? ` ${currency}` : "");
  return `${(Number(amount) / 10 ** 18).toFixed(2)}` + (currency ? ` ${currency}` : "");
};
export const parseStringToObject = (inputString: string): Record<string, string> => {
  const result: Record<string, string> = {};

  inputString.split("\n").forEach(line => {
    const delimiters = [":", "=", "-", " ", "|", ";"];
    let foundDelimiter: string | null = null;
    let key: string | undefined;
    let value: string | undefined;

    for (const delimiter of delimiters) {
      const parts = line.split(delimiter).map(str => str.trim());
      if (parts.length === 2) {
        foundDelimiter = delimiter;
        [key, value] = parts;
        break;
      }
    }

    if (key && value !== undefined) {
      result[key] = value;
    }
  });

  return result;
};

export function getUserConfig({
  trader,
  merchant,
  userAddress,
  orderType,
}: {
  trader: Merchant;
  merchant: Merchant;
  userAddress: `0x${string}`;
  orderType: OfferType;
}) {
  const isTrader = trader.id === userAddress;
  const isMerchant = merchant.id === userAddress;
  const isBuy = orderType === offerTypes.buy;
  const isSell = orderType === offerTypes.sell;
  const isBuyer = (isTrader && isBuy) || (isMerchant && isSell);
  const isSeller = (isTrader && isSell) || (isMerchant && isBuy);

  const otherParty = isTrader ? merchant : trader;
  console.log("isTradder", { trader, userAddress });
  return { isTrader, isSeller, isMerchant, isBuy, isSell, isBuyer, otherParty };
}

export const useCopyToClipboard = () => {
  const copyToClipboard = (text: string, message?: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message || "Copied to clipboard");
  };

  return copyToClipboard;
};

export const getErrorMessage = (message: string): string => {
  if (message.includes("User rejected the request")) {
    return "You rejected the request";
  }
  if (message.includes("0xe450d38c")) {
    return "Insufficient Balance. Please top up your balance";
  }
  if (message.includes("ERC20InsufficientBalance")) {
    return "Insufficient Token Balance. Please top up your balance";
  }
  if (message.includes("0xfb8f41b2")) {
    return "Insufficient Allowance.";
  }
  if (message.includes("sender balance and deposit together")) {
    return "Insufficient funds for gas. Please get some gas tokens from faucet.";
  }
  return message;
};

export const ixToast = {
  ...toast,
  default: (message: Renderable, options?: ToastOptions) => toast(message, options),
  error: (message: Renderable, options?: ToastOptions) => {
    const errorMessage = typeof message === "string" ? getErrorMessage(message) : message;
    toast.error(errorMessage, options);
  },
};

export const getImage = (imageName: string, Element?: JSX.Element) => {
  const { isDarkMode } = useTheme();

  const basePath = "/images";
  const imagePath = `${basePath}/${isDarkMode ? "dark" : "light"}/${imageName}`;

  return Element || imagePath;
};

export const getPaymentMethodColor = (label: string) => {
  switch (label.toLowerCase()) {
    case "m-pesa":
      return "border-red-600";
    case "airtel tigo mobile money":
      return "border-blue-500";
    case "fidelity bank":
      return "border-yellow-800";
    case "mtn mobile money":
      return "border-yellow-600";
    case "mobile money":
      return "border-primary";
    case "telecel mobile money":
      return "border-red-600";
    case "bank transfer":
      return "border-primary";
    case "perfectmoney":
      return "border-red-400";
    case "zelle":
      return "border-purple-500";
    case "revolut":
      return "border-black";
    default:
      return "border-gray-400";
  }
};
export async function fetchBlock(blockNumber: bigint | string) {
  return await getBlock(config, {
    blockNumber: BigInt(blockNumber),
  });
}