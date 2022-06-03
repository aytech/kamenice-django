import { gql } from "@apollo/client";

export const SETTINGS = gql`
  query Settings {
    settings {
      defaultArrivalTime
      defaultDepartureTime
      id,
      municipalityFee,
      priceBreakfast,
      priceBreakfastChild,
      priceHalfboard,
      priceHalfboardChild,
      userAvatar
      userColor,
      userName
    }
  }
`