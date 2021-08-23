import { gql } from "@apollo/client";

export const GUEST = gql`
  query Guest($id: Int!) {
    guest(guestId: $id) {
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

