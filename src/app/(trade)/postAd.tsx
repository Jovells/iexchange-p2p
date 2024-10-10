import { Plus } from 'lucide-react';
import React from 'react';

interface Props{
    className?:string;
    text?:string;
}
const PostAd:React.FC<Props> = ({className, text}) => {
    return (
      <button
        className={`flex flex-row gap-3 fixed bottom-4 right-4 shadow-lg mt-2 bg-[#01a2e4] hover:bg-[#01a2e4] text-white font-semibold p-4 rounded-[8px] ${className}`}
      >
        <Plus /> <span>{text}</span>
      </button>
    );
};

export default PostAd;
