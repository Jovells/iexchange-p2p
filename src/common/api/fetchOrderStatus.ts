const operation = `
  query orderStatus ($orderId: String!) {
    order(id: $orderId) {
      status
      blockTimestamp
    }
  }
`;
import { fetchGraphQL } from ".";
import { OrderStatusResponse } from "./types";

// Create a query against the collection.

export default async function fetchOrderStatus(indexerUrl: string, orderId: string) {
  const graphdata = (await fetchGraphQL(indexerUrl, operation, "orderStatus", {
    orderId,
  })) as OrderStatusResponse;

  const data = graphdata.order;
  console.log("qdorder status", graphdata)
  return data;
}
