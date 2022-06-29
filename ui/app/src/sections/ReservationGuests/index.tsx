import { useQuery } from "@apollo/client"
import { Spin } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { Error } from "./components/Error"
import { Guest } from "./components/Guest"
import { ReservationGuestDrawer } from "./components/Drawer"
import { Roommates } from "./components/Roommates"
import { pageTitle, selectedGuest, selectedSuite } from "../../cache"
import { IGuest, ISuite } from "../../lib/Types"
import { ReservationGuestsDocument, ReservationGuestsQuery, ReservationGuestsQueryVariables } from "../../lib/graphql/graphql"

export const ReservationGuests = () => {

  let { hash } = useParams()

  const { t } = useTranslation()

  const [ roommates, setRoommates ] = useState<IGuest[]>([])
  const [ guestDrawerVisible, setGuestDrawerVisible ] = useState<boolean>(false)
  const [ showError, setShowError ] = useState<boolean>(false)

  const { loading, data, refetch } = useQuery<ReservationGuestsQuery, ReservationGuestsQueryVariables>(ReservationGuestsDocument, {
    variables: { reservationHash: hash === undefined ? "" : hash },
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
    const roommateList: IGuest[] = []
    const suite = data?.reservationGuests?.suite
    data?.reservationGuests?.roommates?.forEach(roommate => {
      if (roommate !== null) {
        roommateList.push(roommate)
      }
    })
    setRoommates(roommateList)
    if (suite !== undefined && suite !== null) {
      selectedSuite(suite as ISuite)
    }
  }, [ data ])

  return (
    <>
      <Spin
        spinning={ loading }>
        <Guest
          guest={ data?.reservationGuests?.guest }
          loading={ loading }
          openDrawer={ (reservationGuest: IGuest) => {
            selectedGuest(reservationGuest)
            setGuestDrawerVisible(true)
          } } />
        <Roommates
          hash={ hash }
          loading={ loading }
          openDrawer={ (roommate: IGuest | null) => {
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
        reservationHash={ hash === undefined ? "" : hash }
        visible={ guestDrawerVisible } />
    </>
  )
}