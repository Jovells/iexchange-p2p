import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/52116/iexchange-base-sepolia/version/latest",
    cache: new InMemoryCache()
});

export default client;