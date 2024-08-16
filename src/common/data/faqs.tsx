import React from "react";

export const FAQs = [
  {
    title: 'What is iExchange?',
    content: `iExchange offers traders a decentralized P2P platform to convert crypto to fiat & vice versa using a decentralized wallet.`,
  },
  {
    title: 'How do I use iExchange?',
    content: `Explore the iExchange platform, analyse the amount you want to sell or buy if you need to go through zkKYC. Connect wallet, select the Ad of the merchant you want to trade with and go through the buy or sell process to convert your funds.`,
  },
  {
    title: "What is iExchange's onchain AML & zkKYC?",
    content: `On-chain AML & zkKYC solution with off-chain AI monitoring agents for real-time detection and reporting of fraudulent addresses to the blockchain.`,
  },
  {
    title: `How does iExchange work?`,
    content: <div>
      <h1>
        Buy Flow

      </h1>
      <p className="mb-4">
        Ensure Connect Wallet, the trader will see a list of offers listed from the smart contract by the merchants. The trader will place the order to the smart contract (Sign and Send Transaction). The seller will confirm the order prompting the trader to send fiat to the seller. They can also decide to cancel (Sign and Send Transaction). The trader will confirm they've sent fiat to the smart contract (Sign and Send Transaction), the seller will see the order and confirm receipt to the smart contract (Sign and Send Transaction), crypto will be automatically released to the trader & in case of dispute, several settlers are invited to investigate and vote.
      </p>

      <h1>
        Sell Flow
      </h1>
      <p className="mb-4">
        Ensure Connect Wallet, the trader will see a list of offers listed from the smart contract by merchants. The trader will place the order by sending crypto to the smart contract (Sign and Send Transaction) (erc20 token approval needed). The buyer will see the order and send fiat, they can also decide to cancel. The buyer will confirm they’ve sent fiat to the smart contract (Sign and Send Transaction). The trader will confirm receipt to the smart contract (Sign and Send Transaction). The funds will be automatically released to the buyer & in case of dispute, several settlers are invited to investigate and vote.
      </p>
      <h1>
        Settle Flow
      </h1>
      <p className="mb-4">
        After the initial appeal, a settler is invited to oversee the situation. The settler decides which party is not guilty by voting to either cancel or release the token. If either party does not agree they can opt for another appeal. An Appeal can happen 4 times max. If there is still a misunderstanding it will be open for the entire DAO to also make their decision. The majority decision of the DAO is final, 70% quorum with 75% majority is required, Settlers get rewarded & the reward is a fraction of the penalty. DAO gets rewarded if they end up participating & penalty is charged to the guilty party.
      </p>
    </div>,
  },
];

