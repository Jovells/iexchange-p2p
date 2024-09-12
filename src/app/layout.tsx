
import { WalletProvider } from "@/common/contexts";
import ModalManager from "@/components/shared/modal/Modal";
import { ModalContextProvider } from "@/common/contexts/ModalContext";
import { auth } from "../auth";
import { SessionProvider } from "next-auth/react";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth()
  console.log("session", session)

  return (
    <html lang="en">
      <body>
      <SessionProvider refetchInterval={0} session={session}>
<WalletProvider>
          <ModalContextProvider>
            {children}
            <ModalManager />
          </ModalContextProvider>
  </WalletProvider>
  </SessionProvider>            
      </body>
    </html>
  );
}
