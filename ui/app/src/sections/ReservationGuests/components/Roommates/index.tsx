import { Avatar, Button, List } from "antd"
import { useTranslation } from "react-i18next"
import { Colors } from "../../../../lib/components/Colors"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { Roommates_roommates } from "../../../../lib/graphql/queries/Roommates/__generated__/Roommates"

interface Props {
  guest?: Guests_guests | null
  loading: boolean
  openDrawer: (roommate: Roommates_roommates) => void
  roommates?: Roommates_roommates[]
}

export const Roommates = ({
  guest,
  loading,
  openDrawer,
  roommates
}: Props) => {

  const { t } = useTranslation()

  return guest === undefined
    || guest === null
    || roommates === undefined ? null : (
    <>
      <List
        bordered={ true }
        className="guests"
        dataSource={ roommates }
        header={ <h4>{ t("guests.roommates") }</h4> }
        itemLayout="horizontal"
        renderItem={ (roommate: Roommates_roommates) => (
          <List.Item
            key={ roommate.id }
            actions={
              loading ? [] : [
                <Button
                  key="edit"
                  onClick={ () => {
                    openDrawer(roommate)
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
              description={ roommate.age === undefined ? null : t(`enums.${ roommate.age }`) }
              title={ `${ roommate.name } ${ roommate.surname }` } />
          </List.Item>
        ) } />

    </>
  )
}