import { useQuery } from "@apollo/client"
import { Spin } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { RESERVATION_GUESTS } from "../../lib/graphql/queries/ReservationGuests"
import { ReservationGuests as ReservationGuestsData, ReservationGuestsVariables } from "../../lib/graphql/queries/ReservationGuests/__generated__/ReservationGuests"
import { Error } from "./components/Error"
import { Guest } from "./components/Guest"
import { ReservationGuestDrawer } from "./components/Drawer"
import { Roommates } from "./components/Roommates"
import { pageTitle, selectedGuest, selectedSuite } from "../../cache"
import { Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"

export const ReservationGuests = () => {

  let { hash }: { hash: string } = useParams()

  const { t } = useTranslation()

  const [ roommates, setRoommates ] = useState<Guests_guests[]>([])
  const [ guestDrawerVisible, setGuestDrawerVisible ] = useState<boolean>(false)
  const [ showError, setShowError ] = useState<boolean>(false)

  const { loading, data, refetch } = useQuery<ReservationGuestsData, ReservationGuestsVariables>(RESERVATION_GUESTS, {
    variables: { reservationHash: hash },
    onCompleted: () => {
      // Set page title only on successful fetch, otherwise error element will be shown
      pageTitle(t("guests.page-title"))
    },
    onError: () => {
      pageTitle("")
      setShowError(true)
    }
  })

  useEffect(() => {
    const roommateList: Guests_guests[] = []
    const suite = data?.reservationGuests?.suite
    data?.reservationGuests?.roommates?.forEach(roommate => {
      if (roommate !== null) {
        roommateList.push(roommate)
      }
    })
    setRoommates(roommateList)
    if (suite !== undefined && suite !== null) {
      selectedSuite(suite as Suites_suites)
    }
  }, [ data ])

  return (
    <>
      <Spin
        spinning={ loading }>
        <Guest
          guest={ data?.reservationGuests?.guest }
          loading={ loading }
          openDrawer={ (reservationGuest: Guests_guests) => {
            selectedGuest(reservationGuest)
            setGuestDrawerVisible(true)
          } } />
        <Roommates
          hash={ hash }
          loading={ loading }
          openDrawer={ (roommate: Guests_guests | null) => {
            selectedGuest(roommate)
            setGuestDrawerVisible(true)
          } }
          refetch={ refetch }
          roommates={ roommates } />
        <Error show={ showError } />
      </Spin>
      <ReservationGuestDrawer
        close={ () => setGuestDrawerVisible(false) }
        refetch={ refetch }
        reservationHash={ hash }
        visible={ guestDrawerVisible } />
    </>
  )
}