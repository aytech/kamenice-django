import { gql } from "@apollo/client"

export const CREATE_ROOMMATE = gql`
  mutation CreateRoommate($data: RoommateInput!) {
    createRoommate(data: $data) {
      roommate {
        age
        gender
        identity
        id
        name
        surname
      }
    }
  }
`

export const UPDATE_ROOMMATE = gql`
  mutation UpdateRoommate($data: RoommateInput!) {
    updateRoommate(data: $data) {
      roommate {
        age
        gender
        identity
        id
        name
        surname
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