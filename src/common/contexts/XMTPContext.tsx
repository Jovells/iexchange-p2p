import {
  XMTPProvider,
  attachmentContentTypeConfig,
  reactionContentTypeConfig,
  replyContentTypeConfig,
  useClient,
} from "@xmtp/react-sdk";

const contentTypeConfigs = [attachmentContentTypeConfig, reactionContentTypeConfig, replyContentTypeConfig];

import { Children, ReactNode, useEffect } from "react";
import { useUser } from "./UserContext";
import useInitXmtpClient from "../hooks/useInitXmtpClient";
import { wipeKeys } from "../helpers";

const ChatProvider = ({ children }: { children: ReactNode }) => (
  <XMTPProvider contentTypeConfigs={contentTypeConfigs}>
    <Content>{children}</Content>
  </XMTPProvider>
);

export default ChatProvider;

const Content = ({ children }: { children: ReactNode }) => {
  const { mixedCaseAddress } = useUser();
  const { client, disconnect } = useClient();

  useEffect(() => {
    const checkSigners = () => {
      const userAddress = mixedCaseAddress;
      const clientAddress = client?.address;
      console.log("qf inside", userAddress, clientAddress);

      // addresses must be defined before comparing
      if (clientAddress && userAddress !== clientAddress) {
        console.log("qf different");

        void disconnect();
        wipeKeys(clientAddress ?? "");
      }
    };
    void checkSigners();
  }, [disconnect, client?.address, mixedCaseAddress]);

  return <>{children}</>;
};
