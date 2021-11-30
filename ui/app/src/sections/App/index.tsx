import { Affix, Layout, Skeleton } from "antd"
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
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
import { Statements } from "../Statements"

export const App = () => {

  useQuery(APP)

  const location = useLocation()
  const navigate = useNavigate()

  const { loading: settingsLoading, data: settingsData, refetch: settingsRefetch } = useQuery<SettingsData>(SETTINGS, {
    onCompleted: (value: SettingsData) => {
      if (value?.settings === null) {
        navigate(`/login?next=${ UrlHelper.getReferrer() }`)
      } else {
        if (location.pathname === paths.login) {
          // User is logged in, redirect
          const page = sessionStorage.getItem(sessionStorageKeys.page)
          if (page === null) {
            navigate("/")
          } else {
            navigate(page)
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
          <Routes>
            <Route path={ paths.root } element={ <Navigate to={ uris.reservations } /> } />
            <Route path={ paths.reservations } element={ <Reservations /> }>
              <Route path=":open" element={ <Reservations /> } />
            </Route>
            <Route path={ paths.suites } element={ <Suites /> } />
            <Route path={ paths.guests } element={ <Guests /> } />
            <Route path={ paths.login } element={ <Login settingsRefetch={ settingsRefetch } /> } />
            <Route path={ paths.reservation_guests } element={ <ReservationGuests /> } />
            <Route path={ paths.settings } element={ <Settings /> } />
            <Route path={ paths.statements } element={ <Statements /> } />
            <Route path="*" element={ <NotFound /> } />
          </Routes>
        </Layout.Content>
      </Skeleton>
    </Layout >
  )
}