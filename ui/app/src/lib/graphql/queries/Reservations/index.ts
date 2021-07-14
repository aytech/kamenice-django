import { gql } from "@apollo/client";

export const SUITE_RESERVATIONS = gql`
  query SuiteReservations($suiteId: Int!) {
    suiteReservations(suiteId: $suiteId) {
      fromYear
      fromMonth
      fromDay
      fromHour
      fromMinute
      guest {
        id
        name
        surname
      }
      id
      roommates {
        id
        name
        surname
      }
      toYear
      toMonth
      toDay
      toHour
      toMinute
      type
    }
  }
`

export const RESERVATIONS = gql`
  query Reservations {
    reservations {
      fromYear
      fromMonth
      fromDay
      fromHour
      fromMinute
      id
      suite {
        id
        title
        number
      }
      toYear
      toMonth
      toDay
      toHour
      toMinute
      type
    }
  }
`