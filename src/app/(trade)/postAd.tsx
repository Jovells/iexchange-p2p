import { Plus } from 'lucide-react';
import React from 'react';

interface Props{
    className?:string;
    text?:string;
}
const PostAd:React.FC<Props> = ({className, text}) => {
    return (
        <button className={`fixed bottom-4 right-4 shadow-lg mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold p-4 rounded-full ${className}`}>
            <Plus /> <span>{text}</span>
        </button>
    );
};

export default PostAd;
