import { Affix, Layout, Skeleton } from "antd"
import { useState } from "react"
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom"
import { Header } from "../Header"
import { Guests } from "../Guests"
import { Login } from "../Login"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { Suites } from "../Suites"
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client"
import { Whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"
import { USER } from "../../lib/graphql/queries/User"
import Title from "antd/lib/typography/Title"
import { RefreshToken, RefreshTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RefreshToken"
import { RevokeToken, RevokeTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RevokeToken"
import { TOKEN_REFRESH, TOKEN_REVOKE } from "../../lib/graphql/mutations/User"
import { useEffect } from "react"
import { errorMessages, refreshTokenName, tokenName } from "../../lib/Constants"
import { useCallback } from "react"
import { User } from "../../lib/Types"

export const App = withRouter(({ history, location }: RouteComponentProps) => {

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

  const redirectToLogin = useCallback(() => history.push("/login?next=/"), [ history ])
  const handleQueryError = (error: ApolloError) => {
    if (error.message.indexOf(errorMessages.signatureExpired) !== -1) {
      const token = localStorage.getItem(refreshTokenName)
      if (token === null) {
        redirectToLogin()
      } else {
        refreshToken({ variables: { refreshToken: token } })
      }
    }
  }

  const [ revokeToken, { loading: revokeLoading } ] = useMutation<RevokeToken, RevokeTokenVariables>(TOKEN_REVOKE)

  const [ getUser, { loading: userLoading } ] = useLazyQuery<Whoami>(USER, {
    onCompleted: (data: Whoami) => {
      if (data.whoami !== null) {
        setUser(data.whoami)
      }
    },
    onError: handleQueryError
  })

  useEffect(() => {
    const token = localStorage.getItem(tokenName)
    if (token === null) {
      redirectToLogin()
    } else {
      getUser()
    }
  }, [ getUser, redirectToLogin ])

  const reauthenticate = (callback: () => void) => {
    const token = localStorage.getItem(refreshTokenName)
    if (token === null) {
      redirectToLogin()
    } else {
      refreshToken({ variables: { refreshToken: token } })
        .then(callback)
    }
  }

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
            || userLoading
          }
          paragraph={ { rows: 5 } }>
          <Switch>
            <Route exact path="/">
              <Reservations
                reauthenticate={ reauthenticate }
                setPageTitle={ setPageTitle }
                setUser={ setUser }
                user={ user } />
            </Route>
            <Route exact path="/apartma">
              <Suites
                reauthenticate={ reauthenticate }
                setPageTitle={ setPageTitle }
                setUser={ setUser }
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