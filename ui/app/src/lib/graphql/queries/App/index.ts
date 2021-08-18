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
    reservations {
      fromDate
      id
      guest {
        id
        name
        surname
      }
      meal
      notes
      purpose
      roommates {
        id
        name
        surname
      }
      suite {
        id
        number
        title
      }
      toDate
      type
    }
    suites {
      id
      number
      title
    }
    whoami {
      username
    }
  }
`