import { gql } from '@apollo/client';

export const GET_ACCOUNT_BY_ID = gql`
  query GetAccountById($id: String!) {
    account(id: $id) {
      id
      isMerchant
    }
  }
`;

export const MY_QUERY = gql`
  query MyQuery {
    accounts {
      id
      isMerchant
    }
  }
`;