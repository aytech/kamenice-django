import { gql } from "@apollo/client";

export const SUITE_RESERVATIONS = gql`
  query SuiteReservations($suiteId: Int!) {
    suiteReservations(suiteId: $suiteId) {
      fromDate
      guest {
        id
        name
        surname
      }
      id
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
        title
        number
      }
      toDate
      type
    }
  }
`

export const RESERVATIONS = gql`
  query Reservations {
    reservations {
      fromDate
      guest {
        id
        name
        surname
      }
      id
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
        title
        number
      }
      toDate
      type
    }
  }
`