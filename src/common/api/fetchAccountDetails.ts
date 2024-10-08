import { API_ENDPOINT } from "../constants";
import { AccountDetails } from "./types";

export default async (accountHash: string): Promise<AccountDetails> => {
  console.log("fetching account details", accountHash);
  try {
    const response = await fetch(`${API_ENDPOINT}/account/hash/${accountHash}`);
    if (!response.ok) {
      throw new Error("Error fetching account details");
    }
    const accountDetails = await response.json();
    // Process the account details here
    console.log("accountDetails", accountDetails);
    return accountDetails;
  } catch (error: any) {
    throw new Error("Error fetching account details:", error);
  }
};
