import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { ApolloError, useMutation } from "@apollo/client"
import { Avatar, Button, List, message, Popconfirm } from "antd"
import { useTranslation } from "react-i18next"
import { guestDrawerOpen, selectedGuest } from "../../../../cache"
import { Colors } from "../../../../lib/components/Colors"
import { DELETE_GUEST } from "../../../../lib/graphql/mutations/Guest"
import { DeleteGuest, DeleteGuestVariables } from "../../../../lib/graphql/mutations/Guest/__generated__/DeleteGuest"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"

interface Props {
  guest: Guests_guests
  refetch?: () => void
}

export const GuestItem = ({
  guest,
  refetch,
}: Props) => {

  const { t } = useTranslation()

  const [ deleteGuest, { loading: deleteLoading } ] = useMutation<DeleteGuest, DeleteGuestVariables>(DELETE_GUEST, {
    onCompleted: (value: DeleteGuest) => {
      const deletedGuest = value.deleteGuest?.guest
      if (deletedGuest !== undefined && deletedGuest !== null) {
        message.success(t("guests.deleted", { name: deletedGuest.name, surname: deletedGuest.surname }))
      }
      if (refetch !== undefined) {
        refetch()
      }
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const getUserColor = () => {
    if (guest.color !== null) {
      return guest.color
    }
    return Colors.getDefaultColor()
  }

  return (
    <List.Item
      actions={ [
        <Button
          key="edit"
          icon={ <EditOutlined /> }
          onClick={ () => {
            selectedGuest(guest)
            guestDrawerOpen(true)
          } }>
          { t("edit") }
        </Button>,
        <Popconfirm
          cancelText={ t("no") }
          okText={ t("yes") }
          onConfirm={ () => deleteGuest({ variables: { guestId: guest.id } }) }
          title={ t("forms.delete-confirm") }>
          <Button
            className="remove-guest"
            danger
            key="delete"
            icon={ <DeleteOutlined /> }
            loading={ deleteLoading }>
            { t("forms.delete") }
          </Button>
        </Popconfirm>
      ] }
      className="guest-item">
      <List.Item.Meta
        avatar={
          <Avatar
            gap={ 4 }
            size="large"
            style={ {
              backgroundColor: getUserColor()
            } }>
            { guest.name.substring(0, 1).toUpperCase() }
          </Avatar>
        }
        description={ guest.age !== null ? t(`enums.${ guest.age }`) : null }
        title={ `${ guest.name } ${ guest.surname }` } />
    </List.Item>
  )
}