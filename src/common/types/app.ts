import { FirebaseError } from "firebase-admin";
import { SessionContextValue } from "next-auth/react";

//  all global types should be defined here
export type userUpdateValidationResult = {
    email: boolean,
    username: boolean,
    [key: string]: boolean; 
  }

  export type SignUpData =
  { username?: string,
    usernameLowercase?: string; 
    email?: string,
    displayName?: string, 
    profilePicture?: File,
    photoURL?: string,
    tags?: string[]
    isComplete?: boolean,
   }

  

  export type UserSession = SessionContextValue & {
    data: SessionContextValue['data'] & {
    firebaseToken?: string;
    isMultipleSignUpAttempt?: boolean
    isNotSignedUp?: boolean
    address?: string
    isNewUser?:boolean 
    error?: FirebaseError & {[key:string]: any}
    validateSignUpResult?: {email: boolean, username: boolean}
    }
  }