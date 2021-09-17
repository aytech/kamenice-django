import { EditOutlined } from "@ant-design/icons"
import { Avatar, Button, List } from "antd"
import { useTranslation } from "react-i18next"
import { Colors } from "../../../../lib/components/Colors"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { Roommates_roommates } from "../../../../lib/graphql/queries/Roommates/__generated__/Roommates"
import { GuestsListHeader } from "../../../Guests/components/GuestsListHeader"

interface Props {
  guest?: Guests_guests | null
  loading: boolean
  openDrawer: (roommate?: Roommates_roommates) => void
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
        header={
          <GuestsListHeader
            action={ () => openDrawer(undefined) }
            title={ `${ guest.name } ${ guest.surname } - ${ t("guests.roommates") }` } />
        }
        itemLayout="horizontal"
        renderItem={ (roommate: Roommates_roommates) => (
          <List.Item
            key={ roommate.id }
            actions={
              loading ? [] : [
                <Button
                  key="edit"
                  icon={ <EditOutlined /> }
                  onClick={ () => {
                    openDrawer(roommate)
                  } }>
                  { t("edit") }
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
              description={
                roommate.age === undefined
                  || roommate.age === null ? null : t(`enums.${ roommate.age }`) }
              title={ `${ roommate.name } ${ roommate.surname }` } />
          </List.Item>
        ) } />
    </>
  )
}