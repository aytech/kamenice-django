import { gql } from "@apollo/client";

export const JWT_TOKEN = gql`
  mutation RetrieveToken($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  } 
`