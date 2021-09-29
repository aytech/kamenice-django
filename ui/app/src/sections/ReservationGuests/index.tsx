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

interface Props {
  setPageTitle: (title: string | null) => void
}

export const ReservationGuests = ({ setPageTitle }: Props) => {

  let { hash }: { hash: string } = useParams()

  const { t } = useTranslation()

  const [ roommates, setRoommates ] = useState<Guests_guests[]>([])
  const [ selectedGuest, setSelectedGuest ] = useState<Guests_guests>()
  const [ guestDrawerVisible, setGuestDrawerVisible ] = useState<boolean>(false)
  const [ showError, setShowError ] = useState<boolean>(false)

  const { loading, data, refetch } = useQuery<ReservationGuestsData, ReservationGuestsVariables>(RESERVATION_GUESTS, {
    variables: { reservationHash: hash },
    onCompleted: () => setPageTitle(t("guests.page-title")), // Set page title only on successful fetch, otherwise error element will be shown
    onError: () => {
      setPageTitle(null)
      setShowError(true)
    }
  })

  useEffect(() => {
    const roommateList: Guests_guests[] = []
    data?.reservationGuests?.roommates?.forEach(roommate => {
      if (roommate !== null) {
        roommateList.push(roommate)
      }
    })
    setRoommates(roommateList)
  }, [ data ])

  return (
    <>
      <Spin
        spinning={ loading }>
        <Guest
          guest={ data?.reservationGuests?.guest }
          loading={ loading }
          openDrawer={ (reservationGuest: Guests_guests) => {
            setSelectedGuest(reservationGuest)
            setGuestDrawerVisible(true)
          } } />
        <Roommates
          hash={ hash }
          loading={ loading }
          openDrawer={ (roommate?: Guests_guests) => {
            setSelectedGuest(roommate)
            setGuestDrawerVisible(true)
          } }
          refetch={ refetch }
          roommates={ roommates } />
        <Error show={ showError } />
      </Spin>
      <ReservationGuestDrawer
        close={ () => setGuestDrawerVisible(false) }
        guest={ selectedGuest }
        reservationHash={ hash }
        visible={ guestDrawerVisible } />
    </>
  )
}