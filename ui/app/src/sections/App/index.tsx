import { Affix, Layout, Skeleton } from "antd"
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom"
import { Header } from "./components/Header"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { Guests } from "../Guests"
import { Suites } from "../Suites"
import { Login } from "../Login"
import { paths, sessionStorageKeys, uris } from "../../lib/Constants"
import { ReservationGuests } from "../ReservationGuests"
import { PageTitle } from "./components/PageTitle"
import { Settings } from "../Settings"
import { useQuery } from "@apollo/client"
import { APP } from "../../lib/graphql/queries/App"
import { Settings as SettingsData } from "../../lib/graphql/queries/Settings/__generated__/Settings"
import { useEffect } from "react"
import './styles.css'
import { appSettings, userColor, userName } from "../../cache"
import { UrlHelper } from "../../lib/components/UrlHelper"
import { SETTINGS } from "../../lib/graphql/queries/Settings"

export const App = withRouter(({
  history,
  location
}: RouteComponentProps) => {

  useQuery(APP)
  const { loading: settingsLoading, data: settingsData, refetch: settingsRefetch } = useQuery<SettingsData>(SETTINGS, {
    onCompleted: (value: SettingsData) => {
      if (value?.settings === null) {
        history.push(`/login?next=${ UrlHelper.getReferrer() }`)
      } else {
        if (location.pathname === paths.login) {
          // User is logged in, redirect
          const page = sessionStorage.getItem(sessionStorageKeys.page)
          if (page === null) {
            history.push("/")
          } else {
            history.push(page)
          }
        }
        appSettings(value.settings)
      }
    }
  })

  useEffect(() => {
    if (location.pathname !== paths.login) {
      sessionStorage.setItem(sessionStorageKeys.page, location.pathname)
    }
  }, [ location, settingsData ])

  useEffect(() => {
    if (settingsData !== undefined && settingsData?.settings !== null) {
      appSettings(settingsData.settings)

      if (settingsData.settings.userColor !== null) {
        userColor(settingsData.settings.userColor)
      }

      if (settingsData.settings.userName !== null) {
        userName(settingsData.settings.userName)
      }
    }
  }, [ settingsData ])

  return (
    <Layout id="app">
      <Skeleton
        active
        className="app-skeleton"
        loading={ settingsLoading }>
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
              <Login settingsRefetch={ settingsRefetch } />
            </Route>
            <Route exact path={ paths.reservation_guests }>
              <ReservationGuests />
            </Route>
            <Route exact path={ paths.settings }>
              <Settings settingsData={ settingsData } />
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