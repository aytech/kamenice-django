import { Affix, ConfigProvider, Layout } from "antd"
import csCZ from "antd/lib/locale/cs_CZ"
import { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { AppHeader } from "../AppHeader"
import { Guests } from "../Guests"
import { Home } from "../Home"
import { Login } from "../Login"
import { Overview } from "../Overview"
import { Suites } from "../Suites"

export const App = () => {

  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false)

  return (
    <ConfigProvider locale={ csCZ }>
      <Router>
        <Layout id="app">
          <Affix offsetTop={ 0 } className="app__affix-header">
            <AppHeader isAuthenticated={ isAuthenticated } />
          </Affix>
          <Switch>
            <Route exact path="/" render={ () => <Home isAuthenticated={ isAuthenticated } /> } />
            <Route exact path="/apartma" render={ () => <Suites isAuthenticated={ isAuthenticated } /> } />
            <Route exact path="/guests" render={ () => <Guests isAuthenticated={ isAuthenticated } /> } />
            <Route exact path="/prehled" render={ () => <Overview isAuthenticated={ isAuthenticated } /> } />
            <Route exact path="/login" render={ () => <Login setIsAuthenticated={ setIsAuthenticated } /> } />
          </Switch>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}