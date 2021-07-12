import { gql } from "@apollo/client";

export const GUESTS = gql`
  query Guests {
    guests {
      id
      name
      surname
    }
  }
`