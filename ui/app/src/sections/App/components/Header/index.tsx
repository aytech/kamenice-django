import { Link } from 'react-router-dom'
import './styles.css'
import logo from './assets/mill.svg'
import { MenuItems } from './components/MenuItems'
import { PageHeader } from 'antd'
import { User } from '../../../../lib/Types'

interface Props {
  user: User | null
}

export const Header = ({ user }: Props) => {

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
      <MenuItems user={ user } />
    </PageHeader>
  )
}