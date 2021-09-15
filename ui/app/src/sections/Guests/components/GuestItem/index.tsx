import { Avatar, Button, List } from "antd"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Colors } from "../../../../lib/components/Colors"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { Roommates } from "../Roommates"

interface Props {
  guest: Guests_guests
  openGuestDrawer: () => void
  openRoommateDrawer: () => void
  roommates: Guests_guests[]
  selectGuest: (guest: Guests_guests) => void
}

export const GuestItem = ({
  guest,
  openGuestDrawer,
  openRoommateDrawer,
  roommates,
  selectGuest
}: Props) => {

  const { t } = useTranslation()

  const [ showRoommates, setShowRoommates ] = useState<boolean>(false)

  const toggleShowRoommates = () => setShowRoommates(!showRoommates)

  return (
    <>
      <List.Item
        actions={ [
          <Button
            key="edit"
            onClick={ () => {
              selectGuest(guest)
              openGuestDrawer()
            } }
            type="link">
            { t("edit") }
          </Button>,
          <Button
            key="roommates"
            onClick={ toggleShowRoommates }
            type="link">
            { t("guests.roommates") }
          </Button>
        ] }>
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
      </List.Item>
      <Roommates
        guest={ guest }
        openDrawer={ () => {
          selectGuest(guest)
          openRoommateDrawer()
        } }
        roommates={ roommates }
        show={ showRoommates } />
    </>
  )
}