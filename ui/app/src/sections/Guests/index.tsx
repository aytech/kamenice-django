import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { Button, List, Skeleton } from "antd"
import { GUESTS } from "../../lib/graphql/queries/Guests"
import { Guests as GuestsData, Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { PlusCircleOutlined } from "@ant-design/icons"
import { useQuery } from "@apollo/client"
import { useEffect } from "react"
import { GuestDrawer } from "../GuestDrawer"
import "./styles.css"
import { GuestItem } from "./components/GuestItem"
import { pageTitles } from "../../lib/Constants"

interface Props {
  setPageTitle: (title: string) => void
}

export const Guests = withRouter(({
  setPageTitle
}: RouteComponentProps & Props) => {

  const [ dataLoading, setDataLoading ] = useState<boolean>(true)
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ guests, setGuests ] = useState<Guests_guests[]>([])
  const [ selectedGuest, setSelectedGuest ] = useState<Guests_guests | null>(null)

  const { data: guestsData } = useQuery<GuestsData>(GUESTS, {
    onCompleted: () => {
      setDataLoading(false)
      setPageTitle(pageTitles.guests)
    }
  })

  useEffect(() => {
    const guestsList: Guests_guests[] = []
    if (guestsData !== undefined && guestsData?.guests !== null) {
      guestsData.guests.forEach((guest: Guests_guests | null) => {
        if (guest !== null) {
          guestsList.push(guest)
        }
      })
      setGuests(guestsList)
    }
  }, [ guestsData ])

  const addOrRemoveGuest = (guest: Guests_guests) => {
    const existingGuests = guests.filter(cachedGuest => cachedGuest.id !== guest.id)
    setGuests(existingGuests.concat(guest))
  }

  const removeGuest = (guestId: string) =>
    setGuests(guests.filter(cachedGuest => cachedGuest.id !== guestId))

  return (
    <>
      <Skeleton
        active
        loading={ dataLoading }
        paragraph={ { rows: 5 } }>
        <List
          bordered={ true }
          className="guests-list"
          dataSource={ guests }
          footer={
            <Button
              icon={ <PlusCircleOutlined /> }
              onClick={ () => {
                setSelectedGuest(null)
                setDrawerVisible(true)
              } }
              type="primary">
              Přidat hosta
            </Button>
          }
          header={ <h4>Seznam hostů</h4> }
          itemLayout="horizontal"
          renderItem={ (guest: Guests_guests) => (
            <GuestItem
              guest={ guest }
              openGuestDrawer={ () => setDrawerVisible(true) }
              selectGuest={ setSelectedGuest } />
          ) } />
      </Skeleton>
      <GuestDrawer
        addGuest={ addOrRemoveGuest }
        close={ () => setDrawerVisible(false) }
        guest={ selectedGuest }
        removeGuest={ removeGuest }
        visible={ drawerVisible } />
    </>
  )
})