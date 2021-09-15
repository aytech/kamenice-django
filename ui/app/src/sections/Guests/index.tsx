import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { Button, Col, List, message, Row, Skeleton, Tooltip } from "antd"
import { GUESTS } from "../../lib/graphql/queries/Guests"
import { Guests as GuestsData, Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { UserAddOutlined } from "@ant-design/icons"
import { ApolloError, useQuery } from "@apollo/client"
import { useEffect } from "react"
import { GuestDrawer } from "../GuestDrawer"
import "./styles.css"
import { GuestItem } from "./components/GuestItem"
import { useTranslation } from "react-i18next"
import { MenuItemKey } from "../../lib/Types"
import Text from "antd/lib/typography/Text"

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
          className="guests"
          dataSource={ guests }
          footer={
            <Text disabled>&reg;{t("company-name")}</Text>
          }
          header={ (
            <Row>
              <Col lg={ 23 } md={ 22 } sm={ 20 } xs={ 20 }>
                <h2>{ t("guests.list") }</h2>
              </Col>
              <Col lg={ 1 } md={ 2 } sm={ 4 } xs={ 4 }>
                <Tooltip title={ t("guests.add") }>
                  <Button
                    onClick={ () => {
                      setSelectedGuest(null)
                      setDrawerVisible(true)
                    } }>
                    <UserAddOutlined />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          ) }
          itemLayout="horizontal"
          renderItem={ (guest: Guests_guests) => (
            <GuestItem
              guest={ guest }
              openGuestDrawer={ () => setDrawerVisible(true) }
              roommates={ guests }
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