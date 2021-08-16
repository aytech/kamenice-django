import { Avatar, Button, List } from "antd"
import { Colors } from "../../../lib/components/Colors"
import { GuestsFull_guests } from "../../../lib/graphql/queries/Guests/__generated__/GuestsFull"

interface Props {
  guest: GuestsFull_guests
  openGuestDrawer: () => void
  selectGuest: (guest: GuestsFull_guests) => void
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