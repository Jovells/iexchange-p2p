// next
import { headers } from "next/headers";
// imports
import { cookieToInitialState } from "wagmi";

// contexts
// config
import { WalletProvider } from "@/common/contexts";
import ModalManager from "@/components/shared/modal/Modal";
import { ModalContextProvider } from "@/common/contexts/ModalContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
<WalletProvider>
          <ModalContextProvider>
            {children}
            <ModalManager />
          </ModalContextProvider>
        
  </WalletProvider>            
      </body>
    </html>
  );
}
