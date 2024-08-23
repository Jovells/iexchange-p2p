// next
import { headers } from "next/headers";
// imports
import { cookieToInitialState } from "wagmi";

// contexts
// config
import { config } from "@/common/configs";
import { AppKitProvider } from "@/common/contexts";
import Providers from "@/common/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body>
        <Providers>
          <AppKitProvider initialState={initialState}>
            {children}
          </AppKitProvider>
        </Providers>
      </body>
    </html>
  );
}
