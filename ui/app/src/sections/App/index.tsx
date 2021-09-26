import { Affix, Layout } from "antd"
import { useState } from "react"
import { Route, Switch } from "react-router-dom"
import { Header } from "./components/Header"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { Guests } from "../Guests"
import { Suites } from "../Suites"
import { Login } from "../Login"
import { paths, usernameKey } from "../../lib/Constants"
import { ReservationGuests } from "../ReservationGuests"
import { PageTitle } from "./components/PageTitle"
import { useTranslation } from "react-i18next"
import { MenuItemKey, User } from "../../lib/Types"

export const App = () => {

  const { t } = useTranslation()

  const [ pageTitle, setPageTitle ] = useState<string | null>(`${ t("loading") }...`)
  const [ selectedPage, setSelectedPage ] = useState<MenuItemKey>("user")

  const getUser = (): User | null => {
    const username = localStorage.getItem(usernameKey)
    return username !== null ? {
      username
    } : null
  }

  return (
    <Layout id="app">
      <Affix offsetTop={ 0 } className="app__affix-header">
        <Header
          selectedPage={ selectedPage }
          user={ getUser() } />
      </Affix>
      <Layout.Header>
        <PageTitle title={ pageTitle } />
      </Layout.Header>
      <Layout.Content className="app-content">
        <Switch>
          <Route exact path={ paths.reservations }>
            <Reservations
              setPageTitle={ setPageTitle }
              setSelectedPage={ setSelectedPage } />
          </Route>
          <Route exact path={ paths.suites }>
            <Suites
              setPageTitle={ setPageTitle }
              setSelectedPage={ setSelectedPage } />
          </Route>
          <Route exact path={ paths.guests }>
            <Guests
              setPageTitle={ setPageTitle }
              setSelectedPage={ setSelectedPage } />
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