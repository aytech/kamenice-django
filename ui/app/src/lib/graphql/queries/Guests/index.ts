import { gql } from 'apollo-boost'

export const GUESTS = gql`
  query Guests {
    guests {
      id
      name
      surname
    }
  }
`