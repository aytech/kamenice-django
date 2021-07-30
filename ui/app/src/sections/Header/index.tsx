import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import './styles.css'
import logo from './assets/mill.svg'
import { MenuItems } from './components/MenuItems'
import { message, PageHeader, Spin } from 'antd'
import { ApolloError, useMutation } from '@apollo/client'
import { JWT_TOKEN_LOGOUT } from '../../lib/graphql/mutations/User'
import { DeleteToken } from '../../lib/graphql/mutations/User/__generated__/DeleteToken'

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

  const [ logout, { loading } ] = useMutation<DeleteToken>(JWT_TOKEN_LOGOUT, {
    onCompleted: () => {
      setIsAuthenticated(false)
      history.push(`/login?next=${ location.pathname }`)
    },
    onError: (reason: ApolloError) => {
      console.error(reason);
      message.error("Chyba serveru, kontaktujte správce")
    }
  })

  return (
    <Spin
      spinning={ loading }
      tip="Odhlašuji...">
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
    </Spin>
  )
})