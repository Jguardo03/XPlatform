import { UserCredential } from "firebase/auth";
import { createContext } from "react";

export const AuthContext = createContext< Promise<UserCredential> | null>(null)