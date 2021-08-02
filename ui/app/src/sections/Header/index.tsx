import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import './styles.css'
import logo from './assets/mill.svg'
import { MenuItems } from './components/MenuItems'
import { PageHeader, Spin } from 'antd'
import { useMutation } from '@apollo/client'
import { JWT_TOKEN_LOGOUT } from '../../lib/graphql/mutations/User'
import { DeleteToken } from '../../lib/graphql/mutations/User/__generated__/DeleteToken'
import { ApolloHelper } from '../../lib/components/ApolloHelper'

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

  const redirectAfterLogout = () => {
    setIsAuthenticated(false)
    history.push(`/login?next=${ location.pathname }`)
  }

  const [ logout, { loading } ] = useMutation<DeleteToken>(JWT_TOKEN_LOGOUT, {
    onCompleted: redirectAfterLogout,
    onError: ApolloHelper.onQueryError
  })

  return (
    <Spin
      spinning={ loading }
      tip="Odhlašuji...">
      <PageHeader>
        <Link to="/">
          <img className="logo" src={ logo } alt="Kamenice logo" />
        </Link>
        {
          isAuthenticated === true &&
          <MenuItems logout={ logout } />
        }
      </PageHeader>
    </Spin>
  )
})