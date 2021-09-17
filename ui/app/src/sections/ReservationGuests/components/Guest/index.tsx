import { EditOutlined } from "@ant-design/icons"
import { Avatar, Button, List } from "antd"
import { useTranslation } from "react-i18next"
import { Colors } from "../../../../lib/components/Colors"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"

interface Props {
  guest?: Guests_guests | null
  loading: boolean
  openDrawer: (guest: Guests_guests) => void
}

export const Guest = ({
  guest,
  loading,
  openDrawer
}: Props) => {

  const { t } = useTranslation()

  return guest === undefined
    || guest === null ? null : (
    <List
      bordered={ true }
      className="guests"
      dataSource={ [ guest ] }
      header={ <h4>{ t("guests.name") }</h4> }
      itemLayout="horizontal"
      renderItem={ (guest: Guests_guests) => (
        <List.Item
          key={ guest.id }
          actions={
            loading ? [] : [
              <Button
                key="edit"
                icon={ <EditOutlined /> }
                onClick={ () => {
                  openDrawer(guest)
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
                { guest.name.substring(0, 1).toUpperCase() }
              </Avatar>
            }
            description={ guest.email }
            title={ `${ guest.name } ${ guest.surname }` } />
        </List.Item>
      ) } />
  )
}