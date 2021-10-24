import { gql } from "@apollo/client";

export const SETTINGS = gql`
  query Settings {
    settings {
      discountSettingsSet {
        type
        value
      }
      id,
      municipalityFee,
      priceBreakfast,
      priceHalfboard,
      userAvatar
      userColor,
      userName
    }
    discountSettingsTypes {
      name
      value
    }
  }
`