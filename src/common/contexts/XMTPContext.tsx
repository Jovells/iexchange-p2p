import {
  XMTPProvider,
  attachmentContentTypeConfig,
  reactionContentTypeConfig,
  replyContentTypeConfig,
} from "@xmtp/react-sdk";

const contentTypeConfigs = [attachmentContentTypeConfig, reactionContentTypeConfig, replyContentTypeConfig];

import { ReactNode } from "react";

const ChatProvider = ({ children }: { children: ReactNode }) => (
  <XMTPProvider contentTypeConfigs={contentTypeConfigs}>{children}</XMTPProvider>
);

export default ChatProvider;
