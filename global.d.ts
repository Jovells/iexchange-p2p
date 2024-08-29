import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider; // or use `any` if you don't want to use `ethers` types
  }
}
