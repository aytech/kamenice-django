import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { pageTitles } from "../../lib/Constants"
import { RESERVATION_GUESTS } from "../../lib/graphql/queries/ReservationGuests"
import { ReservationGuests as ReservationGuestsData, ReservationGuestsVariables, ReservationGuests_reservationGuests_roommates } from "../../lib/graphql/queries/ReservationGuests/__generated__/ReservationGuests"
import { ReservationGuest } from "../../lib/Types"
import { GuestsSkeleton } from "./components/GuestsSkeleton"

interface Props {
  setPageTitle: (title: string) => void
}

export const ReservationGuests = ({ setPageTitle }: Props) => {

  let { hash }: { hash: string } = useParams()

  const [ dataLoading, setDataLoading ] = useState<boolean>(true)
  const [ roommates, setRoommates ] = useState<ReservationGuest[]>([ {}, {}, {} ])

  const { data } = useQuery<ReservationGuestsData, ReservationGuestsVariables>(RESERVATION_GUESTS, {
    variables: { reservationHash: hash },
    onCompleted: () => {
      setPageTitle(pageTitles.reservation_guests_management)
      setDataLoading(false)
    }
  })

  useEffect(() => {
    const roommateList: ReservationGuest[] = []
    data?.reservationGuests?.roommates?.forEach((roommate: ReservationGuests_reservationGuests_roommates | null) => {
      if (roommate !== null) {
        roommateList.push(roommate)
      }
    })
    setRoommates(roommateList)
  }, [ data ])

  return dataLoading ? <GuestsSkeleton /> : (
    <h1>Guests here: { hash }</h1>
  )
}