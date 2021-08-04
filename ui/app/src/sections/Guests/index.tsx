import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { Button, List } from "antd"
import { GuestsFull as GuestsData, GuestsFull_guests } from "../../lib/graphql/queries/Guests/__generated__/GuestsFull"
import { PlusCircleOutlined } from "@ant-design/icons"
import { useLazyQuery, useMutation } from "@apollo/client"
import { GUESTS_FULL } from "../../lib/graphql/queries/Guests"
import { useEffect } from "react"
import { GuestDrawer } from "../GuestDrawer"
import { DELETE_GUEST } from "../../lib/graphql/mutations/Guest"
import { DeleteGuest, DeleteGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/DeleteGuest"
import "./styles.css"
import { GuestItem } from "./components/GuestItem"
import { Whoami_whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"
import { User } from "../../lib/Types"

interface Props {
  reauthenticate: (callback: () => void) => void
  setPageTitle: (title: string) => void
  setUser: (user: Whoami_whoami | undefined) => void
  user: User | undefined
}

export const Guests = withRouter(({
  history,
  reauthenticate,
  setPageTitle,
  user
}: RouteComponentProps & Props) => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ guests, setGuests ] = useState<GuestsFull_guests[]>([])
  const [ selectedGuest, setSelectedGuest ] = useState<GuestsFull_guests | null>(null)

  const [ getData, { loading: queryLoading, data: queryData, refetch } ] = useLazyQuery<GuestsData>(GUESTS_FULL)
  const [ deleteGuest, { loading: deleteLoading, data: deleteData } ] = useMutation<DeleteGuest, DeleteGuestVariables>(DELETE_GUEST)

  useEffect(() => {
    setPageTitle("Hosté")
    getData()
  }, [ getData, history, setPageTitle ])

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
      refetch().catch(() => reauthenticate(refetch))
    }
  }, [ reauthenticate, refetch ])

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
        loading={ queryLoading || deleteLoading }
        renderItem={ (guest: GuestsFull_guests) => (
          <GuestItem
            deleteGuest={ (id: string) => deleteGuest({ variables: { guestId: id } }) }
            guest={ guest }
            loading={ deleteLoading }
            openGuestDrawer={ () => setDrawerVisible(true) }
            selectGuest={ setSelectedGuest } />
        ) } />
      <GuestDrawer
        close={ () => setDrawerVisible(false) }
        guest={ selectedGuest }
        refetch={ refetch }
        visible={ drawerVisible } />
    </>
  )
})