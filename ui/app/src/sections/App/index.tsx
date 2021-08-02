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
import { ApolloError, useQuery } from "@apollo/client"
import { Whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"
import { USER } from "../../lib/graphql/queries/User"
import Title from "antd/lib/typography/Title"

export const App = () => {

  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false)
  const [ pageTitle, setPageTitle ] = useState<string>("Načítám...")
  const { loading: userLoading } = useQuery<Whoami>(USER, {
    onCompleted: (data: Whoami) => {
      if (data.whoami !== null) {
        setIsAuthenticated(true)
      }
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
            <Header isAuthenticated={ isAuthenticated } setIsAuthenticated={ setIsAuthenticated } />
          </Affix>
          <Layout.Header>
            <Title level={ 3 }>{ pageTitle }</Title>
          </Layout.Header>
          <Layout.Content className="app-content">
            <Skeleton active loading={ userLoading } paragraph={ { rows: 5 } }>
              <Switch>
                <Route exact path="/">
                  <Reservations
                    isAuthenticated={ isAuthenticated }
                    setPageTitle={ setPageTitle } />
                </Route>
                <Route exact path="/apartma">
                  <Suites
                    isAuthenticated={ isAuthenticated }
                    setPageTitle={ setPageTitle } />
                </Route>
                <Route exact path="/guests">
                  <Guests
                    isAuthenticated={ isAuthenticated }
                    setPageTitle={ setPageTitle } />
                </Route>
                <Route exact path="/login">
                  <Login
                    isAuthenticated={ isAuthenticated }
                    setIsAuthenticated={ setIsAuthenticated }
                    setPageTitle={ setPageTitle } />
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