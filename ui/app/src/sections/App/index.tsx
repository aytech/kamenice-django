import { Affix, Layout } from "antd"
import { Redirect, Route, Switch } from "react-router-dom"
import { Header } from "./components/Header"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { Guests } from "../Guests"
import { Suites } from "../Suites"
import { Login } from "../Login"
import { paths, uris, usernameKey } from "../../lib/Constants"
import { ReservationGuests } from "../ReservationGuests"
import { PageTitle } from "./components/PageTitle"
import { User } from "../../lib/Types"

export const App = () => {

  const getUser = (): User | null => {
    const username = localStorage.getItem(usernameKey)
    return username !== null ? {
      username
    } : null
  }

  return (
    <Layout id="app">
      <Affix offsetTop={ 0 } className="app__affix-header">
        <Header user={ getUser() } />
      </Affix>
      <Layout.Header>
        <PageTitle />
      </Layout.Header>
      <Layout.Content className="app-content">
        <Switch>
          <Route exact path={ paths.root }>
            <Redirect to={ uris.reservations } />
          </Route>
          <Route exact path={ paths.reservations }>
            <Reservations />
          </Route>
          <Route exact path={ paths.suites }>
            <Suites />
          </Route>
          <Route exact path={ paths.guests }>
            <Guests />
          </Route>
          <Route exact path={ paths.login }>
            <Login />
          </Route>
          <Route exact path={ paths.reservation_guests }>
            <ReservationGuests />
          </Route>
          <Route exact path={ paths.settings }>
            <NotFound />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Layout.Content>
    </Layout >
  )
}