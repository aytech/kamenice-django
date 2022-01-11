import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($data: ReservationInput!) {
    createReservation(data: $data) {
      reservation {
        expired
        extraSuites {
          id
        }
        fromDate
        guest {
          email
          id
          name
          surname
        }
        id
        meal
        notes
        payingGuest {
          id
        }
        priceSet {
          accommodation
          meal
          municipality
          suite {
            id
            priceBase
          }
          total
        }
        purpose
        roommates {
          age
          id
        }
        suite {
          id
          number
          title
        }
        toDate
        type
      }
    }
  }
`

export const DELETE_RESERVATION = gql`
  mutation DeleteReservation($reservationId: ID!) {
    deleteReservation(reservationId: $reservationId) {
      reservation {
        id
      }
    }
  }
`

export const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($data: ReservationInput!) {
    updateReservation(data: $data) {
      reservation {
        expired
        extraSuites {
          id
        }
        fromDate
        guest {
          email
          id
          name
          surname
        }
        id
        meal
        notes
        payingGuest {
          id
        }
        priceSet {
          accommodation
          meal
          municipality
          suite {
            id
            priceBase
          }
          total
        }
        purpose
        roommates {
          age
          id
        }
        suite {
          id
          number
          title
        }
        toDate
        type
      }
    }
  }
`

export const DRAG_RESERVATION = gql`
  mutation DragReservation($data: ReservationDragInput!) {
    dragReservation(data: $data) {
      reservation {
        fromDate
        id
        suite {
          id
          number
          title
        }
        toDate
      }
    }
  }
`

export const SEND_CONFIRMATION = gql`
  mutation SendConfirmation($data: ConfirmationInput!) {
    sendConfirmation(data: $data) {
      reservation {
        guest {
          email
        }
        id
      }
    }
  }
`