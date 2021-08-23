import { Affix, Layout, Skeleton } from "antd"
import { useState } from "react"
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom"
import { Header } from "../Header"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { useMutation } from "@apollo/client"
import Title from "antd/lib/typography/Title"
import { RevokeToken, RevokeTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RevokeToken"
import { TOKEN_REVOKE } from "../../lib/graphql/mutations/User"
import { refreshTokenName, tokenName } from "../../lib/Constants"
import { useCallback } from "react"
import { UrlHelper } from "../../lib/components/UrlHelper"
import { User } from "../../lib/Types"
import { Guests } from "../Guests"

export const App = withRouter(({ history }: RouteComponentProps) => {

  const [ user, setUser ] = useState<User>()
  const [ pageTitle, setPageTitle ] = useState<string>("Načítám...")

  const [ revokeToken, { loading: revokeLoading } ] = useMutation<RevokeToken, RevokeTokenVariables>(TOKEN_REVOKE)

  const redirectToLogin = useCallback(() => {
    setUser(undefined)
    history.push(`/login?next=${ UrlHelper.getReferrer() }`)
  }, [ history ])

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
          loading={ revokeLoading }
          paragraph={ { rows: 5 } }>
          <Switch>
            <Route exact path="/">
              <Reservations
                setPageTitle={ setPageTitle }
                setUser={ setUser } />
            </Route>
            {/* <Route exact path="/apartma">
              <Suites
                reauthenticate={ reauthenticate }
                setPageTitle={ setPageTitle }
                setUser={ setUser } />
            </Route> */}
            <Route exact path="/guests">
              <Guests
                setPageTitle={ setPageTitle }
                setUser={ setUser } />
            </Route>
            {/* <Route exact path="/login">
              <Login
                refetch={ refetch }
                setPageTitle={ setPageTitle }
                setUser={ setUser } />
            </Route> */}
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Skeleton>
      </Layout.Content>
    </Layout>
  )
})