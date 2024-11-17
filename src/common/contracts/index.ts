import OptimisticP2P from "../abis/OptimisticP2P";
import CediH from "../abis/CediH";
import faucet from "../abis/Faucet";

export type TokenContract = {
  address: `0x${string}`;
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
  faucet: {
    address: `0x${string}`;
    abi: typeof faucet;
  };
  tokens: TokenContract[];
};

export default {
  2810: {
    indexerUrl: "https://api.goldsky.com/api/public/project_clx6d4c008ktz01wl79of786q/subgraphs/iexchange/morph/gn",
    name: "Morph Holesky",
    rpcUrl: "https://rpc-quicknode-holesky.morphl2.io",
    p2p: {
      address: "0x1E7f97Fc8C240D2B26A42d9A50592Fcd78574B41",
      abi: OptimisticP2P,
    },
    faucet: {
      address: "0x8C49Fd0b3E42DbAE0b13Fde81E3023c626E6f198",
      abi: faucet,
      nativeUrl: "https//morphfaucet.com/",
    },
    tokens: [
      {
        address: "0xE4052c1cCd27C049763fb42D58d612f3C79Bb9FC",
        abi: CediH,
        name: "CediH",
        symbol: "CEDIH",
      },
      {
        address: "0x8F3c46C38506E76F2614621E5c4255BA8B8b12ae",
        abi: CediH,
        name: "TRK",
        symbol: "TRK",
      },
      {
        address: "0x1840BD3e5636Ab619B1A4399b1C60d71b9FEB3a3",
        abi: CediH,
        name: "RAMP",
        symbol: "RMP",
      },
    ],
  },
  421614: {
    indexerUrl: "https://api.goldsky.com/api/public/project_cm3hlsxsh8t4p01xe6i5c4s0e/subgraphs/iexchange/v3/gn",
    name: "Arbitrum Sepolia",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    p2p: {
      address: "0x3B42D1dEF553EE484984C6c3c769BE58005f5d11",
      abi: OptimisticP2P,
    },
    faucet: {
      address: "0xe38b25BC2421F5Fde72661FA4c5c3035453bfCE6",
      abi: faucet,
      nativeUrl: "https://www.alchemy.com/faucets/arbitrum-sepolia",
    },
    tokens: [
      {
        address: "0xe8fB78FD7C76A3e2f500d4302E8a75E6706804f8",
        abi: CediH,
        name: "IX USDT",
        symbol: "USDT",
      },
      {
        address: "0x612Dfa9fF8d6D19eff48A78D2827aC5a8F138596",
        abi: CediH,
        name: "IX USDC",
        symbol: "USDC",
      },
    ],
  },
  920637907288165: {
    indexerUrl: "https://query.kakarot.protofire.io/subgraphs/name/kakarot/iexchange",
    name: "Kakarot Sepolia",
    explorerUrl: "https://sepolia.kakarotscan.org",
    rpcUrl: "https://sepolia-rpc.kakarot.org",
    p2p: {
      address: "0xEd64A15A6223588794A976d344990001a065F3f1",
      abi: OptimisticP2P,
    },
    faucet: {
      address: "0x5FBDb7C37E3338130F925ec5355B29A6d6Da5309",
      abi: faucet,
    },
    tokens: [
      {
        address: "0xB2002EaFC86DD21eaDAed4b1a7857357a6C3f41f",
        abi: CediH,
        name: "CediH",
        symbol: "CEDIH",
      },
      {
        address: "0x53637cE365d796FA32eE3FB1A0cB8408Df0fB554",
        abi: CediH,
        name: "TRK",
        symbol: "TRK",
      },
      {
        address: "0xF5Bd8F96A9cb7e27a838aFA4AF55df5594bc9041",
        abi: CediH,
        name: "IX USDC",
        symbol: "USDC",
      },
      {
        address: "0x7281b4cCA308aF757D8BE75e62241e5e0c88CAA3",
        abi: CediH,
        name: "IX USDT",
        symbol: "USDt",
      },
      {
        address: "0x08FD9b19435dD5bdbaF183EE3fe68dCD6fD709EF",
        abi: CediH,
        name: "RAMP",
        symbol: "RMP",
      },
    ],
  },
} as {
  [key: number]: NetworkContractsConfig;
};
