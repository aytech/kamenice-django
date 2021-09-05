import { gql } from "@apollo/client";

export const CREATE_SUITE = gql`
  mutation CreateSuite($data: SuiteInput!) {
    createSuite(data: $data) {
      suite {
        id
        number
        numberBeds
        priceBase
        priceChild
        priceExtra
        priceInfant
        title
      }
    }
  }
`

export const UPDATE_SUITE = gql`
  mutation UpdateSuite($data: SuiteInput!) {
    updateSuite(data: $data) {
      suite {
        id
        number
        numberBeds
        priceBase
        priceChild
        priceExtra
        priceInfant
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