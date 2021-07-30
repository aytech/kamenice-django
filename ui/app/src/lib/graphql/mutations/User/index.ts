import { gql } from "@apollo/client";

export const JWT_TOKEN_LOGIN = gql`
  mutation RetrieveToken($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  } 
`

export const JWT_TOKEN_LOGOUT = gql`
  mutation DeleteToken {
    deleteToken {
      deleted
    }
  } 
`