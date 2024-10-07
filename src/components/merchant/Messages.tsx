"use client";
import { useUser } from "@/common/contexts/UserContext";
import { CachedConversation, DecodedMessage, useMessage, useMessages, useStreamMessages } from "@xmtp/react-sdk";
import { useCallback, useEffect, useState } from "react";
import { ContentTypeId } from "@xmtp/content-type-primitives";
import { ContentTypeText } from "@xmtp/content-type-text";

const Messages = ({ conversation }: { conversation: CachedConversation }) => {
  const { messages, isLoading, error, isLoaded } = useMessages(conversation);
  const { address } = useUser();

  const { error: streamError } = useStreamMessages(conversation);

  if (streamError || error) {
    console.log("streamerror", streamError, "", error);
  }
  useEffect(() => {
    function scrollLastMessageIntoView() {
      const lastMessage = document.querySelector("#lastMessage");
      console.log("qs lastMessage", lastMessage);
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
    console.log("qf messages", messages.length);
    scrollLastMessageIntoView();
  }, [messages]);

  return (
    <div className="flex-1 p-3 overflow-y-auto">
      {messages.map((message, i) => {
        const contentType = ContentTypeId.fromString(message.contentType);
        let content: any;

        // text messages
        if (contentType.sameAs(ContentTypeText)) {
          if (typeof message.content === "string")
            content = typeof message.content === "string" ? message.content : undefined;
        }

        // attachment messages
        //   if (
        //     contentType.sameAs(ContentTypeAttachment) ||
        //     contentType.sameAs(ContentTypeRemoteAttachment)
        //   ) {
        //     content = <AttachmentContent message={message} />;
        //   }

        return content ? (
          <div
            id={i == messages.length - 1 ? "lastMessage" : message.id}
            key={message.id}
            className={`mb-2 ${message.senderAddress.toLocaleLowerCase() === address ? "text-right" : "text-left"}`}
          >
            <span
              className={`${
                message.senderAddress === address ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              } inline-block p-2 rounded-lg`}
            >
              {content}
            </span>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default Messages;
