'use client'

import { Merchant } from '@/common/api/types';
import { shortenAddress } from '@/lib/utils';
import { Send, X } from "lucide-react";
import React, { use, useCallback, useEffect, useState } from "react";
import { useEthersSigner } from "@/common/hooks/useEthersSigner";
import {
  Client,
  useStreamMessages,
  useClient,
  useMessages,
  useConversations,
  useCanMessage,
  useStartConversation,
  DecodedMessage,
  Conversation,
  CachedConversation,
  useSendMessage,
} from "@xmtp/react-sdk";
import { useUser } from "@/common/contexts/UserContext";
import { useModal } from "@/common/contexts/ModalContext";
import Button from "../ui/Button";
import Messages from "./Messages";

type XMTPConnectButtonProps = {
  label: string;
  onFinish?: () => void;
};

const XMTPConnectButton: React.FC<XMTPConnectButtonProps> = ({ label, onFinish }) => {
  const { initialize, client } = useClient();
  const signer = useEthersSigner();

  const handleConnect = useCallback(async () => {
    const c = await initialize({
      signer: signer,
      options: {
        env: "dev",
      },
    });
    console.log("qd c", c?.address);
    onFinish && onFinish();
  }, [initialize, signer]);

  console.log("qd client", client);

  return <Button onClick={handleConnect}>{label}</Button>;
};

const ChatWithMerchant = ({ otherParty }: { otherParty: { id: `0x${string}`; name?: string } }) => {
  const { client, disconnect } = useClient();
  const { conversations } = useConversations();
  const { startConversation } = useStartConversation();
  const { canMessage } = useCanMessage();
  const { sendMessage: sendXMTPMessage, error: sendMessageError } = useSendMessage();
  const { address } = useUser();
  const { showModal, hideModal } = useModal();
  const [messages, setMessages] = useState([{ sender: "Merchant", text: "Hi there! How can I help you?" }]);
  const [messageInputValue, setInputValue] = useState("");
  const [otherUserIsOnNetwork, setOtherUserIsOnNetwork] = useState(false);
  const [conversation, setConversation] = useState<CachedConversation>();

  conversation && console.log("qs conversations", conversations, "conversation: ", conversation);

  const handleInit = async () => {
    showModal(
      <>
        <div>Please Sign to to Allow Messaging</div>
        <XMTPConnectButton onFinish={hideModal} label="Connect XMTP" />
      </>,
      { hasPadding: true },
    );
  };

  useEffect(() => {
    if (!client) {
      handleInit();
    }
    if (client) {
      const checkIfOtherUserIsOnNetwork = async () => {
        const otherPartyAddress = otherParty.id;
        const _canMessage = await canMessage(otherPartyAddress);
        setOtherUserIsOnNetwork(_canMessage);
      };
      checkIfOtherUserIsOnNetwork();
    }
  }, [client]);

  const sendMessage = async () => {
    const otherPartyAddress = otherParty.id;
    if (!client) {
      return await handleInit();
    }

    if (messageInputValue.trim()) {
      if (otherUserIsOnNetwork) {
        if (!conversation) {
          const _conversation = await startConversation(otherPartyAddress, messageInputValue);
          setConversation(_conversation.cachedConversation);
          console.log("qs sent conversation", _conversation);
        } else {
          const sentMessage = await sendXMTPMessage(conversation, messageInputValue);
          console.log("qs sent message", sentMessage);
        }
      }
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  console.log("qs streamError", sendMessageError && "Error sending message");

  return (
    <div className="w-full h-full border rounded-xl flex flex-col">
      <div className="w-full bg-gray-100 p-3 rounded-t-xl">
        {otherParty.name} {shortenAddress(otherParty.id)}
        {otherUserIsOnNetwork ? " is online" : " is offline"}
      </div>

      {conversation ? (
        <Messages conversation={conversation} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">No messages yet</div>
        </div>
      )}

      <div className="w-full p-3 bg-white rounded-b-xl">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full border rounded-xl p-2 pr-10 focus:outline-none bg-gray-100"
            value={messageInputValue}
            onChange={handleInputChange}
            onKeyDown={e => e.key === "Enter" && sendMessage}
          />
          <button
            className="absolute right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            onClick={() => sendMessage()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWithMerchant;
