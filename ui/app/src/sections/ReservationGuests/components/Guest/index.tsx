import { EditOutlined } from "@ant-design/icons"
import { Avatar, Button, List } from "antd"
import Text from "antd/lib/typography/Text"
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

  const headerActions = (guest: Guests_guests) => {
    if (loading === true) {
      return []
    }
    return [
      <Button
        key="edit"
        icon={ <EditOutlined /> }
        onClick={ () => {
          openDrawer(guest)
        } }>
        { t("edit") }
      </Button>
    ]
  }

  return guest === undefined
    || guest === null ? null : (
    <List
      bordered={ true }
      className="guests"
      dataSource={ [ guest ] }
      footer={
        <Text disabled>&reg;{ t("company-name") }</Text>
      }
      header={ <h2>{ t("guests.main") }</h2> }
      itemLayout="horizontal"
      renderItem={ (guest: Guests_guests) => (
        <List.Item
          key={ guest.id }
          actions={ headerActions(guest) }>
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