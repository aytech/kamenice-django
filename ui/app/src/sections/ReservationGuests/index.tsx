import { useQuery } from "@apollo/client"
import { Avatar, Button, List, Skeleton } from "antd"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Colors } from "../../lib/components/Colors"
import { pageTitles } from "../../lib/Constants"
import { Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { RESERVATION_GUESTS } from "../../lib/graphql/queries/ReservationGuests"
import { ReservationGuests as ReservationGuestsData, ReservationGuestsVariables, ReservationGuests_reservationGuests_roommates } from "../../lib/graphql/queries/ReservationGuests/__generated__/ReservationGuests"
import { ReservationGuest } from "../../lib/Types"
import { ReservationGuestDrawer } from "./components/ReservationGuestDrawer"

interface Props {
  setPageTitle: (title: string) => void
}

export const ReservationGuests = ({ setPageTitle }: Props) => {

  let { hash }: { hash: string } = useParams()

  const [ dataLoading, setDataLoading ] = useState<boolean>(true)
  const [ guest, setGuest ] = useState<ReservationGuest[]>([ { id: 0, name: "A" } ])
  const [ roommates, setRoommates ] = useState<ReservationGuest[]>([ { id: 0, name: "A" }, { id: 1, name: "B" }, { id: 2, name: "C" } ])
  const [ selectedGuest, setSelectedGuest ] = useState<ReservationGuest>()
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)

  const { data } = useQuery<ReservationGuestsData, ReservationGuestsVariables>(RESERVATION_GUESTS, {
    variables: { reservationHash: hash },
    onCompleted: () => {
      setPageTitle(pageTitles.reservation_guests_management)
      setDataLoading(false)
    }
  })

  useEffect(() => {
    const roommateList: Guests_guests[] = []
    const guest = data?.reservationGuests?.guest
    if (guest !== undefined && guest !== null) {
      setGuest([ guest ])
    }
    data?.reservationGuests?.roommates?.forEach((roommate: ReservationGuests_reservationGuests_roommates | null) => {
      if (roommate !== null) {
        roommateList.push(roommate)
      }
    })
    setRoommates(roommateList)
  }, [ data ])

  return (
    <>
      <List
        bordered={ true }
        className="guests-list"
        dataSource={ guest }
        header={ <h4>Host</h4> }
        itemLayout="horizontal"
        renderItem={ (guest: ReservationGuest) => (
          <List.Item
            key={ guest.id }
            actions={
              dataLoading ? [] : [
                <Button
                  key="edit"
                  onClick={ () => {
                    setSelectedGuest(guest)
                    setDrawerVisible(true)
                  } }
                  type="link">
                  upravit
                </Button>,
              ]
            }>
            <Skeleton loading={ dataLoading } active avatar>
              <List.Item.Meta
                avatar={
                  <Avatar
                    gap={ 4 }
                    size="large"
                    style={ {
                      backgroundColor: Colors.getRandomColor()
                    } }>
                    { guest.name.substring(0, 1).toUpperCase() }
                  </Avatar>
                }
                description={ guest.email }
                title={ `${ guest.name } ${ guest.surname }` } />
            </Skeleton>
          </List.Item>
        ) } />
      <List
        bordered={ true }
        className="guests-list"
        dataSource={ roommates }
        header={ <h4>Spolubydlící</h4> }
        itemLayout="horizontal"
        renderItem={ (roommate: ReservationGuest) => (
          <List.Item
            key={ roommate.id }
            actions={
              dataLoading ? [] : [
                <Button
                  key="edit"
                  onClick={ () => {
                    setSelectedGuest(roommate)
                    setDrawerVisible(true)
                  } }
                  type="link">
                  upravit
                </Button>,
              ]
            }>
            <Skeleton loading={ dataLoading } active avatar>
              <List.Item.Meta
                avatar={
                  <Avatar
                    gap={ 4 }
                    size="large"
                    style={ {
                      backgroundColor: Colors.getRandomColor()
                    } }>
                    { roommate.name.substring(0, 1).toUpperCase() }
                  </Avatar>
                }
                description={ roommate.email }
                title={ `${ roommate.name } ${ roommate.surname }` } />
            </Skeleton>
          </List.Item>
        ) } />
      <ReservationGuestDrawer
        close={ () => setDrawerVisible(false) }
        guest={ selectedGuest }
        visible={ drawerVisible } />
    </>
  )
}