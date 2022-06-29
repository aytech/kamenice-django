import { gql } from "@apollo/client";

export const SUITES = gql`
  query Suites {
    suites {
      discountSuiteSet {
        type
        value
      }
      id
      number
      numberBeds
      numberBedsExtra
      priceBase
      title
    }
    discountSuiteTypes {
      name
      value
    }
  }
`