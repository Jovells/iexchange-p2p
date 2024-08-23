import ethers from "ethers";
import p2pAbi from "@/common/abis/OptimisticP2P.json";
import cediHAbi from "@/common/abis/CediH.json";

export const MORPH_P2P_ADDRESS = "0x1E7f97Fc8C240D2B26A42d9A50592Fcd78574B41";
export const MORPH_CEDIH_ADDRESS = "0xE4052c1cCd27C049763fb42D58d612f3C79Bb9FC";

export const CEDIH_ABI = [...cediHAbi.abi] as const;
export const P2P_ABI = [...p2pAbi.abi] as const;
