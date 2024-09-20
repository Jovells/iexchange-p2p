import  ethers  from "ethers";

declare global {
  interface Window {
    ethereum?: ethers.BrowserProvider ; // or use `any` if you don't want to use `ethers` types
  }
}

