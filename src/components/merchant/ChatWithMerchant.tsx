'use client'

import { shortenAddress } from "@/lib/utils";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useEthersSigner } from "@/common/hooks/useEthersSigner";
import {
  useCanMessage,
  useStartConversation,
  CachedConversation,
  useSendMessage,
  useConversation,
} from "@xmtp/react-sdk";
import { useModal } from "@/common/contexts/ModalContext";
import Button from "../ui/Button";
import Messages from "./Messages";
import { checksumAddress } from "viem";
import useInitXmtpClient from "@/common/hooks/useInitXmtpClient";
import ModalAlert from "../modals";
import { BOT_MERCHANT_ID } from "@/common/constants";

const ChatWithMerchant = ({
  otherParty,
  conversation,
  setConversation,
}: {
  otherParty: { id: `0x${string}`; name?: string };
  conversation: CachedConversation | undefined;
  setConversation: (conversation: CachedConversation | undefined) => void;
}) => {
  const { client, status, signing, reset, preInit, resolveEnable, resolveCreate } = useInitXmtpClient();
  const { getCachedByPeerAddress } = useConversation();
  const { startConversation, error: startConversationError } = useStartConversation();
  const { canMessage } = useCanMessage();
  const { sendMessage: sendXMTPMessage, isLoading, error: sendMessageError } = useSendMessage();
  const { showModal, hideModal } = useModal();
  const [messageInputValue, setInputValue] = useState("");
  const [otherUserIsOnNetwork, setOtherUserIsOnNetwork] = useState(false);
  const alreadyShownRef = useRef({ new: false, enabled: false });

  const signer = useEthersSigner();

  const mixedCaseOtherPartyAddress = checksumAddress(otherParty.id);
  const isBot = otherParty.id === BOT_MERCHANT_ID;

  useEffect(() => {
    console.log("qg useClient", client?.address, client, status);
    if (!client && !preInit && !alreadyShownRef.current.enabled) {
      alreadyShownRef.current.enabled = true;
      console.log("qg client not initialized");
      //no need to chat with bot
      !isBot &&
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
      alreadyShownRef.current.new = true;
      console.log("qg status new");
      //no need to chat with bot
      !isBot &&
        showModal(
          <>
            <ModalAlert
              modalType="info"
              title="Create Your XMTP Account"
              description="To enable secure messaging, we need to create your XMTP account. This requires signing two(2) messages. One to create your xmtp account and one to enable messaging for your account. This process ensures end-to-end encryption for all your conversations."
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
  }, [client?.address, preInit, reset, status]);

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
    <div id="messagesContainer" className="w-full min-h-[500px] max-h-[500px] border rounded-xl flex flex-col dark:border-gray-700">
      <div className="w-full flex content-between justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-t-xl text-black dark:text-white">
        <span>
          {" "}
          {otherParty.name} {shortenAddress(otherParty.id)}
        </span>
        {/* TODO @Jovells refine this */}
        {otherUserIsOnNetwork ? (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Messaging Enabled
          </span>
        ) : client ? (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-[#f6465d] bg-red-100 rounded-full">
            Messaging Disabled.
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-[#f6465d] bg-red-100 rounded-full">
            Messaging Disabled
          </span>
        )}
      </div>

      {conversation ? (
        <Messages isLoading={isLoading} conversation={conversation} />
      ) : client ? (
        otherUserIsOnNetwork ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-800 dark:text-white">No messages yet</div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center font-bold text-sm p-2 rounded-[5px] bg-slate-400 dark:bg-slate-800  text-gray-800 dark:text-slate-300">
              The counterparty has not yet enabled messaging.
            </div>
          </div>
        )
      ) : (
        <div className="flex-1 flex flex-col gap-2 items-center justify-center">
          <div className="text-center text-gray-800 dark:text-white">Messaging not enabled</div>
          <Button
            loading={signing}
            loadingText="Please Sign in Wallet"
            onClick={resolveEnable}
            className="text-gray-800 border dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Enable Messaging
          </Button>
        </div>
      )}

      {otherUserIsOnNetwork && (
        <div className="w-full p-3 flex gap-2 bg-white dark:bg-gray-900 rounded-b-xl">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full rounded-xl p-2 pr-10 focus:outline-none bg-gray-100 dark:bg-gray-800 dark:text-white transition-all duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
              value={messageInputValue}
              onChange={handleInputChange}
              onKeyDown={e => {
                console.log("keydown", e.key);
                e.key === "Enter" && sendMessage();
                e.key === "Enter" && setInputValue("");
              }}
            />
          </div>
          <Button
            className="bg-[#01A2E4] w-10 h-10 text-white p-2 rounded-full hover:bg-[#01a2e4] dark:bg-blue-400 dark:hover:bg-blue-500"
            onClick={() => sendMessage()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatWithMerchant;



