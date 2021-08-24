import { gql } from "@apollo/client";

export const GUESTS = gql`
  query Guests {
    guests {
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