import { gql } from "@apollo/client";

export const APP = gql`
  query App {
    pageTitle @client
    selectedPage @client
    appUser @client {
      color
      id
      name
      surname
      username
    }
  }
`

export const USER = gql`
  query User {
    user {
      color
      id
      name
      surname
      username
    }
  }
`