import { gql } from "@apollo/client";

export const CREATE_SUITE = gql`
  mutation CreateSuite($data: SuiteInput!) {
    createSuite(data: $data) {
      suite {
        id
        number
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
        title
      }
    }
  }
`