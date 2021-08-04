import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import './styles.css'
import logo from './assets/mill.svg'
import { MenuItems } from './components/MenuItems'
import { PageHeader } from 'antd'
import { User } from '../../lib/Types'

interface Props {
  logout: () => void
  user: User | undefined
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