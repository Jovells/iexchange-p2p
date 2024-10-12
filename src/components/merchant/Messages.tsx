"use client";
import { useUser } from "@/common/contexts/UserContext";
import { CachedConversation, CachedMessage, useMessages, useStreamMessages } from "@xmtp/react-sdk";
import { useEffect, useMemo, useRef } from "react";
import { ContentTypeId } from "@xmtp/content-type-primitives";
import { ContentTypeText } from "@xmtp/content-type-text";
import Loader from "../loader/Loader";
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import { BOT_MERCHANT_ID } from "@/common/constants";

const Messages = ({ conversation, isLoading }: { conversation: CachedConversation; isLoading?: boolean }) => {
  const { messages, error } = useMessages(conversation);
  const { address, mixedCaseAddress } = useUser();
  const { error: streamError } = useStreamMessages(conversation);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  if (streamError || error) {
    console.log("streamerror", streamError, error);
  }

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    };

    scrollToBottom();
  }, [messages]);

  const messagesWithBot = useMemo(() => {
    // add a bot message if the otherParty is the BotMerchant
    if (conversation.peerAddress.toLocaleLowerCase() === BOT_MERCHANT_ID) {
      // add a bot message
      const botMessage: CachedMessage = {
        ...messages[0],
        id: messages.length.toString(),
        contentType: ContentTypeText.toString(),
        content: "Hello! I am the Bot Merchant. I will respond to your order within 3 minutes. Please Wait .",
        senderAddress: BOT_MERCHANT_ID,
        sentAt: new Date(),
        hasLoadError: false,
      };
      return [...messages, botMessage];
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[80vh] p-3 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-3">
        {messagesWithBot?.map((message, i) => {
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
                  message.senderAddress === mixedCaseAddress
                    ? "bg-[#01A2E4] text-white ml-auto"
                    : "bg-gray-200 text-black dark:text-gray-100 dark:bg-gray-700 mr-auto"
                } inline-block p-3 max-w-xs rounded-[8px] shadow-md ${
                  message.senderAddress === mixedCaseAddress ? "rounded-tr-none" : "rounded-tl-none"
                } `}
              >
                <div className="flex justify-center gap-1 break-all items-baseline">
                  {content}
                  {message.isSending && <Loader size="xs" />}
                </div>
                <div className="text-xs text-gray-200 dark:text-gray-300 mt-1">
                  {new Date(message.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </span>
            </div>
          ) : null;
        })}

        <div ref={messagesEndRef}> {isLoading && <Loader size="xs" loaderType="text" />}</div>
      </div>
    </div>
  );
};

export default Messages;
