import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import './styles.css'
import logo from './assets/mill.svg'
import { MenuItems } from './components/MenuItems'
import { PageHeader } from 'antd'
import { Whoami_whoami } from '../../lib/graphql/queries/User/__generated__/Whoami'

interface Props {
  logout: () => void
  user: Whoami_whoami | undefined
}

export const Header = withRouter(({
  history,
  location,
  logout,
  user
}: RouteComponentProps & Props) => {

  return (
    <PageHeader>
      <Link to="/">
        <img className="logo" src={ logo } alt="Kamenice logo" />
      </Link>
      {
        user !== undefined &&
        <MenuItems
          logout={ () => {
            logout()
            history.push(`/login?next=${ location.pathname }`)
          } }
          user={ user } />
      }
    </PageHeader>
  )
})