import { Token } from "@/common/api/types";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface CryptoSelectorInputProps {
  tokens: Token[];
  selectedCrypto: Token | undefined;
  setSelectedCrypto: (crypto: Token) => void;
}

const CryptoSelectorInput: React.FC<CryptoSelectorInputProps> = ({ tokens, selectedCrypto, setSelectedCrypto }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleSelect = (symbol: string) => {
    const selected = tokens.find(t => t.symbol === symbol);
    if (selected) {
      setSelectedCrypto(selected);
    }
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative sm:hidden flex flex-row items-center space-x-6">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-6 py-2 rounded-xl text-md bg-transparent border border-gray-300 text-gray-600 outline-none dark:border-gray-600 dark:text-gray-300"
        >
          <div className="flex flex-row gap-2 items-center justify-center">
            {selectedCrypto?.symbol || "Select a Crypto"}
            <ChevronDown />
          </div>
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 w-full max-h-60 p-4 rounded-t-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-center mb-4 dark:text-gray-300">Select a Crypto</h3>
            <div className="max-h-48 overflow-y-auto">
              {tokens.map(crypto => (
                <div
                  key={crypto.id}
                  className="px-6 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
                  onClick={() => handleSelect(crypto.symbol)}
                >
                  {crypto.symbol}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CryptoSelectorInput;
