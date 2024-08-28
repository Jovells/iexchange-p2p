import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortenAddress = (address: string | any, chars = 4): string =>{
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}