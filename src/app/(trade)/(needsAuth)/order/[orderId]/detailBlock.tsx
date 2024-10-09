import React from 'react'

interface Props{
    label?:any;
    value?:any;
}

const DetailBlock:React.FC<Props> = ({ label, value }) => (
    <div>
      <div className="font-light text-gray-500 dark:text-gray-400 text-sm">{label}</div>
      <div className="text-gray-600 dark:text-gray-300">{value}</div>
    </div>
  );
  
export default DetailBlock