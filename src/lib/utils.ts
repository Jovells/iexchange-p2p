import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortenAddress = (address: string | any, chars = 4): string =>{
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

//esport a function which takes the a number and amount and return a currency value. juse prepend the currenty with the string, and divide the number by 10^18  to two decimal places
export const formatCurrency = (amount: string | number, currency: string): string => {
  return `${currency} ${(Number(amount) / 10 ** 18).toFixed(2)}`;
}