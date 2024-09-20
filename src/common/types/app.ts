import { FirebaseError } from "firebase-admin";

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

  