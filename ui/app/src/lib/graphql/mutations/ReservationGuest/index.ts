import { gql } from "@apollo/client";

export const UPDATE_RESERVATON_GUEST = gql`
  mutation UpdateReservationGuest($data: ReservationGuestInput!) {
    updateReservationGuest(data: $data) {
      guest {
        addressMunicipality
        addressPsc
        addressStreet
        age
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
  }
`

export const UPDATE_RESERVATON_ROOMMATE = gql`
  mutation UpdateReservationRoommate($data: ReservationRoommateInput!) {
    updateReservationRoommate(data: $data) {
      roommate {
        addressMunicipality
        addressPsc
        addressStreet
        age
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
  }
`

export const CREATE_RESERVATON_ROOMMATE = gql`
  mutation CreateReservationRoommate($data: ReservationRoommateInput!) {
    createReservationRoommate(data: $data) {
      roommate {
        addressMunicipality
        addressPsc
        addressStreet
        age
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
  }
`

export const DELETE_RESERVATON_ROOMMATE = gql`
  mutation DeleteReservationRoommate($data: ReservationRoommateInput!) {
    deleteReservationRoommate(data: $data) {
      roommate {
        id
        name
        surname
      }
    }
  }
`