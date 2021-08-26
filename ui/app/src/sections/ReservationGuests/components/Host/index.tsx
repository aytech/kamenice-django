import { Avatar, Button, List } from "antd"
import { Colors } from "../../../../lib/components/Colors"
import { ReservationGuest } from "../../../../lib/Types"

interface Props {
  guest?: ReservationGuest[]
  loading: boolean
  openDrawer: (guest: ReservationGuest) => void
}

export const Host = ({
  guest,
  loading,
  openDrawer
}: Props) => {
  return guest === undefined ? null : (
    <List
      bordered={ true }
      className="guests-list"
      dataSource={ guest }
      header={ <h4>Host</h4> }
      itemLayout="horizontal"
      renderItem={ (guest: ReservationGuest) => (
        <List.Item
          key={ guest.id }
          actions={
            loading ? [] : [
              <Button
                key="edit"
                onClick={ () => {
                  openDrawer(guest)
                  // setSelectedGuest(guest)
                  // setDrawerVisible(true)
                } }
                type="link">
                upravit
              </Button>,
            ]
          }>
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
      ) } />
  )
}