import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { Button, List } from "antd"
import { Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { PlusCircleOutlined } from "@ant-design/icons"
import { ApolloError } from "@apollo/client"
import { useEffect } from "react"
import { GuestDrawer } from "../GuestDrawer"
import "./styles.css"
import { GuestItem } from "./components/GuestItem"
import { Whoami_whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"
import { User } from "../../lib/Types"
import { HomePage_guests } from "../../lib/graphql/queries/App/__generated__/HomePage"

interface Props {
  guestsData?: (HomePage_guests | null)[] | null
  reauthenticate: (callback: () => void, errorHandler?: (reason: ApolloError) => void) => void
  setPageTitle: (title: string) => void
  setUser: (user: Whoami_whoami | undefined) => void
  user?: User
}

export const Guests = withRouter(({
  guestsData,
  reauthenticate,
  setPageTitle
}: RouteComponentProps & Props) => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ guests, setGuests ] = useState<(Guests_guests)[]>([])
  const [ selectedGuest, setSelectedGuest ] = useState<Guests_guests | null>(null)

  useEffect(() => {
    setPageTitle("Hosté")
  }, [ setPageTitle ])

  useEffect(() => {
    const guestsList: Guests_guests[] = []
    guestsData?.forEach((guest: HomePage_guests | null) => {
      if (guest !== null) {
        guestsList.push(guest)
      }
    })
    setGuests(guestsList)
  }, [ guestsData ])

  const addGuest = (guest: Guests_guests) => setGuests(guests.concat(guest))

  const updateGuestState = (guest: Guests_guests) => {
    setGuests(
      Array.from(guests, (cachedGuest: Guests_guests) => {
        if (cachedGuest.id === guest.id) {
          return guest
        }
        return cachedGuest
      })
    )
  }

  const removeGuest = (guest: Guests_guests) =>
    setGuests(guests.filter(cachedGuest => cachedGuest.id !== guest.id))

  return (
    <>
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
      <GuestDrawer
        addGuest={ addGuest }
        close={ () => setDrawerVisible(false) }
        guest={ selectedGuest }
        reauthenticate={ reauthenticate }
        removeGuest={ removeGuest }
        updateGuestCache={ updateGuestState }
        visible={ drawerVisible } />
    </>
  )
})