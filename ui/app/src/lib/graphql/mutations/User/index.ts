import { gql } from "@apollo/client";

export const TOKEN_AUTH = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      payload
      refreshExpiresIn
      refreshToken
      token
    }
  }
`

export const TOKEN_VERIFY = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  } 
`

export const TOKEN_REFRESH = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      payload
      refreshExpiresIn
      refreshToken
      token
    }
  }
`

export const TOKEN_REVOKE = gql`
  mutation RevokeToken($refreshToken: String!) {
    revokeToken(refreshToken: $refreshToken) {
      revoked
    }
  }
`