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



  return (
    <div className="flex flex-col h-full max-h-[80vh] p-3 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-3">
        <div ref={messagesEndRef}> {isLoading && <Loader size="xs" loaderType="text" />}</div>
      </div>
    </div>
  );
};

export default Messages;
