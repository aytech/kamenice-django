import { Affix, Layout } from "antd"
import { useState } from "react"
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom"
import { Header } from "../Header"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import Title from "antd/lib/typography/Title"
import { Guests } from "../Guests"
import { Suites } from "../Suites"
import { Login } from "../Login"

export const App = withRouter(({ history }: RouteComponentProps) => {

  const [ pageTitle, setPageTitle ] = useState<string>("Načítám...")

  return (
    <Layout id="app">
      <Affix offsetTop={ 0 } className="app__affix-header">
        <Header />
      </Affix>
      <Layout.Header>
        <Title level={ 3 }>{ pageTitle }</Title>
      </Layout.Header>
      <Layout.Content className="app-content">
        <Switch>
          <Route exact path="/">
            <Reservations
              setPageTitle={ setPageTitle } />
          </Route>
          <Route exact path="/apartma">
            <Suites
              setPageTitle={ setPageTitle } />
          </Route>
          <Route exact path="/guests">
            <Guests
              setPageTitle={ setPageTitle } />
          </Route>
          <Route exact path="/login">
            <Login
              setPageTitle={ setPageTitle } />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Layout.Content>
    </Layout>
  )
})