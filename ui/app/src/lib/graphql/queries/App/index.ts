import { gql } from "@apollo/client";

export const APP = gql`
  query App {
    appUser @client {
      color
      id
      name
      surname
      username
    }
    discountOptions @client {
      label
      value
    }
    guestDrawerOpen @client
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