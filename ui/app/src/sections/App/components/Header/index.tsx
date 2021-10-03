import './styles.css'
import logo from './assets/mill.svg'
import { PageHeader } from 'antd'
import { appUser } from '../../../../cache'
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
    return appUser() !== null ? (
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