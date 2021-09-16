import { gql } from "@apollo/client";

export const ROOMMATES = gql`
  query Roommates($guestId: ID!) {
    roommates(guestId: $guestId) {
      age
      gender
      identity
      id
      name
      surname
    }
  }
`