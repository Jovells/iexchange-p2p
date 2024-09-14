import { fetchGraphQL } from ".";

const accountQuery = `
query merchantAccount($id:String) {
  account(id: $id) {
    id
    isMerchant
  }
}
`;



export async function fetchAccount(indexerUrl: string, id: any): Promise<any> {
  const account = await fetchGraphQL(indexerUrl, accountQuery, "merchantAccount", { id });
  return account;
}