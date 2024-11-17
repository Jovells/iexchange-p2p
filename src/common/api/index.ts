
export async function fetchGraphQL(
  indexerUrl: string,
  operation: string,
  operationName: string,
  variables: Record<string, any>
) {
  console.log("fetching", operationName, {
    indexerUrl,
    operation,
    operationName,
    variables,
  } );
  const result = await fetch(indexerUrl, {
    method: "POST",
    body: JSON.stringify({
      query: operation,
      variables,
      operationName,
    }),
    headers: {
      accept: "application/graphql-response+json, application/json, multipart/mixed",
    },
  });

  const resultjson = await result.json();
  console.log("fetched", operationName + ": ", resultjson);

  return resultjson.data;
}


