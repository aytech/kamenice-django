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
        color
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
        color
        email
        gender
        identity
        id
        name
        phoneNumber
        surname
        visaNumber
      }
      suite {
        numberBeds
      }
    }
    selectedGuest @client {
      addressMunicipality
      addressPsc
      addressStreet
      age
      citizenship
      color
      email
      gender
      identity
      id
      name
      phoneNumber
      surname
      visaNumber
    }
    selectedSuite @client {
      numberBeds
    }
  }
`