import React from 'react'

interface Props {
  label?: any;
  value?: any;
  isBuyer?: boolean;
  isAmount?: boolean;
}
const InfoBlock: React.FC<Props> = ({ label, value, isBuyer, isAmount }) => (
  <div className="flex flex-row items-center justify-between w-full">
    <div className="text-sm text-gray-600 dark:text-gray-400 font-light">{label}</div>
    <div
      className={`text-lg font-light ${
        isAmount
          ? isBuyer
            ? "text-green-700 font-medium dark:text-green-400"
            : "text-[#f6465d] font-medium dark:text-red-400"
          : "text-gray-600 dark:text-gray-400"
      }`}
    >
      {value}
    </div>
  </div>
);
  

export default InfoBlock