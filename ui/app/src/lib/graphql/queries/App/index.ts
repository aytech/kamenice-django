import { gql } from "@apollo/client";

export const APP = gql`
  query App {
    pageTitle @client
    reservationModalOpen @client
    selectedPage @client
    selectedSuite @client {
      number
      numberBeds
      priceBase
      priceChild
      priceExtra
      priceInfant
      title
    }
    appUser @client {
      color
      id
      name
      surname
      username
    }
  }
`

export const USER = gql`
  query User {
    user {
      color
      id
      name
      surname
      username
    }
  }
`