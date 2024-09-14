import ethers from "ethers";
import p2pAbi from "@/common/abis/OptimisticP2P.json";
import cediHAbi from "@/common/abis/CediH.json";
import OptimisticP2P from "../abis/OptimisticP2P";
import CediH from "../abis/CediH";

export const MORPH_P2P_ADDRESS = "0x1E7f97Fc8C240D2B26A42d9A50592Fcd78574B41";
export const MORPH_CEDIH_ADDRESS = "0xE4052c1cCd27C049763fb42D58d612f3C79Bb9FC";

export type TokenContract = {
    address: string;
    abi: typeof CediH;
    name: string;
    symbol: string;
};

export type NetworkContractsConfig = {
    indexerUrl: string;
    name: string;
    rpcUrl: string;
    p2p: {
        address: `0x${string}`;
        abi: typeof OptimisticP2P;
    };
    tokens: TokenContract[];
};

export default {
    2810: {
        indexerUrl: "https://api.goldsky.com/api/public/project_clx6d7rlc8ppm01wb1pls7zwp/subgraphs/iexchange/morph-holesky-01/gn",
        name: "Morph Holesky",
        rpcUrl: "https://rpc-quicknode-holesky.morphl2.io",
        p2p: {
            address: MORPH_P2P_ADDRESS,
            abi: OptimisticP2P
        },
        tokens: [
            {
                address: "0x1E7f97Fc8C240D2B26A42d9A50592Fcd78574B41",
                abi: CediH,
                name: "CediH",
                symbol: "CEDIH"
            },
            {
                address: "0x8F3c46C38506E76F2614621E5c4255BA8B8b12ae",
                abi: CediH,
                name: "TRK",
                symbol: "TRK"
            },
            {
                address: "0x1840BD3e5636Ab619B1A4399b1C60d71b9FEB3a3",
                abi: CediH,
                name: "RAMP",
                symbol: "RAMP"
            }
        ]
    },
    1802203764: {
        indexerUrl: "https://query.kakarot.protofire.io/subgraphs/id/QmQ7Cgqc2ttm6yRSsxznFscr4XwwvG5mUVV62KEgb416SC",
        name: "Kakarot Sepolia",
        explorerUrl: "https://sepolia.kakarotscan.org",
        rpcUrl: "https://sepolia-rpc.kakarot.org",
        p2p: {
            address: '0x06E33C181394c4910D078F71855fF6c5ccA0f375',
            abi: OptimisticP2P
        },
        tokens: [
            {
                address: "0x3d63fEc287aD7963B614eD873690A745E635D5Fa",
                abi: CediH,
                name: "CediH",
                symbol: "CEDIH"
            },
            {
                address: "0x670a1c39227C2475de0459fAB245111F0f78A4Bf",
                abi: CediH,
                name: "TRK",
                symbol: "TRK"
            },
            {
                address: "address/0x39a7f0a342a0509C1aC248F379ba283e99c36Ae5",
                abi: CediH,
                name: "RAMP",
                symbol: "RAMP"
            }
        ]
    }
} as {
    [key: number]: NetworkContractsConfig;
};;
