import { DeleteOutlined, EditOutlined, UserAddOutlined } from "@ant-design/icons"
import { ApolloError, useMutation } from "@apollo/client"
import { Avatar, Button, Col, List, message, Popconfirm, Row, Tooltip } from "antd"
import Text from "antd/lib/typography/Text"
import { useTranslation } from "react-i18next"
import { selectedSuite } from "../../../../cache"
import { Colors } from "../../../../lib/components/Colors"
import { DELETE_RESERVATON_GUEST } from "../../../../lib/graphql/mutations/ReservationGuest"
import { DeleteReservationGuest, DeleteReservationGuestVariables } from "../../../../lib/graphql/mutations/ReservationGuest/__generated__/DeleteReservationGuest"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"

interface Props {
  hash?: string,
  loading: boolean
  openDrawer: (guest: Guests_guests | null) => void
  refetch?: () => void
  roommates: Guests_guests[]
}

export const Roommates = ({
  hash,
  loading,
  openDrawer,
  refetch,
  roommates
}: Props) => {

  const { t } = useTranslation()

  const [ deleteGuest, { loading: deleteLoading } ] = useMutation<DeleteReservationGuest, DeleteReservationGuestVariables>(DELETE_RESERVATON_GUEST, {
    onCompleted: (value: DeleteReservationGuest) => {
      const deletedGuest = value.deleteReservationGuest?.guest
      if (deletedGuest !== undefined && deletedGuest !== null) {
        message.success(t("guests.deleted", { name: deletedGuest.name, surname: deletedGuest.surname }))
      }
      if (refetch !== undefined) {
        refetch()
      }
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

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
      </Button>,
      <Popconfirm
        cancelText={ t("no") }
        okText={ t("yes") }
        onConfirm={ () => deleteGuest({ variables: { data: { id: guest.id, hash } } }) }
        title={ t("tooltips.delete-confirm") }>
        <Button
          danger
          key="delete"
          icon={ <DeleteOutlined /> }
          loading={ deleteLoading }>
          { t("delete") }
        </Button>
      </Popconfirm>
    ]
  }

  const AddGuestButton = () => {
    const suite = selectedSuite()
    return suite !== undefined
      && suite !== null
      // total guests = roommates + main guest
      && suite.numberBeds > (roommates.length + 1) ? (
      <Tooltip title={ t("guests.add") }>
        <Button
          onClick={ () => openDrawer(null) }>
          <UserAddOutlined />
        </Button>
      </Tooltip>
    ) : null
  }

  return (
    <List
      bordered={ true }
      className="guests"
      dataSource={ roommates }
      footer={
        <Text disabled>&reg;{ t("company-name") }</Text>
      }
      // header={ <h4>{ t("guests.roommates") }</h4> }
      header={ (
        <Row>
          <Col lg={ 23 } md={ 22 } sm={ 20 } xs={ 20 }>
            <h2>{ t("guests.roommates") }</h2>
          </Col>
          <Col lg={ 1 } md={ 2 } sm={ 4 } xs={ 4 }>
            <AddGuestButton />
          </Col>
        </Row>
      ) }
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