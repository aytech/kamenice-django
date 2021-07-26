import { BookOutlined, EyeOutlined, HomeOutlined, IdcardOutlined } from "@ant-design/icons"
import { Menu } from "antd"
import { Link } from "react-router-dom"

export const MenuItems = () => {
  return (
    <Menu mode="horizontal">
      <Menu.Item key="reservation" icon={ <BookOutlined /> }>
        <Link to="/">Rezervace</Link>
      </Menu.Item>
      <Menu.Item key="overview" icon={ <EyeOutlined /> }>
        <Link to="/prehled">Přehled</Link>
      </Menu.Item>
      <Menu.Item key="guests" icon={ <IdcardOutlined /> }>
        <Link to="/guests">Hosté</Link>
      </Menu.Item>
      <Menu.Item key="suites" icon={ <HomeOutlined /> }>
        <Link to="/apartma">Apartmá</Link>
      </Menu.Item>
    </Menu>
  )
}