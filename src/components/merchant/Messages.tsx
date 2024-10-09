"use client";
import { useUser } from "@/common/contexts/UserContext";
import { CachedConversation, useMessages, useStreamMessages } from "@xmtp/react-sdk";
import { useEffect, useRef } from "react";
import { ContentTypeId } from "@xmtp/content-type-primitives";
import { ContentTypeText } from "@xmtp/content-type-text";

const Messages = ({ conversation }: { conversation: CachedConversation }) => {
  const { messages, error } = useMessages(conversation);
  const { address } = useUser();
  const { error: streamError } = useStreamMessages(conversation);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  if (streamError || error) {
    console.log("streamerror", streamError, error);
  }

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[80vh] p-3 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-3"> 
        {messages.map((message, i) => {
          const contentType = ContentTypeId.fromString(message.contentType);
          let content: any;

          if (contentType.sameAs(ContentTypeText)) {
            content = typeof message.content === "string" ? message.content : undefined;
          }

          return content ? (
            <div
              key={message.id}
              className={`mb-2 ${message.senderAddress.toLowerCase() === address ? "text-right" : "text-left"}`}
            >
              <span
                className={`${
                  message.senderAddress === address
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black mr-auto"
                } inline-block p-3 max-w-xs rounded-[8px] shadow-md ${
                  message.senderAddress === address ? "rounded-tr-none" : "rounded-tl-none"
                }`}
              >
                {content}
              </span>
            </div>
          ) : null;
        })}

        {/* <div ref={messagesEndRef} />  */}
      </div>
    </div>
  );
};

export default Messages;
