'use client'

import { Check, DollarSign, Send, Verified } from 'lucide-react';
import React, { useState } from 'react';

const Chat = () => {
    // State to manage messages for each user and the input value
    const [messages, setMessages] = useState<{ [key: string]: { sender: string; text: string }[] }>({
        Merchant: [{ sender: 'Merchant', text: 'Hi there! How can I help you?' }],
        User: []
    });
    const [inputValue, setInputValue] = useState('');
    const [currentUser, setCurrentUser] = useState<'Merchant' | 'User'>('Merchant');
    const [lastSender, setLastSender] = useState<'Merchant' | 'User'>('Merchant');

    const sendMessage = () => {
        if (inputValue.trim()) {
            // Add the message to the current user's chat
            setMessages(prevMessages => ({
                ...prevMessages,
                [currentUser]: [...prevMessages[currentUser], { sender: currentUser, text: inputValue }]
            }));
            setInputValue('');
            setLastSender(currentUser);

            // Simulate a response from the bot to the user who sent the last message
            setTimeout(() => {
                const otherUser = lastSender === 'User' ? 'Merchant' : 'User';
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [otherUser]: [...prevMessages[otherUser], { sender: otherUser, text: 'Thank you for your message. We will get back to you shortly.' }]
                }));
            }, 1000);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleTabClick = (user: 'Merchant' | 'User') => {
        setCurrentUser(user);
    };

    return (
      <div className="w-full h-full border rounded-xl flex flex-col">
        <div className="w-full bg-gray-100 p-3 rounded-t-xl">
          <div className="flex space-x-6">
            <button
              className={`p-2 text-center ${currentUser === "Merchant" ? "bg-gray-200" : "bg-gray-100"} rounded-xl`}
              onClick={() => handleTabClick("Merchant")}
            >
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4" />
                <span>Cryptorithy.GH</span>
                <Verified className="w-4" />
              </div>
            </button>
            <button
              className={`p-2 text-center ${currentUser === "User" ? "bg-gray-200" : "bg-gray-100"} rounded-xl`}
              onClick={() => handleTabClick("User")}
            >
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4" />
                <span>BaahSoccersm.Crypto</span>
                <Verified className="w-4" />
              </div>
            </button>
          </div>
        </div>

        <div className="flex-1 p-3 overflow-y-auto">
          {messages[currentUser].map((message, index) => (
            <div key={index} className={`mb-2 ${message.sender === "User" ? "text-right" : "text-left"}`}>
              <span
                className={`${
                  message.sender === "User" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                } inline-block p-2 rounded-lg`}
              >
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
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button
              className="absolute right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-[#01a2e4]"
              onClick={sendMessage}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
};

export default Chat;
