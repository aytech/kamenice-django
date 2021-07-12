import { gql } from "@apollo/client";

export const RESERVATIONS = gql`
  query Reservations($suiteId: Int!) {
    reservations(suiteId: $suiteId) {
      id
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