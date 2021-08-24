import { Link } from 'react-router-dom'
import './styles.css'
import logo from './assets/mill.svg'
import { MenuItems } from './components/MenuItems'
import { PageHeader } from 'antd'

export const Header = () => {
  return (
    <PageHeader>
      <Link to="/">
        <img className="logo" src={ logo } alt="Kamenice logo" />
      </Link>
      <MenuItems />
    </PageHeader>
  )
}