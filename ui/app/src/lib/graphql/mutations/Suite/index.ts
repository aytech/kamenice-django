import { gql } from "@apollo/client";

export const CREATE_SUITE = gql`
  mutation CreateSuite($data: SuiteInput!) {
    createSuite(data: $data) {
      suite {
        discountSet {
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
    }
  }
`

export const UPDATE_SUITE = gql`
  mutation UpdateSuite($data: SuiteInput!) {
    updateSuite(data: $data) {
      suite {
        discountSet {
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
    }
  }
`

export const DELETE_SUITE = gql`
  mutation DeleteSuite($suiteId: ID!) {
    deleteSuite(suiteId: $suiteId) {
      suite {
        id
      }
    }
  }
`