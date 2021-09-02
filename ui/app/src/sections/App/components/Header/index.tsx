import { Link } from 'react-router-dom'
import './styles.css'
import logo from './assets/mill.svg'
import { MenuItems } from './components/MenuItems'
import { PageHeader } from 'antd'
import { MenuItemKey, User } from '../../../../lib/Types'

interface Props {
  selectedPage: MenuItemKey
  user: User | null
}

export const Header = ({
  selectedPage,
  user
}: Props) => {

  const logoImage = (
    <img
      className="logo"
      src={ logo }
      alt="Kamenice logo" />
  )

  const homeLink = () => {
    return user !== null ? (
      <Link to="/">{ logoImage }</Link>
    ) : logoImage
  }

  return (
    <PageHeader>
      { homeLink() }
      <MenuItems
        selectedPage={ selectedPage }
        user={ user } />
    </PageHeader>
  )
}