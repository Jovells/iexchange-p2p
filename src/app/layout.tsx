// next
import { headers } from "next/headers";
// imports
import { cookieToInitialState } from "wagmi";

// contexts
// config
import { config } from "@/common/configs";
import { AppKitProvider } from "@/common/contexts";
import ModalManager from "@/components/shared/modal/Modal";
import { ModalContextProvider } from "@/common/contexts/ModalContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body>
        <AppKitProvider initialState={initialState}>
          <ModalContextProvider>
            {children}
            <ModalManager />
          </ModalContextProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}
