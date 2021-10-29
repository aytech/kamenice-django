import { useCallback, useState } from "react"
import { withRouter } from "react-router-dom"
import { Button, Col, Input, List, message, Pagination, Row, Skeleton, Tooltip } from "antd"
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

  const defaultPageSize = 10 // TODO: Fetch from settings
  const [ currentPage, setCurrentPage ] = useState<number>(1)
  const [ filteredGuests, setFilteredGuests ] = useState<Guests_guests[]>([])
  const [ totalGuests, setTotalGuests ] = useState<number>(0)
  const [ guests, setGuests ] = useState<Guests_guests[]>([])

  const { data, loading, refetch } = useQuery<GuestsData>(GUESTS, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const sortGuests = (guestA: Guests_guests, guestB: Guests_guests) => {
    return (guestA.name).localeCompare(guestB.name)
  }

  const onPageChange = (page: number) => {
    const startIndex = (page - 1) * defaultPageSize
    setFilteredGuests(guests.slice(startIndex, page * defaultPageSize))
    setCurrentPage(page)
  }

  const onSearch = (value: string) => {
    if (value.length < 1) {
      setTotalGuests(guests.length)
      onPageChange(currentPage)
    } else {
      const foundGuests = guests.filter(guest => {
        return guest.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
          || guest.surname.toLowerCase().indexOf(value.toLowerCase()) !== -1
          || (guest.email !== null && guest.email.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      })
      setFilteredGuests(foundGuests)
      setTotalGuests(foundGuests.length)
    }
    setCurrentPage(1)
  }

  const updateGuestList = useCallback((guestsList) => {
    let startIndex = (currentPage - 1) * defaultPageSize
    let newGuestList = guestsList.sort(sortGuests).slice(startIndex, currentPage * defaultPageSize)
    // If user is not on first page and list subset is empty, switch to previous page
    if (newGuestList.length < 1 && currentPage > 1) {
      startIndex = (currentPage - 2) * defaultPageSize
      newGuestList = guestsList.sort(sortGuests).slice(startIndex, currentPage * defaultPageSize)
      setCurrentPage(currentPage - 1)
    }
    setFilteredGuests(newGuestList)
  }, [ currentPage ])

  useEffect(() => {
    const guestsList: Guests_guests[] = []
    if (data !== undefined && data?.guests !== null) {
      data.guests.forEach((guest: Guests_guests | null) => {
        if (guest !== null) {
          guestsList.push(guest)
        }
      })
      setGuests(guestsList)
      setTotalGuests(guestsList.length)
      updateGuestList(guestsList)
    }
  }, [ data, updateGuestList ])

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
            <Row>
              <Col lg={ 5 } md={ 5 } sm={ 7 } xs={ 0 }></Col>
              <Col
                className="pagination"
                lg={ 14 } md={ 14 } sm={ 10 } xs={ 12 }>
                <Pagination
                  current={ currentPage }
                  onChange={ onPageChange }
                  pageSize={ defaultPageSize }
                  total={ totalGuests } />
              </Col>
              <Col lg={ 5 } md={ 5 } sm={ 7 } xs={ 12 }>
                <Text disabled>&reg;{ t("company-name") }</Text>
              </Col>
            </Row>
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