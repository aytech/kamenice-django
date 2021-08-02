import { BookOutlined, HomeOutlined, IdcardOutlined, LogoutOutlined } from "@ant-design/icons"
import { Avatar, Menu } from "antd"
import { Link } from "react-router-dom"
import { Colors } from "../../../lib/components/Colors"
import { Whoami_whoami } from "../../../lib/graphql/queries/User/__generated__/Whoami"

interface Props {
  logout: () => void,
  user: Whoami_whoami
}

export const MenuItems = ({ logout, user }: Props) => {

  const userAvatar = (
    <Avatar
      size={ 32 }
      style={ {
        backgroundColor: Colors.getRandomColor()
      } }>
      { user.username.substring(0, 1).toUpperCase() }
    </Avatar>
  )
  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item key="reservation" icon={ <BookOutlined /> }>
          <Link to="/">Rezervace</Link>
        </Menu.Item>
        <Menu.Item key="guests" icon={ <IdcardOutlined /> }>
          <Link to="/guests">Hosté</Link>
        </Menu.Item>
        <Menu.Item key="suites" icon={ <HomeOutlined /> }>
          <Link to="/apartma">Apartmá</Link>
        </Menu.Item>
      </Menu >
      <Menu className="user" mode="horizontal">
        <Menu.SubMenu
          key="user-sub"
          title={ userAvatar }>
          <Menu.Item
            key="logout"
            icon={ <LogoutOutlined /> }
            onClick={ logout }>
            Odhlásit
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </>
  )
}