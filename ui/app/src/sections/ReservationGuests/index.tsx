import { useQuery } from "@apollo/client"
import { Spin } from "antd"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { pageTitles } from "../../lib/Constants"
import { Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { RESERVATION_GUESTS } from "../../lib/graphql/queries/ReservationGuests"
import { ReservationGuests as ReservationGuestsData, ReservationGuestsVariables, ReservationGuests_reservationGuests_roommates } from "../../lib/graphql/queries/ReservationGuests/__generated__/ReservationGuests"
import { ReservationGuest } from "../../lib/Types"
import { Error } from "./components/Error"
import { Host } from "./components/Host"
import { ReservationGuestDrawer } from "./components/ReservationGuestDrawer"
import { Roommates } from "./components/Roommates"

interface Props {
  setPageTitle: (title: string | null) => void
}

export const ReservationGuests = ({ setPageTitle }: Props) => {

  let { hash }: { hash: string } = useParams()

  const [ guest, setGuest ] = useState<ReservationGuest[]>()
  const [ roommates, setRoommates ] = useState<ReservationGuest[]>()
  const [ selectedGuest, setSelectedGuest ] = useState<ReservationGuest>()
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ showError, setShowError ] = useState<boolean>(false)

  const { loading: dataLoading, data } = useQuery<ReservationGuestsData, ReservationGuestsVariables>(RESERVATION_GUESTS, {
    variables: { reservationHash: hash },
    onCompleted: () => {
      setPageTitle(pageTitles.reservation_guests_management)
      setShowError(false)
    },
    onError: () => {
      setPageTitle(null)
      setShowError(true)
    }
  })

  useEffect(() => {
    const roommateList: Guests_guests[] = []
    const guest = data?.reservationGuests?.guest
    const roommates = data?.reservationGuests?.roommates
    if (guest !== undefined && guest !== null) {
      setGuest([ guest ])
    }
    if (roommates !== undefined && roommates !== null) {
      roommates.forEach((roommate: ReservationGuests_reservationGuests_roommates | null) => {
        if (roommate !== null) {
          roommateList.push(roommate)
        }
      })
      setRoommates(roommateList)
    }
  }, [ data ])

  return (
    <>
      <Spin
        spinning={ dataLoading }>
        <Host
          guest={ guest }
          loading={ dataLoading }
          openDrawer={ (reservationGuest: ReservationGuest) => {
            setSelectedGuest(reservationGuest)
            setDrawerVisible(true)
          } } />
        <Roommates
          loading={ dataLoading }
          openDrawer={ (roommate: ReservationGuest) => {
            setSelectedGuest(roommate)
            setDrawerVisible(true)
          } }
          roommates={ roommates } />
        <Error show={ showError } />
      </Spin>
      <ReservationGuestDrawer
        close={ () => setDrawerVisible(false) }
        guest={ selectedGuest }
        reservationHash={ hash }
        visible={ drawerVisible } />
    </>
  )
}