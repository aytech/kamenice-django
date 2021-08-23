import { Avatar, Button, List } from "antd"
import { Colors } from "../../../lib/components/Colors"
import { Guest_guest } from "../../../lib/graphql/queries/Guest/__generated__/Guest"

interface Props {
  guest: Guest_guest
  openGuestDrawer: () => void
  selectGuest: (guest: Guest_guest) => void
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