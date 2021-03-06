import { DeleteOutlined, EditOutlined, UserAddOutlined } from "@ant-design/icons"
import { ApolloError, useMutation } from "@apollo/client"
import { Avatar, Button, Col, List, message, Popconfirm, Row, Tooltip } from "antd"
import Text from "antd/lib/typography/Text"
import { useTranslation } from "react-i18next"
import { selectedSuite } from "../../../../cache"
import { Colors } from "../../../../lib/components/Colors"
import { DeleteReservationRoommateDocument, DeleteReservationRoommateMutation, DeleteReservationRoommateMutationVariables } from "../../../../lib/graphql/graphql"
import { IGuest } from "../../../../lib/Types"

interface Props {
  hash?: string,
  loading: boolean
  openDrawer: (guest: IGuest | null) => void
  refetch?: () => void
  roommates: IGuest[]
}

export const Roommates = ({
  hash,
  loading,
  openDrawer,
  refetch,
  roommates
}: Props) => {

  const { t } = useTranslation()

  const [ deleteGuest, { loading: deleteLoading } ] = useMutation<DeleteReservationRoommateMutation, DeleteReservationRoommateMutationVariables>(DeleteReservationRoommateDocument, {
    onCompleted: (value: DeleteReservationRoommateMutation) => {
      const deletedGuest = value.deleteReservationRoommate?.roommate
      if (deletedGuest !== undefined && deletedGuest !== null) {
        message.success(t("guests.deleted", { name: deletedGuest.name, surname: deletedGuest.surname }))
      }
      if (refetch !== undefined) {
        refetch()
      }
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const headerActions = (guest: IGuest) => {
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
      && (suite.numberBeds + suite.numberBedsExtra) > (roommates.length + 1) ? (
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
      renderItem={ (guest: IGuest) => (
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