import { useState } from "react"
import { withRouter } from "react-router-dom"
import { Button, Col, Input, List, message, Row, Skeleton, Tooltip } from "antd"
import { GUESTS } from "../../lib/graphql/queries/Guests"
import { Guests as GuestsData, Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { UserAddOutlined } from "@ant-design/icons"
import { ApolloError, useQuery } from "@apollo/client"
import { useEffect } from "react"
import { GuestDrawer } from "./components/GuestDrawer"
import "./styles.css"
import { GuestItem } from "./components/GuestItem"
import { useTranslation } from "react-i18next"
import Text from "antd/lib/typography/Text"
import { guestDrawerOpen, pageTitle, selectedGuest, selectedPage } from "../../cache"

export const Guests = withRouter(() => {

  const { t } = useTranslation()

  const [ filteredGuests, setFilteredGuests ] = useState<Guests_guests[]>([])
  const [ guests, setGuests ] = useState<Guests_guests[]>([])

  const { data, loading, refetch } = useQuery<GuestsData>(GUESTS, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const sortGuests = (guestA: Guests_guests, guestB: Guests_guests) => {
    return (guestA.name).localeCompare(guestB.name)
  }

  const onSearch = (value: string) => {
    if (value.length < 1) {
      setFilteredGuests(guests)
    } else {
      const foundGuests = guests.filter(guest => {
        return guest.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
          || guest.surname.toLowerCase().indexOf(value.toLowerCase()) !== -1
          || (guest.email !== null && guest.email.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      })
      setFilteredGuests(foundGuests)
    }
  }

  useEffect(() => {
    const guestsList: Guests_guests[] = []
    if (data !== undefined && data?.guests !== null) {
      data.guests.forEach((guest: Guests_guests | null) => {
        if (guest !== null) {
          guestsList.push(guest)
        }
      })
      setGuests(guestsList)
      setFilteredGuests(guestsList.sort(sortGuests))
    }
  }, [ data ])

  useEffect(() => {
    pageTitle(t("guests.page-title"))
    selectedPage("guests")
  }, [ t ])

  return (
    <>
      <Skeleton
        active
        loading={ loading }
        paragraph={ { rows: 5 } }>
        <List
          bordered={ true }
          className="guests"
          dataSource={ filteredGuests }
          footer={
            <Text disabled>&reg;{ t("company-name") }</Text>
          }
          header={ (
            <Row>
              <Col lg={ 10 } md={ 12 } sm={ 14 } xs={ 16 }>
                <Input.Search
                  allowClear
                  enterButton
                  onSearch={ onSearch }
                  placeholder={ t("guests.search") } />
              </Col>
              <Col lg={ 12 } md={ 9 } sm={ 5 } xs={ 4 } />
              <Col lg={ 2 } md={ 3 } sm={ 5 } xs={ 4 }>
                <Tooltip title={ t("guests.add") }>
                  <Button
                    block
                    onClick={ () => {
                      selectedGuest(null)
                      guestDrawerOpen(true)
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
              refetch={ refetch } />
          ) } />
      </Skeleton>
      <GuestDrawer refetch={ refetch } />
    </>
  )
})