import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { Button, List, message, Skeleton } from "antd"
import { GUESTS } from "../../lib/graphql/queries/Guests"
import { Guests as GuestsData, Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { PlusCircleOutlined } from "@ant-design/icons"
import { ApolloError, useQuery } from "@apollo/client"
import { useEffect } from "react"
import { GuestDrawer } from "../GuestDrawer"
import "./styles.css"
import { GuestItem } from "./components/GuestItem"
import { useTranslation } from "react-i18next"
import { MenuItemKey } from "../../lib/Types"

interface Props {
  setPageTitle: (title: string) => void
  setSelectedPage: (page: MenuItemKey) => void
}

export const Guests = withRouter(({
  setPageTitle,
  setSelectedPage
}: RouteComponentProps & Props) => {

  const { t } = useTranslation()

  const [ dataLoading, setDataLoading ] = useState<boolean>(true)
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ guests, setGuests ] = useState<Guests_guests[]>([])
  const [ selectedGuest, setSelectedGuest ] = useState<Guests_guests | null>(null)

  const { data: guestsData } = useQuery<GuestsData>(GUESTS, {
    onCompleted: () => {
      setDataLoading(false)
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const addOrRemoveGuest = (guest: Guests_guests) => {
    const existingGuests = guests.filter(cachedGuest => cachedGuest.id !== guest.id)
    setGuests(existingGuests.concat(guest))
  }

  const removeGuest = (guestId: string) =>
    setGuests(guests.filter(cachedGuest => cachedGuest.id !== guestId))

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

  useEffect(() => {
    setPageTitle(t("guests.page-title"))
    setSelectedPage("guests")
  }, [ setPageTitle, setSelectedPage, t ])

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
              { t("guests.add") }
            </Button>
          }
          header={ <h4>{ t("guests.list") }</h4> }
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