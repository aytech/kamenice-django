import React, { useState } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import Search from 'antd/lib/input/Search'
import { Header } from 'antd/lib/layout/layout'
import './styles.css'
import logo from './assets/mill.svg'

export const AppHeader = withRouter(({ location, history }: RouteComponentProps) => {

  const [ search, setSearch ] = useState("")

  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            {/* <img src="https://via.placeholder.com/32" alt="Kamenice logo" /> */ }
            <img src={ logo } alt="Kamenice logo" />
          </Link>
        </div>
        <div className="app-header__search-input">
          <Search
            placeholder=""
            enterButton
            onChange={ (event) => setSearch(event.target.value) }
            onSearch={ () => { } }
            value={ search }
          />
        </div>
      </div>
      <div className="app-header__menu-section">
        {/* <MenuItems viewer={ viewer } setViewer={ setViewer } /> */ }
      </div>
    </Header>
  )
})