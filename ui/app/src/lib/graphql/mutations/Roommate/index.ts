import { gql } from "@apollo/client"

export const CREATE_ROOMMATE = gql`
  mutation CreateRoommate($data: RoommateInput!) {
    createRoommate(data: $data) {
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

export const UPDATE_ROOMMATE = gql`
  mutation UpdateRoommate($data: RoommateInput!) {
    updateRoommate(data: $data) {
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

export const DELETE_ROOMMATE = gql`
  mutation DeleteRoommate($roommateId: ID!) {
    deleteRoommate(roommateId: $roommateId) {
      roommate {
        id
      }
    }
  }
`