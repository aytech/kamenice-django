import './styles.css'
import logo from './assets/mill.svg'
import { PageHeader } from 'antd'
import { appSettings } from '../../../../cache'
import { MenuItems } from './components/MenuItems'
import { Link } from 'react-router-dom'

export const Header = () => {

  const logoImage = (
    <img
      className="logo"
      src={ logo }
      alt="Kamenice logo" />
  )

  const homeLink = () => {
    return appSettings() !== null ? (
      <Link to="/">{ logoImage }</Link>
    ) : logoImage
  }

  return (
    <PageHeader>
      { homeLink() }
      <MenuItems />
    </PageHeader>
  )
}