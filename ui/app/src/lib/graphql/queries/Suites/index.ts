import { gql } from "@apollo/client";

export const SUITES = gql`
  query Suites {
    suites {
      id
      title
      number
    }
  }
`

export const SUITES_WITH_RESERVATIONS = gql`
  query SuitesWithReservations {
    guests {
      id
      name
      surname
    }
    suites {
      id
      number
      title
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
      }
      toDate
      type
    }
  }
`