import { Affix, Layout } from "antd"
import { useState } from "react"
import { Route, Switch } from "react-router-dom"
import { Header } from "../Header"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import Title from "antd/lib/typography/Title"
import { Guests } from "../Guests"
import { Suites } from "../Suites"
import { Login } from "../Login"
import { paths } from "../../lib/Constants"
import { ReservationGuests } from "../ReservationGuests"

export const App = () => {

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
          <Route exact path={ paths.root }>
            <Reservations
              setPageTitle={ setPageTitle } />
          </Route>
          <Route exact path={ paths.suites }>
            <Suites
              setPageTitle={ setPageTitle } />
          </Route>
          <Route exact path={ paths.guests }>
            <Guests
              setPageTitle={ setPageTitle } />
          </Route>
          <Route exact path={ paths.login }>
            <Login
              setPageTitle={ setPageTitle } />
          </Route>
          <Route exact path={ paths.reservation_guests }>
            <ReservationGuests
              setPageTitle={ setPageTitle } />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Layout.Content>
    </Layout >
  )
}