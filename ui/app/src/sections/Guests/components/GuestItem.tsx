import { WarningOutlined } from "@ant-design/icons"
import { Avatar, Button, List, Popconfirm } from "antd"
import { Colors } from "../../../lib/components/Colors"
import { GuestsFull_guests } from "../../../lib/graphql/queries/Guests/__generated__/GuestsFull"

interface Props {
  deleteGuest: (id: string) => void
  guest: GuestsFull_guests
  loading: boolean
  openGuestDrawer: () => void
  selectGuest: (guest: GuestsFull_guests) => void
}

export const GuestItem = ({
  deleteGuest,
  guest,
  loading,
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
        <Popconfirm
          cancelText="Ne"
          icon={ <WarningOutlined /> }
          okText="Ano"
          onConfirm={ () => deleteGuest(guest.id) }
          title="opravdu odstranit?">
          <Button
            key="remove"
            loading={ loading }
            type="link">
            odstranit
          </Button>
        </Popconfirm>
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