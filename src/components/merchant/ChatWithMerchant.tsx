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
import useInitXmtpClient from "@/common/hooks/useInitXmtpClient";
import ModalAlert from "../modals";

const ChatWithMerchant = ({ otherParty }: { otherParty: { id: `0x${string}`; name?: string } }) => {
  const { client, status, preInit, resolveEnable, resolveCreate } = useInitXmtpClient();
  const { getCachedByPeerAddress } = useConversation();
  const { startConversation, error: startConversationError } = useStartConversation();
  const { canMessage } = useCanMessage();
  const { sendMessage: sendXMTPMessage, error: sendMessageError } = useSendMessage();
  const { showModal, hideModal } = useModal();
  const [messageInputValue, setInputValue] = useState("");
  const [otherUserIsOnNetwork, setOtherUserIsOnNetwork] = useState(false);
  const [conversation, setConversation] = useState<CachedConversation | undefined>();
  const signer = useEthersSigner();

  const mixedCaseOtherPartyAddress = checksumAddress(otherParty.id);

  useEffect(() => {
    console.log("qf useClient", client?.address, client, status);
    if (!client && !preInit) {
      showModal(
        <>
          <ModalAlert
            modalType="info"
            title="Please Sign to Allow Messaging"
            description="To enable secure messaging through XMTP, you need to sign a message. This is separate from your initial login and ensures end-to-end encryption for your conversations."
            buttonText="Connect to XMTP"
            buttonClick={resolveEnable}
          />
        </>,
      );
    }
    if (status === "new") {
      showModal(
        <>
          <ModalAlert
            modalType="info"
            title="Create Your XMTP Account"
            description="To enable secure messaging, we need to create your XMTP account. This requires signing a message, which is separate from your initial login. This process ensures end-to-end encryption for all your conversations."
            buttonText="Create XMTP Account"
            buttonClick={resolveCreate}
          />
        </>,
      );
    }
    if (client) {
      const checkIfOtherUserIsOnNetwork = async () => {
        const _canMessage = await canMessage(mixedCaseOtherPartyAddress);
        if (_canMessage) {
          console.log("qs mixedCase", mixedCaseOtherPartyAddress);
          const _conversation = await getCachedByPeerAddress(mixedCaseOtherPartyAddress);

          setConversation(_conversation);
          console.log("qs convos", _conversation);
          setOtherUserIsOnNetwork(_canMessage);
        }
      };
      checkIfOtherUserIsOnNetwork();
    }
  }, [client?.address, preInit]);

  const sendMessage = async () => {
    const otherPartyAddress = otherParty.id;
    if (!client) {
      return alert("Client not initialized");
    }

    if (messageInputValue.trim()) {
      if (otherUserIsOnNetwork) {
        if (!conversation) {
          const convo = await startConversation(mixedCaseOtherPartyAddress, messageInputValue);
          console.log("qs sent start conversation", convo);
          if (convo) {
            setConversation(convo.cachedConversation);
          }
        } else {
          const sentMessage = await sendXMTPMessage(conversation, messageInputValue);
          console.log("qs sent message", sentMessage);
        }
      }

      // Scroll to the bottom of the messages container

      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  console.log(
    "qs convos:, ",
    conversation ? "convo dey" : "null convo",
    "sendMessageError:",
    sendMessageError && "Error sending message",
    "startConversationError",
    startConversationError,
  );

  return (
    //TODO @mbawon MAKE CONVOS SCROLL WELL ON ALL SCREEN SIZES
    <div id="messagesContainer" className="w-full h-[600px] border rounded-xl flex flex-col dark:border-gray-700">
      <div className="w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-t-xl text-black dark:text-white">
        {otherParty.name} {shortenAddress(otherParty.id)}
        {/* TODO @Jovells refine this */}
        {otherUserIsOnNetwork ? (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Messaging Enabled
          </span>
        ) : client ? (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
            Messaging Disabled. The counterparty has not enabled messaging.
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
            Messaging Disabled
          </span>
        )}
      </div>

      {conversation ? (
        <Messages conversation={conversation} />
      ) : client ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">No messages yet</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">Messaging not enabled</div>
          <Button onClick={resolveEnable}>Enable Messaging</Button>
        </div>
      )}

      <div className="w-full p-3 bg-white dark:bg-gray-900 rounded-b-xl">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full border rounded-xl p-2 pr-10 focus:outline-none bg-gray-100 dark:bg-gray-800 dark:text-white"
            value={messageInputValue}
            onChange={handleInputChange}
            onKeyDown={e => {
              console.log("keydown", e.key);
              e.key === "Enter" && sendMessage();
            }}
          />
          <button
            className="absolute right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
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



