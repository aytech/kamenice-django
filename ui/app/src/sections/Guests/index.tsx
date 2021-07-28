import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { Button, List, message, Popconfirm } from "antd"
import { Content } from "antd/lib/layout/layout"
import Title from "antd/lib/typography/Title"
import { GuestsFull as GuestsData, GuestsFull_guests } from "../../lib/graphql/queries/Guests/__generated__/GuestsFull"
import { PlusCircleOutlined, WarningOutlined } from "@ant-design/icons"
import { useLazyQuery, useMutation } from "@apollo/client"
import { GUESTS_FULL } from "../../lib/graphql/queries/Guests"
import { useEffect } from "react"
import { GuestDrawer } from "../GuestDrawer"
import { DELETE_GUEST } from "../../lib/graphql/mutations/Guest"
import { DeleteGuest, DeleteGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/DeleteGuest"

interface Props {
  isAuthenticated: boolean
}

export const Guests = withRouter(({ history, isAuthenticated }: RouteComponentProps & Props) => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ guests, setGuests ] = useState<GuestsFull_guests[]>([])
  const [ selectedGuest, setSelectedGuest ] = useState<GuestsFull_guests | null>(null)

  const [ getData, { loading: queryLoading, data: queryData, refetch } ] = useLazyQuery<GuestsData>(GUESTS_FULL, {
    onError: () => {
      message.error("Chyba serveru, kontaktujte správce")
    }
  })
  const [ deleteGuest, { loading: deleteLoading, data: deleteData } ] = useMutation<DeleteGuest, DeleteGuestVariables>(DELETE_GUEST, {
    onError: () => {
      message.error("Chyba serveru, kontaktujte správce")
    }
  })

  useEffect(() => {
    if (isAuthenticated === true) {
      getData()
    } else {
      history.push("/login")
    }
  }, [ getData, history, isAuthenticated ])

  useEffect(() => {
    const guestsData: GuestsFull_guests[] = []
    queryData?.guests?.forEach((guest: GuestsFull_guests | null) => {
      if (guest !== null) {
        guestsData.push(guest)
      }
    })
    setGuests(guestsData)
  }, [ queryData ])

  useEffect(() => {
    if (refetch !== undefined) {
      refetch()
    }
  }, [ refetch, deleteData ])

  return (
    <Content className="app-content">
      <Title level={ 3 } className="home__listings-title">
        Hosté
      </Title>
      <List
        className="suites-list"
        dataSource={ guests }
        itemLayout="horizontal"
        loading={ queryLoading }
        renderItem={ (guest: GuestsFull_guests) => (
          <List.Item
            actions={ [
              <Button
                key="edit"
                onClick={ () => {
                  setSelectedGuest(guest)
                  setDrawerVisible(true)
                } }
                type="link">
                upravit
              </Button>,
              <Popconfirm
                cancelText="Ne"
                icon={ <WarningOutlined /> }
                okText="Ano"
                onConfirm={ () => {
                  deleteGuest({ variables: { guestId: guest.id } })
                } }
                title="opravdu odstranit?">
                <Button
                  key="remove"
                  loading={ deleteLoading }
                  type="link">
                  odstranit
                </Button>
              </Popconfirm>
            ] }>
            <List.Item.Meta title={ `${ guest.name } ${ guest.surname }` } />
          </List.Item>
        ) } />
      <Button
        icon={ <PlusCircleOutlined /> }
        onClick={ () => {
          setSelectedGuest(null)
          setDrawerVisible(true)
        } }
        type="primary">
        Přidat hosta
      </Button>
      <GuestDrawer
        close={ () => setDrawerVisible(false) }
        guest={ selectedGuest }
        refetch={ refetch }
        visible={ drawerVisible } />
    </Content>
  )
})