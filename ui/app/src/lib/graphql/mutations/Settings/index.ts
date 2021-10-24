import { gql } from "@apollo/client";

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($data: SettingsInput!) {
    updateSettings(data: $data) {
      settings {
        discountSettingsSet {
          type
          value
        }
        id
        municipalityFee
        priceBreakfast
        priceHalfboard
        userAvatar
        userColor
        userName
      }
    }
  }
`