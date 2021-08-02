import { Affix, ConfigProvider, Layout, Skeleton } from "antd"
import csCZ from "antd/lib/locale/cs_CZ"
import { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Header } from "../Header"
import { Guests } from "../Guests"
import { Login } from "../Login"
import { NotFound } from "../NotFound"
import { Reservations } from "../Reservations"
import { Suites } from "../Suites"
import { ApolloError, useMutation, useQuery } from "@apollo/client"
import { Whoami, Whoami_whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"
import { USER } from "../../lib/graphql/queries/User"
import Title from "antd/lib/typography/Title"
import { DeleteToken } from "../../lib/graphql/mutations/User/__generated__/DeleteToken"
import { JWT_TOKEN_LOGOUT } from "../../lib/graphql/mutations/User"

export const App = () => {

  const [ user, setUser ] = useState<Whoami_whoami>()
  const [ pageTitle, setPageTitle ] = useState<string>("Načítám...")

  const { loading: userLoading } = useQuery<Whoami>(USER, {
    onCompleted: (data: Whoami) => {
      if (data.whoami !== null) {
        setUser(data.whoami)
      }
    },
    onError: (reason: ApolloError) => {
      console.error(reason)
    }
  })
  const [ logout, { loading: logoutLoading } ] = useMutation<DeleteToken>(JWT_TOKEN_LOGOUT, {
    onCompleted: (data: DeleteToken) => {
      setUser(undefined)
    },
    onError: (reason: ApolloError) => {
      console.error(reason)
    }
  })

  return (
    <ConfigProvider locale={ csCZ }>
      <Router>
        <Layout id="app">
          <Affix offsetTop={ 0 } className="app__affix-header">
            <Header logout={ logout } user={ user } />
          </Affix>
          <Layout.Header>
            <Title level={ 3 }>{ pageTitle }</Title>
          </Layout.Header>
          <Layout.Content className="app-content">
            <Skeleton active loading={ userLoading || logoutLoading } paragraph={ { rows: 5 } }>
              <Switch>
                <Route exact path="/">
                  <Reservations
                    setPageTitle={ setPageTitle }
                    setUser={ setUser }
                    user={ user } />
                </Route>
                <Route exact path="/apartma">
                  <Suites
                    setPageTitle={ setPageTitle }
                    setUser={ setUser }
                    user={ user } />
                </Route>
                <Route exact path="/guests">
                  <Guests
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
      </Router>
    </ConfigProvider >
  )
}