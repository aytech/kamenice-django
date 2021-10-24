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
import { useEffect, useState } from "react"
import './styles.css'
import { discountSettingsOptions, appSettings, userColor, userName } from "../../cache"
import { UrlHelper } from "../../lib/components/UrlHelper"
import { SETTINGS } from "../../lib/graphql/queries/Settings"
import { OptionsType } from "../../lib/Types"

export const App = withRouter(({
  history,
  location
}: RouteComponentProps) => {

  const [ appLoading, setAppLoading ] = useState<boolean>(true)

  useQuery(APP)
  useQuery<SettingsData>(SETTINGS, {
    onCompleted: (value: SettingsData) => {
      if (value.settings === null) {
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
        // Update user settings in local cache
        appSettings(value.settings)
        if (value.settings.userColor !== null) {
          userColor(value.settings.userColor)
        }
        if (value.settings.userName !== null) {
          userName(value.settings.userName)
        }
        // Set discount types for Settings page.
        // Maybe move to component
        const settingsDiscountTypes: OptionsType[] = []
        value?.discountSettingsTypes?.forEach(discount => {
          if (discount !== null) {
            settingsDiscountTypes.push({
              label: discount.value,
              value: discount.name
            })
          }
        })
        discountSettingsOptions(settingsDiscountTypes)
      }
      setAppLoading(false)
    }
  })

  useEffect(() => {
    if (location.pathname !== paths.login) {
      sessionStorage.setItem(sessionStorageKeys.page, location.pathname)
    }
  }, [ location ])

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