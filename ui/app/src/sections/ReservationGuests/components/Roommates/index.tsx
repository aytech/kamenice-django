import { Avatar, Button, List } from "antd"
import { Colors } from "../../../../lib/components/Colors"
import { ReservationGuest } from "../../../../lib/Types"

interface Props {
  loading: boolean
  openDrawer: (guest: ReservationGuest) => void
  roommates?: ReservationGuest[]
}

export const Roommates = ({
  loading,
  openDrawer,
  roommates
}: Props) => {
  return roommates === undefined || roommates.length === 0 ? null : (
    <List
      bordered={ true }
      className="guests-list"
      dataSource={ roommates }
      header={ <h4>Spolubydlící</h4> }
      itemLayout="horizontal"
      renderItem={ (roommate: ReservationGuest) => (
        <List.Item
          key={ roommate.id }
          actions={
            loading ? [] : [
              <Button
                key="edit"
                onClick={ () => {
                  openDrawer(roommate)
                  // setSelectedGuest(roommate)
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
                { roommate.name.substring(0, 1).toUpperCase() }
              </Avatar>
            }
            description={ roommate.email }
            title={ `${ roommate.name } ${ roommate.surname }` } />
        </List.Item>
      ) } />
  )
}