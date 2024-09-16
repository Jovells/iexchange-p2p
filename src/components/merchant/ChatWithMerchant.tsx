'use client'

import { Merchant } from '@/common/api/types';
import { shortenAddress } from '@/lib/utils';
import { Send } from 'lucide-react';
import React, { useState } from 'react';

const ChatWithMerchant = ({otherParty}:{otherParty: {id: `0x${string}`, name?: string}}) => {
    const [messages, setMessages] = useState([
        { sender: 'Merchant', text: 'Hi there! How can I help you?' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const sendMessage = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { sender: 'User', text: inputValue }]);
            setInputValue('');

            setTimeout(() => {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: 'Merchant', text: 'Thank you for your message. We will get back to you shortly.' }
                ]);
            }, 1000);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="w-full h-full border rounded-xl flex flex-col">

            <div className="w-full bg-gray-100 p-3 rounded-t-xl">
                {otherParty.name} {shortenAddress(otherParty.id)}
            </div>

            <div className="flex-1 p-3 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.sender === 'User' ? 'text-right' : 'text-left'}`}>
                        <span className={`${message.sender === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} inline-block p-2 rounded-lg`}>
                            {message.text}
                        </span>
                    </div>
                ))}
            </div>

            <div className="w-full p-3 bg-white rounded-b-xl">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full border rounded-xl p-2 pr-10 focus:outline-none bg-gray-100"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                        className="absolute right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                        onClick={sendMessage}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWithMerchant;
