import { gql } from "@apollo/client";

export const HOME_PAGE = gql`
  query HomePage {
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
    whoami {
      username
    }
  }
`