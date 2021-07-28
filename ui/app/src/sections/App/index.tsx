import { Affix, ConfigProvider, Layout } from "antd"
import csCZ from "antd/lib/locale/cs_CZ"
import { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { AppHeader } from "../AppHeader"
import { Guests } from "../Guests"
import { Home } from "../Home"
import { Login } from "../Login"
import { NotFound } from "../NotFound"
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
            <Route exact path="/">
              <Home isAuthenticated={ isAuthenticated } />
            </Route>
            <Route exact path="/apartma">
              <Suites isAuthenticated={ isAuthenticated } />
            </Route>
            <Route exact path="/guests">
              <Guests isAuthenticated={ isAuthenticated } />
            </Route>
            <Route exact path="/prehled">
              <Overview isAuthenticated={ isAuthenticated } />
            </Route>
            <Route exact path="/login">
              <Login setIsAuthenticated={ setIsAuthenticated } />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}