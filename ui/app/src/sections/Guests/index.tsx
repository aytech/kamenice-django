import { useCallback, useState } from "react"
import { Button, Col, Input, List, message, Pagination, Row, Skeleton, Tooltip } from "antd"
import { UserAddOutlined } from "@ant-design/icons"
import { ApolloError, useQuery } from "@apollo/client"
import { useEffect } from "react"
import { GuestDrawer } from "./components/GuestDrawer"
import "./styles.css"
import { GuestItem } from "./components/GuestItem"
import { useTranslation } from "react-i18next"
import Text from "antd/lib/typography/Text"
import { guestDrawerOpen, pageTitle, selectedGuest, selectedPage } from "../../cache"
import { PagerHelper } from "../../lib/components/PagerHelper"
import { IGuest } from "../../lib/Types"
import { GuestsDocument, GuestsQuery } from "../../lib/graphql/graphql"

export const Guests = () => {

  const { t } = useTranslation()

  const [ currentPage, setCurrentPage ] = useState<number>(1)
  const [ filteredGuests, setFilteredGuests ] = useState<IGuest[]>([])
  const [ totalGuests, setTotalGuests ] = useState<number>(0)
  const [ guests, setGuests ] = useState<IGuest[]>([])

  const { data, loading, refetch } = useQuery<GuestsQuery>(GuestsDocument, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const onPageChange = (page: number) => {
    PagerHelper.onPageChange(guests, page, (slice: IGuest[]) => {
      setFilteredGuests(slice)
      setCurrentPage(page)
    })
  }

  const onSearch = (value: string) => {
    if (value.length < 1) {
      setTotalGuests(guests.length)
      onPageChange(currentPage)
    } else {
      const foundGuests = guests.filter(guest => {
        return guest.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
          || guest.surname.toLowerCase().indexOf(value.toLowerCase()) !== -1
          || (guest.email !== null && guest.email?.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      })
      setFilteredGuests(foundGuests)
      setTotalGuests(foundGuests.length)
    }
    setCurrentPage(1)
  }

  const updateGuestList = useCallback((guestsList) => {
    PagerHelper.getPageSlice(guestsList, currentPage, (data: IGuest[], page: number) => {
      if (page > 0) {
        setCurrentPage(page)
      }
      setFilteredGuests(data)
    })
  }, [ currentPage ])

  useEffect(() => {
    const guestsList: IGuest[] = []
    if (data !== undefined && data?.guests !== null) {
      data.guests?.forEach((guest: IGuest | null) => {
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
                  pageSize={ PagerHelper.defaultPageSize }
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
                  id="search-guest"
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
          renderItem={ (guest: IGuest) => (
            <GuestItem
              guest={ guest }
              refetch={ refetch } />
          ) } />
      </Skeleton>
      <GuestDrawer refetch={ refetch } />
    </>
  )
}