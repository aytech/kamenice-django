import { gql } from "@apollo/client";

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($data: SettingsInput!) {
    updateSettings(data: $data) {
      settings {
        id
        municipalityFee
        priceBreakfastChild
        priceBreakfast
        priceHalfboard
        priceHalfboardChild
        userAvatar
        userColor
        userName
      }
    }
  }
`