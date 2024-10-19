'use client'

import { getAuth, signInWithCustomToken } from "firebase/auth";
import { createContext, useContext, ReactNode, FC, useState, useEffect, useLayoutEffect } from "react";
import { app } from "../configs/firebase";
import { darkTheme, lightTheme, RainbowKitAuthenticationProvider, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { API_ENDPOINT } from "@/common/constants";
import { useAccount, useDisconnect } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { useTheme } from "./ThemeProvider";

type Session = { status: "authenticated" | "unauthenticated" };

interface UserContextType {
  address: `0x${string}` | undefined;
  mixedCaseAddress: `0x${string}` | undefined;
  session: Session;
  isConnected: boolean;
  signUserOut: () => void;
  signUserIn: (firebaseToken: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = getAuth(app);
  const { isDarkMode } = useTheme();
  const [session, setSession] = useState<Session>({ status: auth.currentUser ? "authenticated" : "unauthenticated" });
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { isSuccess, disconnect } = useDisconnect();

  const address =
    session.status === "authenticated" ? (wagmiAddress?.toLocaleLowerCase() as `0x${string}` | undefined) : undefined;
  const mixedCaseAddress = address && wagmiAddress;

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      try {
        const response = await fetch(API_ENDPOINT + "/siwe/nonce/" + wagmiAddress?.toLocaleLowerCase());
        const nonce = await response.json();
        console.log("Nonce:", nonce);
        return nonce.nonce;
      } catch (error) {
        console.error("Error fetching nonce:", error);
        throw error;
      }
    },
    createMessage: ({ nonce, address, chainId }) => {
      try {
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });
        console.log("Message:", message);
        return message;
      } catch (error) {
        console.error("Error creating message:", error);
        throw error;
      }
    },
    getMessageBody: ({ message }) => {
      try {
        const messageBody = message.prepareMessage();
        console.log("Message Body:", messageBody);
        return messageBody;
      } catch (error) {
        console.error("Error preparing message body:", error);
        throw error;
      }
    },
    verify: async ({ message, signature }: { message: SiweMessage; signature: string }) => {
      console.log("Verify request:", { message, signature });
      try {
        const verifyRes = await fetch(API_ENDPOINT + "/siwe/verify/" + wagmiAddress?.toLowerCase(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, signature }),
        });
        if (!verifyRes.ok) {
          throw new Error("Verification failed");
        }
        const verifyJson = await verifyRes.json();
        console.log("Verify response:", verifyJson);
        await signUserIn(verifyJson.token);
        return Boolean(verifyRes.ok);
      } catch (error) {
        console.log("Error verifying message:", error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await signUserOut();
        console.log("Signed out successfully");
      } catch (error) {
        console.error("Error signing out:", error);
        throw error;
      }
    },
  });

  useLayoutEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log("qk User is signed in.", user);
        setSession({ status: "authenticated" });
      }
    });

    return () => unsubscribe();
  }, []);

  const signUserIn = async (firebaseToken: string) => {
    try {
      const userCredential = await signInWithCustomToken(auth, firebaseToken);
      // const jwt = await userCredential.user.getIdToken();
      //TODO@Jovells add jwt to requests
      setSession({ status: "authenticated" });
      // ...
    } catch (error) {
      console.error(error);
      // ...
    }
  };

  useLayoutEffect(() => {
    console.log("qd isSuccess", isSuccess);
    if (isSuccess) {
      signUserOut();
    }
  }, [isSuccess]);

  const signUserOut = async () => {
    await auth.signOut();
    setSession({ status: "unauthenticated" });
    wagmiAddress && disconnect();
    return;
  };

  console.log("session 45", session, auth.currentUser);

  const isConnected = session.status === "authenticated" && isWagmiConnected;

  return (
    <UserContext.Provider value={{ address, session, mixedCaseAddress, isConnected, signUserOut, signUserIn }}>
      <RainbowKitAuthenticationProvider status={session.status} adapter={authenticationAdapter}>
        <RainbowKitProvider
          theme={
            isDarkMode
              ? darkTheme({
                  accentColor: "#fffeee",
                  accentColorForeground: "#000011",
                  borderRadius: "medium",
                  fontStack: "system",
                })
              : lightTheme({
                  accentColor: "#000000",
                  // accentColorForeground: '#',
                  borderRadius: "medium",
                  fontStack: "system",
                })
          }
        >
          {children}
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </UserContext.Provider>
  );
};