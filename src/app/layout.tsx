// next
import { headers } from "next/headers";
// imports
import { cookieToInitialState } from "wagmi";

// contexts
// config
import { config } from "@/common/configs";
import { AppKitProvider } from "@/common/contexts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body>
        <AppKitProvider initialState={initialState}>{children}</AppKitProvider>
      </body>
    </html>
  );
}
