import { Avatar, Button, List } from "antd"
import { Colors } from "../../../lib/components/Colors"
import { Guests_guests } from "../../../lib/graphql/queries/Guests/__generated__/Guests"

interface Props {
  guest: Guests_guests
  openGuestDrawer: () => void
  selectGuest: (guest: Guests_guests) => void
}

export const GuestItem = ({
  guest,
  openGuestDrawer,
  selectGuest
}: Props) => {
  return (
    <List.Item
      actions={ [
        <Button
          key="edit"
          onClick={ () => {
            selectGuest(guest)
            openGuestDrawer()
          } }
          type="link">
          upravit
        </Button>,
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
  )
}