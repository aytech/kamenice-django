import { Affix, Layout, Skeleton } from "antd"
import { useState } from "react"
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom"
import { Header } from "../Header"
import { Guests } from "../Guests"
import { Login } from "../Login"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { Suites } from "../Suites"
import { useMutation } from "@apollo/client"
import Title from "antd/lib/typography/Title"
import { RefreshToken, RefreshTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RefreshToken"
import { RevokeToken, RevokeTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RevokeToken"
import { TOKEN_REFRESH, TOKEN_REVOKE } from "../../lib/graphql/mutations/User"
import { refreshTokenName, tokenName } from "../../lib/Constants"
import { useCallback } from "react"
import { UrlHelper } from "../../lib/components/UrlHelper"
import { User } from "../../lib/Types"

export const App = withRouter(({ history }: RouteComponentProps) => {

  const [ user, setUser ] = useState<User>()
  const [ pageTitle, setPageTitle ] = useState<string>("Načítám...")

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

  const reauthenticate = (callback: () => void) => {
    const token = localStorage.getItem(refreshTokenName)
    if (token === null) {
      redirectToLogin()
    } else {
      refreshToken({ variables: { refreshToken: token } })
        .then(callback)
        .catch(redirectToLogin)
    }
  }

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
      </Layout.Content>
    </Layout>
  )
})