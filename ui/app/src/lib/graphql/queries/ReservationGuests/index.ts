import { gql } from "@apollo/client";

export const RESERVATION_GUESTS = gql`
  query ReservationGuests($reservationHash: String!) {
    reservationGuests(reservationHash: $reservationHash) {
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
      roommates {
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