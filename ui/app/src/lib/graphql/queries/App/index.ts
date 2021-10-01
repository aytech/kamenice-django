import { gql } from "@apollo/client";

export const APP = gql`
  query App {
    pageTitle @client
    selectedPage @client
  }
`