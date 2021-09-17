import { EditOutlined } from "@ant-design/icons";
import { ApolloError, useLazyQuery } from "@apollo/client";
import { Avatar, Button, List, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "../../../../lib/components/Colors";
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests";
import { ROOMMATES } from "../../../../lib/graphql/queries/Roommates";
import { Roommates as RoommatesData, RoommatesVariables, Roommates_roommates } from "../../../../lib/graphql/queries/Roommates/__generated__/Roommates";
import { GuestsListHeader } from "../GuestsListHeader";
import { RoommatesDrawer } from "../RoommatesDrawer";
import './styles.css'

interface Props {
  guest: Guests_guests
  show: boolean
}

export const Roommates = ({
  guest,
  show
}: Props) => {

  const { t } = useTranslation()

  const [ roommates, setRoommates ] = useState<Roommates_roommates[]>([])
  const [ roommateDrawerVisible, setRoommateDrawerVisible ] = useState<boolean>(false)
  const [ selectedRoommate, setSelectedRoommate ] = useState<Roommates_roommates>()

  const [ getRoommates, { data, loading, refetch } ] = useLazyQuery<RoommatesData, RoommatesVariables>(ROOMMATES, {
    variables: { guestId: guest.id },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  useEffect(() => {
    if (show === true) {
      getRoommates()
    }
  }, [ getRoommates, show ])

  useEffect(() => {
    const guestRoommates: Roommates_roommates[] = []
    data?.roommates?.forEach(roommate => {
      if (roommate !== null) {
        guestRoommates.push(roommate)
      }
    })
    setSelectedRoommate(undefined)
    setRoommates(guestRoommates)
  }, [ data ])

  return show === true ? (
    <>
      <List
        bordered={ true }
        className="roommates"
        dataSource={ roommates }
        header={
          <GuestsListHeader
            action={ () => {
              setSelectedRoommate(undefined)
              setRoommateDrawerVisible(true)
            } }
            title={ `${ guest.name } ${ guest.surname } - ${ t("guests.roommates") }` } />
        }
        loading={ loading }
        renderItem={ (roommate: Roommates_roommates) => (
          <List.Item
            actions={ [
              <Button
                key="edit"
                icon={ <EditOutlined /> }
                onClick={ () => {
                  setSelectedRoommate(roommate)
                  setRoommateDrawerVisible(true)
                } }>
                { t("edit") }
              </Button>
            ] }>
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
              description={ roommate.age !== null ? t(`enums.${ roommate.age }`) : null }
              title={ `${ roommate.name } ${ roommate.surname }` } />
          </List.Item>
        ) } />
      <RoommatesDrawer
        close={ () => setRoommateDrawerVisible(false) }
        guest={ guest }
        refetch={ refetch }
        roommate={ selectedRoommate }
        visible={ roommateDrawerVisible } />
    </>
  ) : null
}