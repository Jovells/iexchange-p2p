'use client'

import { getAuth, signInWithCustomToken } from "firebase/auth";
import { createContext, useContext, ReactNode, FC, useState, useEffect } from "react";
import { app } from "../configs/firebase";
import { darkTheme, RainbowKitAuthenticationProvider, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { SiweMessage } from 'siwe';
import { API_ENDPOINT } from '@/common/api/constants';
import { useAccount } from "wagmi";



type Session = {status: "authenticated" | "unauthenticated", jwt: string}

interface UserContextType {
  address: `0x${string}` | undefined;
  session: Session;
  signUserOut: () => void;
  signUserIn: (firebaseToken: string) => void;
}


export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const auth = getAuth(app);
  const [session, setSession]  = useState<Session>({status: auth.currentUser ? "authenticated" : "unauthenticated", jwt: "",}); 
  const {address: mixedCaseAddress} = useAccount(); 

  const address = mixedCaseAddress?.toLocaleLowerCase() as `0x${string}` | undefined;
  
  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      try {
        const response = await fetch(API_ENDPOINT + '/siwe/nonce/'+ address?.toLocaleLowerCase());
        const nonce = await response.json();
        console.log('Nonce:', nonce);
        return nonce.nonce;
      } catch (error) {
        console.error('Error fetching nonce:', error);
        throw error;
      }
    },
    createMessage: ({ nonce, address, chainId }) => {
      try {
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        });
        console.log('Message:', message);
        return message;
      } catch (error) {
        console.error('Error creating message:', error);
        throw error;
      }
    },
    getMessageBody: ({ message }) => {
      try {
        const messageBody = message.prepareMessage();
        console.log('Message Body:', messageBody);
        return messageBody;
      } catch (error) {
        console.error('Error preparing message body:', error);
        throw error;
      }
    },
    verify: async ({ message, signature }: { message: SiweMessage, signature: string }) => {
      console.log('Verify request:', { message, signature });
      try {
        const verifyRes = await fetch(API_ENDPOINT + '/siwe/verify/'+ address?.toLowerCase(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, signature }),
        });
        if (!verifyRes.ok) {
          throw new Error('Verification failed');
        }
        const verifyJson = await verifyRes.json();
        console.log('Verify response:',verifyJson);
        await signUserIn(verifyJson.token)
        return Boolean(verifyRes.ok);
      } catch (error) {
        console.log('Error verifying message:', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await signUserOut();
        console.log('Signed out successfully');
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    },
  });
  


  const signUserIn = async (firebaseToken: string) => {
    try {
      const userCredential = await signInWithCustomToken(auth, firebaseToken);
      const jwt = await userCredential.user.getIdToken();
      setSession({status: "authenticated", jwt: jwt});
      // ...
    } catch (error) {
      console.error(error);
      // ...
    }
 
  };

  const signUserOut = async () => {
      await auth.signOut();
      setSession({status: "unauthenticated", jwt: ""});
      return;
  }

  console.log("session 45", session);


  return (
    <UserContext.Provider value={{ address, session, signUserOut, signUserIn }}>
          <RainbowKitAuthenticationProvider  status ={session.status} adapter = {authenticationAdapter}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#000000',
          // accentColorForeground: '#',
          borderRadius: 'medium',
          fontStack: "system"
        })}>
          
      {children}
        </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
    </UserContext.Provider>
  );
};