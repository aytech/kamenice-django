import { UsergroupAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, List, Row, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { Colors } from "../../../../lib/components/Colors";
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests";
import './styles.css'

interface Props {
  guest: Guests_guests
  roommates: Guests_guests[]
  show: boolean
}

export const Roommates = ({
  guest,
  roommates,
  show
}: Props) => {

  const { t } = useTranslation()

  return show === true ? (
    <List
      bordered={ true }
      className="roommates"
      dataSource={ roommates }
      header={
        <Row>
          <Col lg={ 23 } md={ 22 } sm={ 20 } xs={ 20 }>
            <h4>{ guest.name } { guest.surname } - { t("guests.roommates") }</h4>
          </Col>
          <Col lg={ 1 } md={ 2 } sm={ 4 } xs={ 4 }>
            <Tooltip title={ t("guests.add") }>
              <Button
                onClick={ () => console.log("Open roommates drawer") }>
                <UsergroupAddOutlined />
              </Button>
            </Tooltip>
          </Col>
        </Row>
      }
      renderItem={ (guest: Guests_guests) => (
        <List.Item
          actions={ [
          ] }>
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
  ) : null
}