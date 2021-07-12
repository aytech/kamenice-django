import { gql } from "@apollo/client";

export const SUITES = gql`
  query Suites {
    suites {
      id
      title
      number
    }
  }
`