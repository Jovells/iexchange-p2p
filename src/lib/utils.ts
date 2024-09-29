import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortenAddress = (address: string | any, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export const formatBlockTimesamp = (timestamp: number | BigInt | string): string => {
  const date = new Date(Number(timestamp) * 1000);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

//esport a function which takes the a number and amount and return a currency value. juse prepend the currenty with the string, and divide the number by 10^18  to two decimal places
export const formatCurrency = (amount: string | number, currency: string): string => {
  return `${(Number(amount) / 10 ** 18).toFixed(2)} ${currency}`;
}
export const parseStringToObject = (inputString: string): Record<string, string> => {
  const result: Record<string, string> = {};

  inputString.split('\n').forEach(line => {
    const delimiters = [':', '=', '-', ' ', '|', ';'];
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
}
