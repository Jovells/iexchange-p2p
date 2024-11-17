import { fetchGraphQL } from ".";
import { Token } from "./types";


const operation = `query tokens {
  p2Ptokens {
    id
    isTraded
    name
    symbol
  }
}`;


export async function fetchTokens(indexerUrl: string) {
    const graphdata = (await fetchGraphQL(indexerUrl, operation, "tokens",{})) as { p2Ptokens: Token[] };

    return graphdata.p2Ptokens;
  }