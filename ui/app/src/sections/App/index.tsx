import { Affix, Layout, Skeleton } from "antd"
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom"
import { Header } from "./components/Header"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { Guests } from "../Guests"
import { Suites } from "../Suites"
import { Login } from "../Login"
import { paths, uris } from "../../lib/Constants"
import { ReservationGuests } from "../ReservationGuests"
import { PageTitle } from "./components/PageTitle"
import { Settings } from "../Settings"
import { useQuery } from "@apollo/client"
import { USER } from "../../lib/graphql/queries/App"
import { User } from "../../lib/graphql/queries/App/__generated__/User"
import { useState } from "react"
import { appUser } from "../../cache"
import './styles.css'
import { UrlHelper } from "../../lib/components/UrlHelper"

export const App = withRouter(({ history }: RouteComponentProps) => {

  const [ appLoading, setAppLoading ] = useState<boolean>(true)

  useQuery<User>(USER, {
    onCompleted: (value: User) => {
      if (value.user === null) {
        history.push(`/login?next=${ UrlHelper.getReferrer() }`)
      } else {
        appUser(value.user)
      }
      setAppLoading(false)
    }
  })

  return (
    <Layout id="app">
      <Skeleton
        active
        className="app-skeleton"
        loading={ appLoading }>
        <Affix
          className="app__affix-header"
          offsetTop={ 0 }>
          <Header />
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
              <Settings />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Layout.Content>
      </Skeleton>
    </Layout >
  )
})