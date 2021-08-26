import { Affix, Layout } from "antd"
import { useState } from "react"
import { Route, Switch } from "react-router-dom"
import { Header } from "../Header"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { Guests } from "../Guests"
import { Suites } from "../Suites"
import { Login } from "../Login"
import { paths } from "../../lib/Constants"
import { ReservationGuests } from "../ReservationGuests"
import { PageTitle } from "./components/PageTitle"
import { useTranslation } from "react-i18next"

export const App = () => {

  const { t } = useTranslation()

  const [ pageTitle, setPageTitle ] = useState<string | null>(`${ t("loading") }...`)

  return (
    <Layout id="app">
      <Affix offsetTop={ 0 } className="app__affix-header">
        <Header />
      </Affix>
      <Layout.Header>
        <PageTitle title={ pageTitle } />
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