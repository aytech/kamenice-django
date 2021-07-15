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

export const GUESTS_FULL = gql`
  query GuestsFull {
    guests {
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