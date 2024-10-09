import React from 'react'

interface Props{
    label?:any;
    value?:any;
    isBuyer?:boolean
}
const InfoBlock:React.FC<Props> = ({ label, value, isBuyer }) => (
    <div className="flex flex-row lg:flex-col gap-4 lg:gap-0">
      <div className="text-sm text-gray-600 dark:text-gray-400 font-light">{label}</div>
      <div
        className={`text-lg font-medium ${
          isBuyer ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
        }`}
      >
        {value}
      </div>
    </div>
  );
  

export default InfoBlock