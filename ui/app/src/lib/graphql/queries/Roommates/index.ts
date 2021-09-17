import { gql } from "@apollo/client";

export const ROOMMATES = gql`
  query Roommates($guestId: ID!) {
    roommates(guestId: $guestId) {
      age
      addressMunicipality
      addressPsc
      addressStreet
      citizenship
      email
      gender
      identity
      id
      name
      phoneNumber
      surname
      visaNumber
    }
  }
`