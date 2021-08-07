import { Affix, Layout, Skeleton } from "antd"
import { useState } from "react"
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom"
import { Header } from "../Header"
import { Guests } from "../Guests"
import { Login } from "../Login"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { Suites } from "../Suites"
import { ApolloError, useMutation, useQuery } from "@apollo/client"
import Title from "antd/lib/typography/Title"
import { RefreshToken, RefreshTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RefreshToken"
import { RevokeToken, RevokeTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RevokeToken"
import { TOKEN_REFRESH, TOKEN_REVOKE } from "../../lib/graphql/mutations/User"
import { errorMessages, refreshTokenName, tokenName } from "../../lib/Constants"
import { useCallback } from "react"
import { UrlHelper } from "../../lib/components/UrlHelper"
import { IReservation, User } from "../../lib/Types"
import { ReservationModal } from "../ReservationModal"
import { HOME_PAGE } from "../../lib/graphql/queries/App"
import { HomePage } from "../../lib/graphql/queries/App/__generated__/HomePage"
import { GuestDrawerSmall } from "../GuestDrawerSmall"

export const App = withRouter(({ history }: RouteComponentProps) => {

  const [ user, setUser ] = useState<User>()
  const [ pageTitle, setPageTitle ] = useState<string>("Načítám...")
  const [ reservation, setReservation ] = useState<IReservation>()
  const [ reservationModalOpen, setReservationModalOpen ] = useState<boolean>(false)
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)

  const [ refreshToken, { loading: tokenLoading } ] = useMutation<RefreshToken, RefreshTokenVariables>(TOKEN_REFRESH, {
    onCompleted: (token: RefreshToken) => {
      if (token.refreshToken !== null) {
        localStorage.setItem(tokenName, token.refreshToken.token)
        localStorage.setItem(refreshTokenName, token.refreshToken.refreshToken)
        setUser({ username: token.refreshToken.payload.username })
        // for debugging only
        localStorage.setItem("tokenExpiresIn", token.refreshToken.payload.exp.toString())
        localStorage.setItem("refreshTokenExpiresIn", token.refreshToken.refreshExpiresIn.toString())
        // --- / ---
      }
    }
  })

  const redirectToLogin = useCallback(() => {
    setUser(undefined)
    history.push(`/login?next=${ UrlHelper.getReferrer() }`)
  }, [ history ])

  const reauthenticate = (callback: () => void, errorHandler?: (reason: ApolloError) => void) => {
    const token = localStorage.getItem(refreshTokenName)
    if (token === null) {
      redirectToLogin()
    } else {
      refreshToken({ variables: { refreshToken: token } })
        .then(callback)
        .catch((reason: ApolloError) => {
          if (reason.message === errorMessages.refreshTokenExpired) {
            redirectToLogin()
          } else {
            if (errorHandler !== undefined) {
              errorHandler(reason)
            } else {
              console.error(reason.message)
            }
          }
        })
    }
  }

  const { loading, data, refetch } = useQuery<HomePage>(HOME_PAGE, {
    onCompleted: (data: HomePage) => {
      if (data.whoami !== null) {
        setUser({ username: data.whoami.username })
      }
    },
    onError: () => reauthenticate(refetch)
  })

  const [ revokeToken, { loading: revokeLoading } ] = useMutation<RevokeToken, RevokeTokenVariables>(TOKEN_REVOKE)

  const logout = (): void => {
    const refreshToken = localStorage.getItem(refreshTokenName)
    if (refreshToken !== null) {
      revokeToken({ variables: { refreshToken } })
        .then(() => {
          setUser(undefined)
          localStorage.removeItem(tokenName)
          localStorage.removeItem(refreshTokenName)
        })
        .finally(() => redirectToLogin())
    } else {
      redirectToLogin()
    }
  }

  return (
    <Layout id="app">
      <Affix offsetTop={ 0 } className="app__affix-header">
        <Header logout={ logout } user={ user } />
      </Affix>
      <Layout.Header>
        <Title level={ 3 }>{ pageTitle }</Title>
      </Layout.Header>
      <Layout.Content className="app-content">
        <Skeleton
          active
          loading={
            revokeLoading
            || tokenLoading
          }
          paragraph={ { rows: 5 } }>
          <Switch>
            <Route exact path="/">
              <Reservations
                openReservationModal={ (reservation: IReservation) => {
                  setReservation(reservation)
                  setReservationModalOpen(true)
                } }
                reauthenticate={ reauthenticate }
                setPageTitle={ setPageTitle } />
            </Route>
            <Route exact path="/apartma">
              <Suites
                reauthenticate={ reauthenticate }
                setPageTitle={ setPageTitle }
                user={ user } />
            </Route>
            <Route exact path="/guests">
              <Guests
                reauthenticate={ reauthenticate }
                setPageTitle={ setPageTitle }
                setUser={ setUser }
                user={ user } />
            </Route>
            <Route exact path="/login">
              <Login
                setPageTitle={ setPageTitle }
                setUser={ setUser }
                user={ user } />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Skeleton>
        <ReservationModal
          close={ () => {
            setReservation(undefined)
            setReservationModalOpen(false)
          } }
          guests={ data?.guests }
          isOpen={ reservationModalOpen }
          reauthenticate={ reauthenticate }
          openGuestDrawer={ () => setGuestDrawerOpen(true) }
          refetch={ refetch }
          reservation={ reservation }
        />
        <GuestDrawerSmall
          close={ () => setGuestDrawerOpen(false) }
          open={ guestDrawerOpen }
          reauthenticate={ reauthenticate }
          refetch={ refetch } />
      </Layout.Content>
    </Layout>
  )
})