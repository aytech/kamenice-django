import { BookOutlined, HomeOutlined, IdcardOutlined, LogoutOutlined } from "@ant-design/icons"
import { Avatar, Menu } from "antd"
import { Link } from "react-router-dom"

interface Props {
  logout: () => void
}

export const MenuItems = ({ logout }: Props) => {
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
        <Menu.SubMenu title={ <Avatar size={ 32 }>I</Avatar> }>
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