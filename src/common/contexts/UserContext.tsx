'use client'

import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useSession } from "next-auth/react";
import { createContext, useContext, ReactNode, FC, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { UserSession } from "../types";
import { app } from "../configs/firebase";

type User = {
  uid: string;
} | undefined ;

interface UserContextType {
  user: User;
  session: UserSession;
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
  const session = useSession() as UserSession;
  const auth = getAuth(app);

  const [user, setUser] = useState<User>();

useEffect(
  () => {
    console.log("session status", session.status);
    if (session.data?.firebaseToken && !auth.currentUser?.uid) {
      console.log("signing in user");
      signUserIn(session.data.firebaseToken);
    }

    if (session.status !== "authenticated" && auth.currentUser) {
      console.log("signing out user");
      signUserOut();
    }


  },
  [session.status]
);


  const signUserIn = async (firebaseToken: string) => {
    try {
      const userCredential = await signInWithCustomToken(auth, firebaseToken);
      setUser({
        uid: userCredential.user.uid,
      });
      // ...
    } catch (error) {
      console.error(error);
      // ...
    }
 
  };

  const signUserOut = async () => {
      await auth.signOut();
      setUser(undefined);
      return;
  }

  return (
    <UserContext.Provider value={{ user, session, signUserOut, signUserIn }}>
      {children}
    </UserContext.Provider>
  );
};