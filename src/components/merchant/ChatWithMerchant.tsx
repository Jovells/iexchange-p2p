'use client'

import { shortenAddress } from "@/lib/utils";
import { Send, X } from "lucide-react";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { useEthersSigner } from "@/common/hooks/useEthersSigner";
import {
  useClient,
  useConversations,
  useCanMessage,
  useStartConversation,
  CachedConversation,
  useSendMessage,
  useConversation,
} from "@xmtp/react-sdk";
import { useUser } from "@/common/contexts/UserContext";
import { useModal } from "@/common/contexts/ModalContext";
import Button from "../ui/Button";
import Messages from "./Messages";
import { checksumAddress } from "viem";

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
  const { getCachedByPeerAddress } = useConversation();
  const { startConversation } = useStartConversation();
  const { canMessage } = useCanMessage();
  const { sendMessage: sendXMTPMessage, error: sendMessageError } = useSendMessage();
  const { address, mixedCaseAddress } = useUser();
  const { showModal, hideModal } = useModal();
  const [messages, setMessages] = useState([{ sender: "Merchant", text: "Hi there! How can I help you?" }]);
  const [messageInputValue, setInputValue] = useState("");
  const [otherUserIsOnNetwork, setOtherUserIsOnNetwork] = useState(false);
  const [conversation, setConversation] = useState<CachedConversation | undefined>();

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
    console.log("qs useClient", client?.address);
    if (!client) {
      handleInit();
    }
    if (client) {
      const checkIfOtherUserIsOnNetwork = async () => {
        const otherPartyAddress = otherParty.id;
        const _canMessage = await canMessage(otherPartyAddress);
        if (_canMessage) {
          const mixedCaseOtherPartyAddress = checksumAddress(otherPartyAddress);
          console.log("qs mixedCase", mixedCaseOtherPartyAddress);
          const _conversation = await getCachedByPeerAddress(checksumAddress(mixedCaseOtherPartyAddress));
          setConversation(_conversation);
          scrollLastMessageIntoView();
          console.log("qs convos", _conversation);
          setOtherUserIsOnNetwork(_canMessage);
        }
      };
      checkIfOtherUserIsOnNetwork();
    }
  }, [client?.address]);

  const sendMessage = async () => {
    const otherPartyAddress = otherParty.id;
    if (!client) {
      return await handleInit();
    }

    if (messageInputValue.trim()) {
      if (otherUserIsOnNetwork) {
        if (!conversation) {
          await startConversation(otherPartyAddress, messageInputValue, undefined);
          console.log("qs sent start conversation", conversation);
        } else {
          const sentMessage = await sendXMTPMessage(conversation, messageInputValue);
          console.log("qs sent message", sentMessage);
        }
      }

      // Scroll to the bottom of the messages container
      scrollLastMessageIntoView();

      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  console.log("qs convos, ", conversation && "convo dey", "streamerr", sendMessageError && "Error sending message");

  return (
    //TODO @mbawon MAKE CONVOS SCROLL
    <div id="messagesContainer" className="w-full h-[600px] border rounded-xl flex flex-col">
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
            onKeyDown={e => {
              console.log("keydown", e.key);
              e.key === "Enter" && sendMessage();
            }}
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

function scrollLastMessageIntoView() {
  const lastMessage = document.querySelector("#lastMessage");
  console.log("qs lastMessage", lastMessage);
  if (lastMessage) {
    lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}

