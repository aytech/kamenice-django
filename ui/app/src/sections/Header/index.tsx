import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import './styles.css'
import logo from './assets/mill.svg'
import { MenuItems } from './components/MenuItems'
import { PageHeader } from 'antd'
import { deleteCookie } from '../../lib/Cookie'
import { authToken } from '../../lib/Constants'

interface Props {
  isAuthenticated: boolean,
  setIsAuthenticated: (status: boolean) => void
}

export const Header = withRouter(({
  history,
  location,
  isAuthenticated,
  setIsAuthenticated
}: RouteComponentProps & Props) => {

  const logout = (): void => {
    deleteCookie(authToken)
    setIsAuthenticated(false)
    history.push(`/login?next=${ location.pathname }`)
  }

  return (
    <PageHeader className="app-header">
      <div className="app-header__container">
        <div className="app-header__logo">
          <Link to="/">
            <img src={ logo } alt="Kamenice logo" />
          </Link>
        </div>
        {
          isAuthenticated === true &&
          <div className="app-header__menu-section">
            <MenuItems logout={ logout } />
          </div>
        }
      </div>
    </PageHeader>
  )
})