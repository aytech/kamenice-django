import { Link } from 'react-router-dom'
import './styles.css'
import logo from './assets/mill.svg'
import { MenuItems } from './components/MenuItems'
import { PageHeader } from 'antd'

interface Props {
  isAuthenticated: boolean
}

export const Header = ({ isAuthenticated }: Props) => {

  return (
    <PageHeader className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={ logo } alt="Kamenice logo" />
          </Link>
        </div>
        {
          isAuthenticated === true &&
          <div className="app-header__menu-section">
            <MenuItems />
          </div>
        }
      </div>
    </PageHeader>
  )
}