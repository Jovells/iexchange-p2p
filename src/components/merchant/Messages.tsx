import { useUser } from "@/common/contexts/UserContext";
import { CachedConversation, DecodedMessage, useStreamMessages } from "@xmtp/react-sdk";
import { useCallback, useState } from "react";

const Messages = ({ conversation }: { conversation: CachedConversation }) => {
  const [streamedMessages, setStreamedMessages] = useState<DecodedMessage[]>([]);
  const { address } = useUser();

  const onMessage = useCallback(
    (message: DecodedMessage) => {
      console.log("qs On__message", message);
      setStreamedMessages(prev => [...prev, message]);
    },
    [streamedMessages],
  );

  const { error: streamError } = useStreamMessages(conversation!, { onMessage });
  console.log("qs streamedMessages", streamedMessages, "conversation", conversation, "streamError", streamError);

  return (
    <div className="flex-1 p-3 overflow-y-auto">
      {streamedMessages.map(message => (
        <div
          key={message.id}
          className={`mb-2 ${message.senderAddress.toLocaleLowerCase() === address ? "text-right" : "text-left"}`}
        >
          <span
            className={`${
              message.senderAddress === address ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
            } inline-block p-2 rounded-lg`}
          >
            {message.content}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Messages;
